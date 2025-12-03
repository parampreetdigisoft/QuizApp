import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOptionDetialModel, CreateQuizModel, OptionsDetailModel, QuestionDetailModel, QuizAttemptModel, QuizAttemptsDetailModel, QuizDetailModel, UserAnswerDetailModel } from '../models/quiz-detail-model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private _httpClient: HttpClient) { }

  getAll(): Observable<QuizDetailModel[]> {
    return this._httpClient.get<QuizDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.quizAll}`)
  }

  getAttemptsAll(): Observable<QuizAttemptsDetailModel[]> {
    return this._httpClient.get<QuizAttemptsDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.allAttempts}`)
  }

  getQuestionsAll(): Observable<QuestionDetailModel[]> {
    return this._httpClient.get<QuestionDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.allQuestions}`)
  }
  getQuestions(id: number): Observable<QuestionDetailModel[]> {
    return this._httpClient.get<QuestionDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.questionEndpoint}/byquiz/${id}`)
  }
  getOptions(id: number): Observable<OptionsDetailModel[]> {
    return this._httpClient.get<OptionsDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.answerEndpoint}/by-question/${id}`)

  }
  createOrUpdateOption(model: CreateOptionDetialModel): Observable<object> {
    if (model.id > 0)
      return this.updateOptions(model);
    else
      return this.createOptions(model);
  }

  deleteOption(optionId: number) {
    return this._httpClient.delete<object>(`${environment.baseUrl}/${environment.endpoints.answerEndpoint}/${optionId}`);
  }

  private createOptions(model: CreateOptionDetialModel): Observable<object> {
    return this._httpClient.post<object>(`${environment.baseUrl}/${environment.endpoints.answerEndpoint}`, model);
  }

  private updateOptions(model: CreateOptionDetialModel): Observable<object> {
    return this._httpClient.put<object>(`${environment.baseUrl}/${environment.endpoints.answerEndpoint}/${model.id}`, model);
  }

  getUserAnswersAll(): Observable<UserAnswerDetailModel[]> {
    return this._httpClient.get<UserAnswerDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.allAnswers}`)
  }



  createOrUpdateQuestion(model: QuestionDetailModel): Observable<object> {
    if (model.id > 0)
      return this.updateQuestion(model);
    else
      return this.createQuestion(model);
  }


  deleteQuestion(questionId: number): Observable<object> {
    return this._httpClient.delete<object>(`${environment.baseUrl}/${environment.endpoints.questionEndpoint}/${questionId}`);
  }

  private updateQuestion(model: QuestionDetailModel): Observable<object> {
    return this._httpClient.put<object>(`${environment.baseUrl}/${environment.endpoints.questionEndpoint}/${model.id}`, model);
  }

  private createQuestion(model: QuestionDetailModel): Observable<object> {
    return this._httpClient.post<object>(`${environment.baseUrl}/${environment.endpoints.questionEndpoint}`, model);
  }

  
  getQuiz(quizId: number): Observable<QuizDetailModel> {
      return this._httpClient.get<QuizDetailModel>(`${environment.baseUrl}/${environment.endpoints.quizEndpoint}/${quizId}`)
   }

  createOrUpdateQuiz(model: CreateQuizModel): Observable<object> {
    if (model.quizId > 0)
      return this.updateQuiz(model);
    else
      return this.createQuiz(model);
  }

  private updateQuiz(model: CreateQuizModel): Observable<object> {
    return this._httpClient.put<object>(`${environment.baseUrl}/${environment.endpoints.quizEndpoint}/${model.quizId}`, model);
  }

  private createQuiz(model: CreateQuizModel): Observable<object> {
    return this._httpClient.post<object>(`${environment.baseUrl}/${environment.endpoints.quizEndpoint}`, model);
  }


  deleteQuiz(quizId: number): Observable<object> {
    return this._httpClient.delete<object>(`${environment.baseUrl}/${environment.endpoints.quizEndpoint}/${quizId}`);
  }



  attemptsByUser(userId: string): Observable<QuizAttemptsDetailModel[]> {
    return this._httpClient.get<QuizAttemptsDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.quizAttemptEndpoint}/byuser/${userId}`)
  }

  
  attempQuiz(model:QuizAttemptModel):Observable<object> {
     return this._httpClient.post<object>(`${environment.baseUrl}/${environment.endpoints.quizAttemptEndpoint}`, model);
   }
}
