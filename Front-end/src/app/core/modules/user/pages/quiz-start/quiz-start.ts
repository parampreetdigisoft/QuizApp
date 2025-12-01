import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../../../shared/services/quiz-service';
import { QuestionDetailModel, QuizDetailModel, UserAnswerModel } from '../../../../../shared/models/quiz-detail-model';
import { forkJoin } from 'rxjs';
import { KeyValue } from '@angular/common';
import { Auth } from '../../../auth/services/auth';
import { QuizResult } from '../quiz-result/quiz-result';

@Component({
  selector: 'app-quiz-start',
  imports: [QuizResult],
  templateUrl: './quiz-start.html',
  styleUrl: './quiz-start.css',
})
export class QuizStart implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private _quizService: QuizService,
    private _authService: Auth) { }
  quizId!: number;
  questionList: QuestionDetailModel[] = [];
  total: number = 0;
  score: number = 0;
  quizInfo: QuizDetailModel | null = null;
  submitted: boolean = false;
  quizAnswers: { questionId: number; answerId: number; isCorrect: boolean }[] = [];
  anserToSave: UserAnswerModel[] = [];

  timer: string = "";

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.queryParamMap.get('quizId'));
    if (!this.quizId)
      this.router.navigate(['/auth/not-found'])
    this.loadQuiz();
  }


  loadQuiz() {
    forkJoin({
      questions: this._quizService.getQuestions(this.quizId),
      quiz: this._quizService.getQuiz(this.quizId)
    }).subscribe(resut => {
      this.questionList = this.shuffleArray(resut.questions);
      this.quizInfo = resut.quiz
      this.startTimer(resut.quiz.timeAllowed);
    })
  }

  private shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  answerSelected(questionId: number, optionId: number) {
    const existing = this.quizAnswers.find(q => q.questionId === questionId);

    if (existing) {
      // Already answered → update
      existing.answerId = optionId;
    } else {
      // Not answered → add new entry
      this.quizAnswers.push({
        questionId: questionId,
        answerId: optionId,
        isCorrect: false
      });
    }
  }

  submitQuiz() {
    var totalQuestions = this.questionList.length;
    this.total = this.questionList.reduce((sum, q) => sum + q.points, 0);
    this.quizAnswers.forEach(c => {
      var qstn = this.questionList.find(x => x.id == c.questionId);
      var asns = qstn?.answerOptions.find(x => x.id == c.answerId);
      if (asns)
        this.score = this.score + (qstn?.points ?? 0);
      this.anserToSave.push({
        isCorrect: asns != null,
        questionId: c.questionId,
        selectedOptionId: c.answerId
      })
    })

    let userId = this._authService.getLoggedInUserId();
    this._quizService.attempQuiz({
      quizId: this.quizId,
      score: this.score,
      totalQuestions: totalQuestions,
      userId: Number(userId)
    }).subscribe({
      next: (res) => {
        this.submitted = true;
      },
      error: (err) => {

      },
      complete: () => {

      }
    })
  }

  timeLeft!: number;    // in seconds
  intervalId: any;

  startTimer(timeAllowedMinutes: number) {
    // convert minutes to seconds
    this.timeLeft = timeAllowedMinutes * 60;

    this.updateTimerDisplay(); // initial display

    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.intervalId);
        // handle timer finished

        alert("Time out");
        this.router.navigate(['/user'])

      }
    }, 1000);
  }

  // helper to format mm:ss
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  }

}
