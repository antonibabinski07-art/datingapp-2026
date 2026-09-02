import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-btn',
  imports: [],
  templateUrl: './delete-btn.html',
  styleUrl: './delete-btn.css',
})
export class DeleteBtn {
  disabled = input.required<boolean>();

  clickBtn = output<null>();

  onClickEvent() {
    this.clickBtn.emit(null);
  }
}
