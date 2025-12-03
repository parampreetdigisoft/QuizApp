import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { LoginResponseModel } from '../../models/auth-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup

  constructor(private _fb: FormBuilder, private _authService: Auth, private _router: Router) {
    this.resetForm()
  }

  resetForm() {
    this.loginForm = this._fb.group({
      username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ["", [Validators.required]]
    })
  }

  submitLogin() {
    if (this.loginForm.valid) {
      this._authService.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }).subscribe({
        next: (res: LoginResponseModel) => {
          debugger
          this._authService.createAuthCookie(res.user.userName, res.user.role, res.user.userId);
          if (res.user.role.toLocaleLowerCase() == "admin")
            this._router.navigate(['admin'])
          else
            this._router.navigate(['user'])
        },
        error: (err) => {
          alert(err);
        },
        complete: () => {

        }
      })
    }
  }
}
