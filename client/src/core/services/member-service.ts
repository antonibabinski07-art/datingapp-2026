import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import type{ Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.apiBaseUrl + 'members');
  }

  getMember(id: string) {
    return this.http.get<Member>(this.apiBaseUrl + 'members/' + id);
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.apiBaseUrl + 'members/' + id + '/photos');
  }
}
