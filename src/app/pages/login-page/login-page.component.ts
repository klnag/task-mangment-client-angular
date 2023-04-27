import { Component } from '@angular/core';
import { AuthService } from 'src/app/guards/auth.service';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  isValidInputs = false
  isLoading = false
  errMsg = ""

  data: {[key: string]: {value: string, errMsg: string}} = {
    email: { value: "", errMsg: "init"},
    password: { value: "", errMsg: "init"},
  }

  constructor(private authService: AuthService, private store: GlobalVariblesService) {

    this.store.getErrMsg().subscribe((value) => {
      this.errMsg = value
    })
  }

  handleOnLogin() {
    this.authService.login(this.data["email"].value,this.data["password"].value)
  }
  inputValidate(target: string, type: string) {
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
    
    if(!this.data["email"].errMsg && !this.data["password"].errMsg) {
      this.isValidInputs = true
    } else {

      this.isValidInputs = false 
    }
  }
}
