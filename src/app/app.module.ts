import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SingupPageComponent } from './pages/singup-page/singup-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AlertBoxComponent } from './components/alert-box/alert-box.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    SingupPageComponent,
    NotFoundPageComponent,
    NavbarComponent,
    FooterComponent,
    ProjectsPageComponent,
    ProjectPageComponent,
    AlertBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
