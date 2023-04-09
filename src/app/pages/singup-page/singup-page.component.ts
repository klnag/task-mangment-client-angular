import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-singup-page',
  templateUrl: './singup-page.component.html',
  styleUrls: ['./singup-page.component.css']
})
export class SingupPageComponent {
  username: string = ""
  email: string = ""
  password: string = ""

  constructor(private http: HttpClient, private cookiesSerivce: CookieService) {}

  singup(){
    console.log(this.username, this.email, this.password)
    this.http.post("http://localhost:5242/api/User", 
    {username: this.username, email: this.email, password: this.password},
    {responseType: "text"}).subscribe(data => this.cookiesSerivce.set("token", data))
  }
}
