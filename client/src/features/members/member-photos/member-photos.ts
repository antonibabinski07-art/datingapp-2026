import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/member';
import { UploadImage } from "../../../shared/upload-image/upload-image";
import { AccountService } from '../../../core/services/account-service';
import { StarBtn } from "../../../shared/star-btn/star-btn";
import { DeleteBtn } from "../../../shared/delete-btn/delete-btn";

@Component({
  selector: 'app-member-photos',
  imports: [UploadImage, StarBtn, DeleteBtn],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  private route = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected photos = signal<Photo[]>([]);
  protected uploadImageLoading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  onUploadImage(file: File) {
    this.uploadImageLoading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.uploadImageLoading.set(false);
        this.memberService.editMode.set(false);
        this.photos.update(photos => [...photos, photo]);
        if(!this.memberService.member()?.imageUrl) {
          this.setMainPhotoLocal(photo);
        }
      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.uploadImageLoading.set(false);
      }
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainPhotoLocal(photo);
      }
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => {
        this.photos.update(photosList => photosList.filter(photoEl => photoEl.id !== photo.id));
      }
    })
  }

  private setMainPhotoLocal(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if(!currentUser) {
      throw new Error('Could not get current user from the AccountService to update main photo');
    }
    currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser);
    this.memberService.member.update(member => {
      if(!member) return null;
      return {...member, imageUrl: photo.url};
    });
  }
}

