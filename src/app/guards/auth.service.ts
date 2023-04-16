import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = localStorage.getItem("user") !== "" && this.cookieService.get("token") !== "";
  private isLoggedin = new BehaviorSubject<boolean>(localStorage.getItem("user") !== "" && this.cookieService.get("token") !== "")

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  getUserInfo() {
    if (!localStorage.getItem("user")) {
      this.http.get('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/User', {
        headers: { "Authorization": "Bearer " + this.cookieService.get("token") }, responseType: "json"
      }
      ).subscribe(data => {
        localStorage.setItem("user", JSON.stringify({ user: data }))
        this.loggedIn = true;
        this.isLoggedin.next(true)
        this.router.navigate(['projects'])
      })
    }
  }

  singup(username: string,email: string, password: string) {
    this.http.post("https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/User", {
      "username": username,
      "email": email,
      "password": password 
    }, {responseType: "text"}).subscribe(data => {
      this.cookieService.set("token", data)
      this.getUserInfo()
    })
  }
  
  login(email: string, password: string) {
    console.log(email)
    this.http.post("https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/User/login", {
      "username": "string",
      "email": email,
      "password": password 
    }, {responseType: "text"}).subscribe(data => {
      this.cookieService.set("token", data)
      this.getUserInfo()
    })
  }

  logout() {
    this.cookieService.delete("token")
    localStorage.removeItem("user")
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
