import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './guards/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private cookieService: CookieService, private authService: AuthService) {}
  ngOnInit() {
    // if(this.cookieService.get("token")) {
    console.log(123)
      this.authService.getUserInfo()
    // }
  }
}
