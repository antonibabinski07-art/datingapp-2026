import { Component, inject, output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { RegisterData } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  protected creds = {} as RegisterData

  @ViewChild('registerForm') registerForm!: NgForm;
  onRegisterCancel = output();

  register() {
    this.accountService.register(this.creds).subscribe({
      next: () => this.onRegisterCancel.emit(),
      error: error => alert(error.message)
    });
  }

  cancel() {
    this.onRegisterCancel.emit();
    this.registerForm.resetForm();
  }
}
