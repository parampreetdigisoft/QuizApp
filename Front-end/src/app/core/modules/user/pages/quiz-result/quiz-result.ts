import { Component, Input } from '@angular/core';
import { AdminRoutingModule } from "../../../admin/admin-routing-module";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-result',
  imports: [AdminRoutingModule, RouterLink],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.css',
})
export class QuizResult {
  @Input() score!: number;
  @Input() total!: number;

}
