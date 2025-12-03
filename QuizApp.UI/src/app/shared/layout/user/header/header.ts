import { Component } from '@angular/core';
import { Auth } from '../../../../core/modules/auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
   constructor(public _authService: Auth, private router: Router){}

  logOut() {
    this._authService.logOutUser();
    this.router.navigate(['/auth']);
  }
}
