import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddProfileComponent } from './components/add-profile/add-profile.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './components/users/index/index.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate : [ LoggedGuard ],
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'register',
    canActivate : [ LoggedGuard ],
    component: RegisterComponent,
    data: {
      title: 'Register'
    }
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    canActivate : [ AuthGuard ],
    path: '',
    component: HomeComponent,
    children : [
      {
        path: 'index',
        component: IndexComponent,
      },
      {
        path: 'users/add',
        component: AddUserComponent,
      },
      {
        path: 'users/edit/:id',
        component: AddUserComponent,
      },
      {
        path: 'profile/add',
        component: AddProfileComponent,
      },
    ]
  },

  { path: '**', redirectTo: 'index' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
