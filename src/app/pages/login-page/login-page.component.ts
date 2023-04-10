import { Component } from '@angular/core';
import { AuthService } from 'src/app/guards/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  constructor(private authService: AuthService) {}

  handleOnLogin() {
    this.authService.login()
  }
}
