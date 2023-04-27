import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GlobalVariblesService } from '../store/global-varibles.service';
import { ProjectsPageComponent } from '../pages/projects-page/projects-page.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = localStorage.getItem("user") !== "" && this.cookieService.get("token") !== "";
  private isLoggedin = new BehaviorSubject<boolean>(localStorage.getItem("user") !== "" && this.cookieService.get("token") !== "")

  constructor(private location: Location,private http: HttpClient, private cookieService: CookieService, private router: Router, private store: GlobalVariblesService) {}

  getUserInfo() {
    // if (!localStorage.getItem("user")) {
    console.log(this.cookieService.get("token"))
      this.http.get('http://localhost:5242/api/User', {
        headers: { "Authorization": "Bearer " + this.cookieService.get("token") }, responseType: "json"
      }
      ).subscribe(data => {
        localStorage.setItem("user", JSON.stringify({ user: data }))
        this.loggedIn = true;
        this.isLoggedin.next(true)
        // this.location.go('/projects')
        // window.location.reload()
        this.router.navigate(['projects'])
      }, err => {
          console.log(err)
        this.cookieService.delete("token")
        localStorage.removeItem("user")
        localStorage.removeItem("project")
        this.isLoggedin.next(false)
        this.loggedIn = false;
        this.router.navigate(["login"])     
      })
    // }
  }

  singup(username: string,email: string, password: string) {
    this.http.post("http://localhost:5242/api/User", {
      "username": username,
      "email": email,
      "password": password 
    }).subscribe((data: any) => {
      console.log(data)
      this.cookieService.set("token", data.data)
      this.getUserInfo()
    }, err => {
      // this.store.errMsg =err.error.error 
      this.store.setErrMsg(err.error.error)
    })
  }
  
  login(email: string, password: string) {
    console.log(email)
    this.http.post("http://localhost:5242/api/User/login", {
      "username": "string",
      "email": email,
      "password": password 
    }).subscribe((data: any) => {
      console.log(data)
      this.cookieService.set("token", data.data)
      this.getUserInfo()
    }, err => {
      // this.store.errMsg =err.error.error 
      this.store.setErrMsg(err.error.error)
    })
  }

  logout() {
    this.cookieService.delete("token")
    localStorage.removeItem("user")
    localStorage.removeItem("project")
    this.isLoggedin.next(false)
    this.loggedIn = false;
    this.router.navigate(["login"])
  }

  isLoggedIn() {
    return this.loggedIn;
  }
isLoggedIns() {
    return this.isLoggedin.asObservable();
  }
}
