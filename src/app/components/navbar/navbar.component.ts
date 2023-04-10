import { AuthService } from 'src/app/guards/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {
  constructor(private authGuard: AuthService) {}
  handleOnLogout() {
    this.authGuard.logout()
  }
}
