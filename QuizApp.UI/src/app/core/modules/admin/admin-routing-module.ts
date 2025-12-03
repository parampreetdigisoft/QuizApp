import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Analytics } from './pages/analytics/analytics';
import { Dashboard } from './pages/dashboard/dashboard';
import { ManageQuestions } from './pages/manage-questions/manage-questions';
import { ManageQuiz } from './pages/manage-quiz/manage-quiz';
import { ManageUser } from './pages/manage-user/manage-user';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'analytics',
    pathMatch: 'full'
  },
  {
    path: 'analytics',
    component: Analytics,
    title: 'Quiz dashboard'
  },
  {
    path: 'manage-questions',
    component: ManageQuestions,
    title: 'Manage questions'
  },
  {
    path: 'manage-quiz',
    component: ManageQuiz,
    title: 'Manage quiz'
  },
  {
    path: 'manage-users',
    component: ManageUser,
    title: 'Manage user'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
