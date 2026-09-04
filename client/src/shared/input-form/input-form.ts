import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [ReactiveFormsModule],
  templateUrl: './input-form.html',
  styleUrl: './input-form.css',
})
export class InputForm implements ControlValueAccessor {
  label = input.required<string>();
  type = input('text');
  maxDate = input('');
  minDate = input('');

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  protected get control() {
    return this.ngControl.control as FormControl;
  }
  
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }
}
