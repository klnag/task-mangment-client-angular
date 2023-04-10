import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = localStorage.getItem("user") !== "" && this.cookieService.get("token") !== "";

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  login() {
    if (!localStorage.getItem("user")) {
      this.http.get('http://localhost:5242/api/User', {
        headers: { "Authorization": "Bearer " + this.cookieService.get("token") }, responseType: "json"
      }
      ).subscribe(data => {
        localStorage.setItem("user", JSON.stringify({ user: data }))
        this.loggedIn = true;
      })
    }
  }

  logout() {
    this.cookieService.delete("token")
    localStorage.removeItem("user")
    this.loggedIn = false;
    this.router.navigate(["login"])
  }

  isLoggedIn() {
    return this.loggedIn;
  }

}
