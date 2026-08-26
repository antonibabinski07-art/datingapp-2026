import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import type{ EditableMember, Member, Photo } from '../../types/member';

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

  getMembers() {
    return this.http.get<Member[]>(this.apiBaseUrl + 'members');
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
}
