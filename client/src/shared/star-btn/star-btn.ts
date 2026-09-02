import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-btn',
  imports: [],
  templateUrl: './star-btn.html',
  styleUrl: './star-btn.css',
})
export class StarBtn {
  disabled = input.required<boolean>();

  clickBtn = output<null>();

  onClickEvent() {
    this.clickBtn.emit(null);
  }
}
