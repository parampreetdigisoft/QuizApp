import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizService } from '../../../../../shared/services/quiz-service';
import { OptionsDetailModel, QuestionDetailModel, QuizDetailModel } from '../../../../../shared/models/quiz-detail-model';
import { FormatDatePipe } from '../../../../../format-date-pipe';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';

declare var bootstrap: any;

@Component({
  selector: 'app-manage-quiz',
  imports: [ReactiveFormsModule, FormsModule, FormatDatePipe, CommonModule, PaginationComponent],
  templateUrl: './manage-quiz.html',
  styleUrl: './manage-quiz.css',
})
export class ManageQuiz implements OnInit, AfterViewInit {

  quizForm!: FormGroup
  quizList: QuizDetailModel[] = [];
  questionList: QuestionDetailModel[] = [];
  editingQuizId: number = 0;
  optionsDetail: OptionsDetailModel[] = [];
  questionId: number | null = null;

  formOption!: FormGroup;
  formQuestion!: FormGroup;
  formQuiz!: FormGroup;
  searchText: string = '';
  currentPage: number = 1;
  totalPage: number = 0; // total items
  pageSize: number = 10;


  constructor(private _quizService: QuizService, private _fb: FormBuilder) {
    this.resetOptionForm('', false, null, null);
    this.resetQuestionForm(0, 0, '', 1);
    this.resetQuizForm(0, '', '', 30);
  }

  ngOnInit(): void {
    this.getQuizes();
  }

  ngAfterViewInit() {
    // Fix for nested modals - prevent parent modals from closing
    this.setupNestedModals();
  }

  setupNestedModals() {
    // When any modal is shown, adjust z-index and backdrop
    document.addEventListener('show.bs.modal', (event: any) => {
      const modals = document.querySelectorAll('.modal.show');
      const zIndex = 1050 + (10 * modals.length);
      const modal = event.target;

      setTimeout(() => {
        modal.style.zIndex = zIndex.toString();
        const backdrop = document.querySelector('.modal-backdrop:last-of-type') as HTMLElement;
        if (backdrop) {
          backdrop.style.zIndex = (zIndex - 1).toString();
        }
      }, 0);
    });

    // When a modal is hidden, ensure body classes are maintained if other modals are open
    document.addEventListener('hidden.bs.modal', () => {
      const openModals = document.querySelectorAll('.modal.show');
      if (openModals.length > 0) {
        document.body.classList.add('modal-open');

        // Ensure at least one backdrop exists
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length === 0) {
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }
    });
  }

  openOptionsModal(questionId: number) {
    this.getOptions(questionId);
    setTimeout(() => {
      const optionsModal = new bootstrap.Modal(document.getElementById('optionsModal'));
      optionsModal.show();
    }, 100);
  }

  openOptionEditModal(optionId: number, questionId: number) {
    this.editOption(optionId, questionId);
    setTimeout(() => {
      const optionModal = new bootstrap.Modal(document.getElementById('optionModal'));
      optionModal.show();
    }, 100);
  }

  openQuestionModal(quizId: number, questionId: number, text: string, point: number) {
    this.resetQuestionForm(quizId, questionId, text, point);
    setTimeout(() => {
      const questionModal = new bootstrap.Modal(document.getElementById('questionModal'));
      questionModal.show();
    }, 100);
  }

  pageChange(pageNumber:number){
    this.currentPage = pageNumber;
  }
  get quizFilterList() {
    if (!this.searchText) {
      this.totalPage =this.quizList.length;
      return this.quizList.slice((this.currentPage - 1)*this.pageSize ,this.currentPage *this.pageSize);
    }
    const text = this.searchText.toLowerCase();

    let result = this.quizList.filter(q =>
      (q.quizId || '').toString().includes(text) ||
      (q.title || '').toLowerCase().includes(text) ||
      (q.description || '')?.toLowerCase().includes(text) ||
      (q.createdBy || '').toString().includes(text) ||
      (q.isActive || '').toString().toLowerCase().includes(text) ||
      (q.timeAllowed || '').toString().includes(text) ||
      (q.points || '').toString().includes(text) ||
      (new Date(q.createdAt) || '').toLocaleString().toLowerCase().includes(text)
    );
    let finalResult = result.slice((this.currentPage - 1)*this.pageSize ,this.currentPage *this.pageSize);
    this.totalPage =finalResult.length;
    return finalResult;
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
    if (!option && optionId !=0)
      alert("Option not found");
    else {
      this.resetOptionForm(option?.text || "", option?.isCorrect || false, questionId, option?.id || 0);
    }
  }
  onPageSizeChange(){
    this.currentPage =1;
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
          this.closeModal('optionModal');
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
          this.getQuestions(this.formQuestion.value.quizId);
          this.closeModal('questionModal');
        },
        error: (err) => {
          this.getQuestions(this.formQuestion.value.quizId);
          this.closeModal('questionModal');
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

  saveQuiz(modelId ='quizModal') {
    if (this.formQuiz.valid) {
      this._quizService.createOrUpdateQuiz({
        description: this.formQuiz.value.description,
        title: this.formQuiz.value.text,
        quizId: this.formQuiz.value.id,
        timeAllowed: this.formQuiz.value.time
      }).subscribe({
        next: (res) => {
          alert("Saved Successfuly!");  
          this.closeModal(modelId);
        },
        error: (err) => {
          this.closeModal(modelId);
        },
        complete: () => {
          this.closeModal(modelId);
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

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}