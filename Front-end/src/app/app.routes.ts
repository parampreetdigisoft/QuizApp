import { Routes } from '@angular/router';
import { Authorized } from './shared/layout/authorized/authorized';
import { Simple } from './shared/layout/simple/simple';
import { NotFound } from './core/modules/auth/pages/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { User } from './shared/layout/user/user';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: Simple,
        loadChildren: () => import('./core/modules/auth/auth-module').then(c => c.AuthModule)
    },
    {
        path: 'admin',
        component: Authorized,
        canActivate: [authGuard, adminGuard],
        loadChildren: () =>
            import('./core/modules/admin/admin-module').then(m => m.AdminModule)
    },
    {
        path: 'user',
        component: User,
        canActivate: [authGuard],
        loadChildren: () => import('./core/modules/user/user-module').then(m => m.UserModule)
    },
    {
        path: '**',
        redirectTo:"auth/not-found",
        pathMatch:'full'
    }
];
