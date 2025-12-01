import { Component } from '@angular/core';
import { Auth } from '../../../../core/modules/auth/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public _authService: Auth){
    
  }
}
