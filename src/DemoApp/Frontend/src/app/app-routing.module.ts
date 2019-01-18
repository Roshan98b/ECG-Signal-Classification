import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminContentComponent } from './components/admin/admin-content/admin-content.component';
import { DisplayComponent } from './components/admin/admin-content/display/display.component';
import { UserComponent } from './components/user/user.component';
import { UserContentComponent } from './components/user/user-content/user-content.component';
import { UserDisplayComponent } from './components/user/user-content/user-display/user-display.component';
import { UploadComponent } from './components/user/user-content/upload/upload.component';
import { AdminGuard } from './guard/admin/admin.guard';
import { UserGuard } from './guard/user/user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'resetPassword/:id',
    component: ResetPasswordComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'content',
        pathMatch: 'full'
      },
      {
        path: 'content',
        component: AdminContentComponent,
        children: [
          {
            path: '',
            redirectTo: 'display',
            pathMatch: 'full'
          },
          {
            path: 'display',
            component: DisplayComponent,
            canActivate: [AdminGuard]
          }
        ]
      }
    ]
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'content',
        pathMatch: 'full'
      },
      {
        path: 'content',
        component: UserContentComponent,
        children: [
          {
            path: '',
            redirectTo: 'display',
            pathMatch: 'full'
          },
          {
            path: 'display',
            component: UserDisplayComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'upload',
            component: UploadComponent,
            canActivate: [UserGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
