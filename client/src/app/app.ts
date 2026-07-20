import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = signal('Dating app');
  protected members = signal<any>([]);

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/members').subscribe({
      next: response => this.members.set(response),
      error: err => console.error(err),
      complete: () => console.log("The communication went successfully")
    });
  }

  // ------------- A WAY OF SETTING IT WITCH PROMISE APROACH -------------

  // protected members = signal<any>([]);

  // async ngOnInit() {
  //   this.members.set(await this.getMembers());
  // }

  // async getMembers() {
  //   try {
  //     return lastValueFrom(this.http.get('https://localhost:5001/api/members'));
  //   } catch(err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }

  // ------------------------------------------------------------------------
}
