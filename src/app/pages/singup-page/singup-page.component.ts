import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/guards/auth.service';

@Component({
  selector: 'app-singup-page',
  templateUrl: './singup-page.component.html',
  styleUrls: ['./singup-page.component.css']
})
export class SingupPageComponent {
  username: string = ""
  email: string = ""
  password: string = ""

  constructor(private http: HttpClient, private cookiesSerivce: CookieService, private router: Router, private authService: AuthService) {}

  handleOnSingup(){
    // console.log(this.username, this.email, this.password)
    // this.http.post("http://localhost:5242/api/User", 
    // {username: this.username, email: this.email, password: this.password},
    // {responseType: "text"}).subscribe(data => {
    //   this.cookiesSerivce.set("token", data)
    //   this.authService.singup()
    //   this.router.navigate([""])
    // })
    this.authService.singup(this.email)
  }
}
