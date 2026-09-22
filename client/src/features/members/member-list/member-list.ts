import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';

import { MemberService } from '../../../core/services/member-service';
import { MemberParams, type Member } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { PaginationResult } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginationResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if(filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }
  
  ngOnInit(): void {
    this.loadMembers();
  }

  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  private loadMembers() {
    this.memberService.getMembers(this.memberParams)
      .subscribe({
        next: result => this.paginatedMembers.set(result)
      });
  }

  openModal() {
    this.modal.open();
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = {...data};
    this.updatedParams = {...data};
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessage(): string {
    const deafultParams = new MemberParams();
    const filters: string[] = [];

    if(this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's');
    } else {
      filters.push('Males, Females');
    }

    if(this.updatedParams.minAge !== deafultParams.minAge || this.updatedParams.maxAge !== deafultParams.maxAge) {
      filters.push(`Ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

    return filters.join('  |  ');
  }
}
