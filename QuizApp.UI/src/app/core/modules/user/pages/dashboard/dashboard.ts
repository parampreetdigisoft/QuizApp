import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../../../shared/services/quiz-service';
import { forkJoin } from 'rxjs';
import { Auth } from '../../../auth/services/auth';
import { QuizAttemptsDetailModel, QuizDashboardViewModel, QuizDetailModel } from '../../../../../shared/models/quiz-detail-model';
import { AdminRoutingModule } from "../../../admin/admin-routing-module";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [AdminRoutingModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  quizList: QuizDetailModel[] = [];
  quizAttemptList: QuizAttemptsDetailModel[] = [];

  dashBoardList: QuizDashboardViewModel[] = [];
  constructor(private _quizService: QuizService, private _authService: Auth) {

  }

  ngOnInit(): void {
    this.loadUserDashboard();
  }


  loadUserDashboard() {
    forkJoin({
      quizzes: this._quizService.getAll(),
      attempts: this._quizService.attemptsByUser(this._authService.getLoggedInUserId())
    }).subscribe(result => {
      this.quizList = result.quizzes;
      this.quizAttemptList = result.attempts;
      this.bindDashboardModel()
    })
  }

  bindDashboardModel() {
    this.quizList.forEach((x: QuizDetailModel) => {
      var attempt = [...this.quizAttemptList].reverse().find(a => a.quizId === x.quizId);
      var obtainedScore = attempt?.score ?? 0;
      this._quizService.getQuestions(x.quizId).subscribe({
        next: (res) => {
          const totalScore = res.reduce((sum, q) => sum + q.points, 0);
          this.dashBoardList.push({
            description: x.description,
            obtainedScore: obtainedScore,
            points: x.points,
            quizId: x.quizId,
            timeAllowed: x.timeAllowed,
            title: x.title,
            totalScore: totalScore,
            userAttempt: attempt,
            percentage: totalScore > 0 ? Number(((obtainedScore / totalScore) * 100).toFixed(1)) : totalScore
          })
        },
        error: (err) => {

        }, complete: () => {

        }
      })
    })
  }

}
