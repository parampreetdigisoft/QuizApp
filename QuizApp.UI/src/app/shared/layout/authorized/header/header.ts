import { Component } from '@angular/core';
import { Auth } from '../../../../core/modules/auth/services/auth';
import { AdminRoutingModule } from "../../../../core/modules/admin/admin-routing-module";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [AdminRoutingModule,RouterLink],
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
