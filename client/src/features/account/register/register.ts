import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegisterData } from '../../../types/user';
import { InputForm } from "../../../shared/input-form/input-form";
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  protected credentialsForm: FormGroup;
  protected creds = {} as RegisterData;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  onRegisterCancel = output();

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.profileForm = this.fb.group({
      gender: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.validateDateOfBirth()]],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.credentialsForm.controls['password'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
      });
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if(!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : {passwordMismatch: true};
    }
  }

  private validateDateOfBirth(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if(!parent) return null;

      const value = String(control.value).trim();
      if(/^(\d{2})([./-])(\d{2})\2(\d{4})$/.exec(value)) return {invalidDate: true};

      const providedDate = new Date(control.value).getTime();
      const minDate = new Date(this.minDate).getTime();
      const maxDate = new Date(this.maxDate).getTime();

      if(!Number.isNaN(providedDate) && (providedDate >= minDate && providedDate <= maxDate)) return null;

      return {invalidDate: true};
    }
  }

  protected get maxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  protected get minDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 100);
    return today.toISOString().split('T')[0];
  }

  nextStep() {
    this.currentStep.update(step => step + 1);
  }

  prevStep() {
    this.currentStep.update(step => step - 1);
  }

  register() {
    if(this.credentialsForm.valid && this.profileForm.valid) {
      const formData = {...this.credentialsForm.value, ...this.profileForm.value};

      this.accountService.register(formData).subscribe({
        next: () => this.router.navigateByUrl('/members'),
        error: error => {
          this.validationErrors.set(error);
          console.log(error)
        }
      });
    }
  }

  cancel() {
    this.onRegisterCancel.emit();
    this.credentialsForm.reset();
    this.profileForm.reset();
  }
}
