import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/guards/auth.service';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';

@Component({
  selector: 'app-singup-page',
  templateUrl: './singup-page.component.html',
  styleUrls: ['./singup-page.component.css']
})
export class SingupPageComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  isValidInputs = false
  isLoading = false

  errMsg = ""
  data: {[key: string]: {value: string, errMsg: string}} = {
    username: { value: "", errMsg: "init"},
    email: { value: "", errMsg: "init"},
    password: { value: "", errMsg: "init"},
  }

  constructor(private http: HttpClient, private cookiesSerivce: CookieService, private router: Router, private authService: AuthService, private store: GlobalVariblesService) {
this.store.getErrMsg().subscribe((value) => {
      this.errMsg = value
    })
  }

  handleOnSingup() {
    this.inputValidate("username","normal")
    this.inputValidate("email","email")
    this.inputValidate("password","password")
    if(!this.data["username"].errMsg && !this.data["email"].errMsg && !this.data["password"].errMsg) {
      this.isValidInputs = false
      this.isLoading = true
      this.authService.singup(this.data["username"].value, this.data["email"].value,this.data["password"].value)
    }
  }
  inputValidate(target: string, type: string) {
    console.log(this.isValidInputs)
    if (type === "normal") {
      if (!this.data[target].value) this.data[target].errMsg = `${target} is empty` 
      else if (this.data[target].value.length < 3) this.data[target].errMsg = `${target} is less than 3 chars`
      else this.data[target].errMsg = ""
    } else if(type === "email") {
      if (!this.data[target].value) this.data[target].errMsg = `${target} is empty` 
      else if (this.data[target].value.length < 8) this.data[target].errMsg = `${target} is less than 8 chars`
      else if (!this.emailPattern.test(this.data[target].value)) this.data[target].errMsg = `${target} must be an email`
      else this.data[target].errMsg = ""
    } else if(type === "password") {
      if (!this.data[target].value) this.data[target].errMsg = `${target} is empty` 
      else if (this.data[target].value.length < 8) this.data[target].errMsg = `${target} is less than 8 chars`
      else this.data[target].errMsg = ""
    }
    
    if(!this.data["username"].errMsg && !this.data["email"].errMsg && !this.data["password"].errMsg) {
      this.isValidInputs = true
    }
  }
}
