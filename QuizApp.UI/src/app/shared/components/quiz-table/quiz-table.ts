import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { QuizService } from '../../services/quiz-service';
import { UserService } from '../../services/user-service';
import { QuestionDetailModel, QuestionDifficulty, QuizAttemptsDetailModel, QuizDashboardDetailModel, QuizDetailModel, UserAnswerDetailModel } from '../../models/quiz-detail-model';
import { UserDetailModel } from '../../../core/modules/auth/models/auth-model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-quiz-table',
  imports: [],
  templateUrl: './quiz-table.html',
  styleUrl: './quiz-table.css',
})
export class QuizTable implements OnInit {

  quizzes: QuizDetailModel[] = [];
  allAttempts: QuizAttemptsDetailModel[] = [];
  allQuestions: QuestionDetailModel[] = [];
  allAnswers: UserAnswerDetailModel[] = [];
  allUsers: UserDetailModel[] = [];
  dashboardModel: QuizDashboardDetailModel[] = [];
  constructor(private _quizService: QuizService, private _userService: UserService) {

  }
  ngOnInit(): void {
    this.loadData();
  }

  loadChart() {
    const labels = this.dashboardModel.map(x => x.title);
    const avgScores = this.dashboardModel.map(x => x.averageScore);
    const highestScores = this.dashboardModel.map(x => x.highestScore);
    new Chart("quizChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Average Score',
            data: avgScores
          },
          {
            label: 'Highest Score',
            data: highestScores
          }
        ]
      }
    });
  }
  loadData() {
    forkJoin({
      quizzes: this._quizService.getAll(),
      allAttempts: this._quizService.getAttemptsAll(),
      allQuestions: this._quizService.getQuestionsAll(),
      allAnswers: this._quizService.getUserAnswersAll(),
      allUsers: this._userService.getAll()
    }).subscribe(result => {
      this.quizzes = result.quizzes;
      this.allAttempts = result.allAttempts;
      this.allQuestions = result.allQuestions;
      this.allAnswers = result.allAnswers;
      this.allUsers = result.allUsers;
      this.bindQuiz();
      this.loadChart();
    });
  }

  bindQuiz() {
    const userLookup: { [key: number]: string } = {};
    this.allUsers.forEach(u => {
      userLookup[u.userId] = u.userName;
    });
    this.quizzes.forEach((x: QuizDetailModel) => {
      var quizAttempts = this.allAttempts.filter(c => c.quizId == x.quizId);
      var totalAttempts = quizAttempts.length;
      var userCount = new Set(quizAttempts.map(a => a.userId)).size;
      const topAttempt = quizAttempts.slice().sort((a, b) => b.score - a.score)[0] || null;
      let highestScorerName = "N/A";
      if (topAttempt && userLookup[topAttempt.userId]) {
        highestScorerName = userLookup[topAttempt.userId];
      }
      const avgScore = quizAttempts.length > 0
        ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
        : 0;

      const quizQuestions = this.allQuestions.filter(q => q.quizId === x.quizId);
      const questionDifficulty: QuestionDifficulty[] = [];

      for (const question of quizQuestions) {

        const answersForQuestion = this.allAnswers.filter(a => a.questionId === question.id);

        if (answersForQuestion.length > 0) {
          const correctCount = answersForQuestion.filter(a => a.isCorrect).length;
          const totalCount = answersForQuestion.length;

          const difficulty =
            totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

          questionDifficulty.push({
            questionText: question.questionText,
            correctPercentage: difficulty
          });
        }
      }

      const mostDifficult = questionDifficulty.slice()
        .sort((a, b) => a.correctPercentage - b.correctPercentage)[0] || null;
      this.dashboardModel.push({
        quizId: x.quizId,
        title: x.title,
        totalAttempts: totalAttempts,
        userCount: userCount,
        highestScorerName: highestScorerName,
        highestScore: topAttempt ? topAttempt.score : 0,
        averageScore: avgScore,
        mostDifficultQuestion: mostDifficult ? mostDifficult.questionText : "N/A",
        difficultQuestionAccuracy: mostDifficult ? mostDifficult.correctPercentage : 0
      });
    })
  }
}
