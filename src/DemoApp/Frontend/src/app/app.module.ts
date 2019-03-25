import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminContentComponent } from './components/admin/admin-content/admin-content.component';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';
import { AdminTopNavBarComponent } from './components/admin/admin-top-nav-bar/admin-top-nav-bar.component';
import { AdminSideNavBarComponent } from './components/admin/admin-side-nav-bar/admin-side-nav-bar.component';
import { DisplayComponent } from './components/admin/admin-content/display/display.component';
import { UserComponent } from './components/user/user.component';
import { UserContentComponent } from './components/user/user-content/user-content.component';
import { UserFooterComponent } from './components/user/user-footer/user-footer.component';
import { UserTopNavBarComponent } from './components/user/user-top-nav-bar/user-top-nav-bar.component';
import { UserSideNavBarComponent } from './components/user/user-side-nav-bar/user-side-nav-bar.component';
import { UserDisplayComponent } from './components/user/user-content/user-display/user-display.component';
import { UploadComponent } from './components/user/user-content/upload/upload.component';
import { AcquisitionComponent } from './components/user/user-content/acquisition/acquisition.component';
import { DevDisplayComponent } from './components/user/user-content/dev-display/dev-display.component';
import { AllDevDisplayComponent } from './components/admin/admin-content/all-dev-display/all-dev-display.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminComponent,
    AdminContentComponent,
    AdminFooterComponent,
    AdminTopNavBarComponent,
    AdminSideNavBarComponent,
    DisplayComponent,
    UserComponent,
    UserContentComponent,
    UserFooterComponent,
    UserTopNavBarComponent,
    UserSideNavBarComponent,
    UserDisplayComponent,
    UploadComponent,
    AcquisitionComponent,
    DevDisplayComponent,
    AllDevDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
