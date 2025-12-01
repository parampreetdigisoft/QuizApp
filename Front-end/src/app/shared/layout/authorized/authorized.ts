import { Component } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authorized',
  imports: [Header,RouterOutlet],
  templateUrl: './authorized.html',
  styleUrl: './authorized.css',
})
export class Authorized {

}
