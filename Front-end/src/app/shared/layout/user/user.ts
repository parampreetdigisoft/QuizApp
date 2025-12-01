import { Component } from '@angular/core';
import { AdminRoutingModule } from "../../../core/modules/admin/admin-routing-module";
import { Header } from "./header/header";

@Component({
  selector: 'app-user',
  imports: [AdminRoutingModule, Header],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

}
