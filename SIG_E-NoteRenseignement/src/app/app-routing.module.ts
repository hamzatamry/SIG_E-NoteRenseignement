import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'nr',
    loadChildren: () => import('./front_end/note-requester/tab-bar/tab-bar.module').then( m => m.TabBarPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'as',
    loadChildren: () => import('./front_end/agency-staff/tab-bar/tab-bar.module').then( m => m.TabBarPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => import('./front_end/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
