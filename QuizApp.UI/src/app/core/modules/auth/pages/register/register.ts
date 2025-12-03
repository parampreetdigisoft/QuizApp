import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../shared/services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  form!: FormGroup
  constructor(private fb: FormBuilder, private _userService: UserService, private _router: Router) {
    this.resetForm();
  }

  resetForm() {
    this.form = this.fb.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      role: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    })
  }

  // Custom validator to check password match
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  createUser() {
    if (this.form.valid) {
      this._userService.createOrUpdate({
        email: this.form.value.email,
        id: 0,
        password: this.form.value.password,
        role: this.form.value.role,
        username: this.form.value.username,
        confirmPassword: this.form.value.password
      }).subscribe({
        next: (res) => {
          alert("Register successfully!")
        },
        error: (err) => {

        }, complete: () => {
          this._router.navigate(['/auth'])
        }
      })
    }
  }
}
