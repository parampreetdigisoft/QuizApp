import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { QuizResult } from './pages/quiz-result/quiz-result';
import { QuizStart } from './pages/quiz-start/quiz-start';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: Dashboard,
    title: 'Dashboard'
  },  {
    path: 'quiz-start',
    component: QuizStart,
    title: 'Quiz start'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
