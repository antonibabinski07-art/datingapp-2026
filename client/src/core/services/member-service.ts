import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import type{ EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { PaginationResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();
    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('orderBy', memberParams.orderBy);
    if(memberParams.gender) params = params.append('gender', memberParams.gender);

    return this.http.get<PaginationResult<Member>>(this.apiBaseUrl + 'members', {params}).pipe(
      tap(() => localStorage.setItem('filters', JSON.stringify(memberParams)))
    );
  }

  getMember(id: string) {
    return this.http.get<Member>(this.apiBaseUrl + 'members/' + id).pipe(
      tap(data => this.member.set(data))
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.apiBaseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.apiBaseUrl + 'members', member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.apiBaseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.apiBaseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.apiBaseUrl + 'members/delete-photo/' + photo.id);
  }
}
