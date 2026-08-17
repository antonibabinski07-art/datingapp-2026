import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/member';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId) {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }
}
