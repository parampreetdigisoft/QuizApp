import { Component } from '@angular/core';
import { AdminRoutingModule } from "../../../core/modules/admin/admin-routing-module";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-simple',
  imports: [AdminRoutingModule,RouterOutlet],
  templateUrl: './simple.html',
  styleUrl: './simple.css',
})
export class Simple {

}
