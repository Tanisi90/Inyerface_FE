import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { VideoComponent } from './video/video.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'congrats', component: VideoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule  { 
 }
