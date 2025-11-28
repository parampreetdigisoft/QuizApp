import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizService } from '../../../../../shared/services/quiz-service';
import { OptionsDetailModel, QuestionDetailModel, QuizDetailModel } from '../../../../../shared/models/quiz-detail-model';
import { FormatDatePipe } from '../../../../../format-date-pipe';

@Component({
  selector: 'app-manage-quiz',
  imports: [ReactiveFormsModule, FormatDatePipe],
  templateUrl: './manage-quiz.html',
  styleUrl: './manage-quiz.css',
})
export class ManageQuiz implements OnInit {

  quizForm!: FormGroup
  quizList: QuizDetailModel[] = [];
  questionList: QuestionDetailModel[] = [];
  editingQuizId: number = 0;
  optionsDetail: OptionsDetailModel[] = [];
  questionId: number | null = null;

  formOption!: FormGroup;
  formQuestion!: FormGroup;
  formQuiz!: FormGroup;

  constructor(private _quizService: QuizService, private _fb: FormBuilder) {
    this.resetOptionForm('', false, null, null);
    this.resetQuestionForm(0, 0, '', 1);
    this.resetQuizForm(0, '', '', 30);
  }
  ngOnInit(): void {
    this.getQuizes();
  }

  resetOptionForm(text: string, isCorrect: boolean, questionId: number | null, id: number | null) {
    this.formOption = this._fb.group({
      id: [id],
      questionId: [questionId],
      text: [text, [Validators.required]],
      isCorrect: [isCorrect]
    })
  }

  resetQuestionForm(quizId: number, questionId: number, text: string, point: number) {
    point = point <= 0 ? 1 : point;
    this.formQuestion = this._fb.group({
      quizId: [quizId],
      questionId: [questionId],
      text: [text, [Validators.required, Validators.minLength(5)]],
      point: [point, [Validators.required]]
    })
  }

  resetQuizForm(id: number, text: string, description: string, time: number) {
    this.formQuiz = this._fb.group({
      id: [id],
      description: [description, [Validators.required]],
      text: [text, [Validators.required]],
      time: [time, [Validators.required]]
    })
  }

  getQuizes() {
    this._quizService.getAll().subscribe({
      next: (res: QuizDetailModel[]) => {
        this.quizList = res;
      },
      error: (err) => {

      }, complete: () => {

      }
    })
  }

  getQuestions(quizId: number) {
    this._quizService.getQuestions(quizId).subscribe({
      next: (res: QuestionDetailModel[]) => {
        this.questionList = res;
        this.editingQuizId = quizId;
      },
      error: (err) => {

      }, complete: () => {

      }
    })
  }
  getOptions(questionId: number) {
    this._quizService.getOptions(questionId).subscribe({
      next: (res: OptionsDetailModel[]) => {
        this.optionsDetail = res;
        this.questionId = questionId;
      },
      error: (err) => {

      }, complete: () => {

      }
    })
  }

  editOption(optionId: number, questionId: number) {
    var option = this.optionsDetail.find(x => x.id == optionId);
    if (!option)
      alert("Option not found");
    else {
      this.resetOptionForm(option.text, option.isCorrect, questionId, option.id);
    }
  }

  saveOption() {
    if (this.formOption.valid) {
      this._quizService.createOrUpdateOption({
        id: this.formOption.value.id,
        isCorrect: this.formOption.value.isCorrect,
        questionId: this.formOption.value.questionId,
        optionText: this.formOption.value.text
      }).subscribe({
        next: (res) => {
          alert("Saved successfully!");
          this.getOptions(this.formOption.value.questionId);
        },
        error: (err) => {
          this.getOptions(this.formOption.value.questionId);
        }, complete: () => {

        }
      })
    }
  }

  deleteOption(optionId: number, questionId: number) {
    if (confirm("Are you sure?")) {
      this._quizService.deleteOption(optionId).subscribe({
        next: (res) => {
          alert("Deleted successfully!");
          this.getOptions(questionId);
        },
        error: (err) => {

        }, complete: () => {

        }
      })
    }
  }

  saveQuestion() {
    if (this.formQuestion.valid) {
      this._quizService.createOrUpdateQuestion({
        id: this.formQuestion.value.questionId,
        points: this.formQuestion.value.point,
        quizId: this.formQuestion.value.quizId,
        questionText: this.formQuestion.value.text,
        answerOptions: []
      }).subscribe({
        next: (res) => {
          alert("Save successfuly!");
          this.getQuestions(this.formQuestion.value.quizId)
        },
        error: (err) => {

        },
        complete: () => {

        }
      })
    }
  }

  deleteQuestion(questionId: number, quizId: number) {
    if (confirm("Are you sure?")) {
      this._quizService.deleteQuestion(questionId).subscribe({
        next: (res) => {
          alert("Deleted successfully!");

        },
        error: (err) => {

        }, complete: () => {
          this.getQuestions(quizId);
        }
      })
    }
  }

  saveQuiz() {
    if (this.formQuiz.valid) {
      this._quizService.createOrUpdateQuiz({
        description: this.formQuiz.value.description,
        title: this.formQuiz.value.text,
        quizId: this.formQuiz.value.id,
        timeAllowed: this.formQuiz.value.time
      }).subscribe({
        next: (res) => {
          alert("Saved Successfuly!");
        },
        error: (err) => {
        },
        complete: () => {
          this.getQuizes();
        }
      })
    }
  }

  deleteQuiz(quizId: number) {
    if (confirm("Are you sure?")) {
      this._quizService.deleteQuiz(quizId).subscribe({
        next: (res) => {
          alert("Deleted successfully!");

        },
        error: (err) => {

        }, complete: () => {
          this.getQuizes();
        }
      })
    }
  }
}
