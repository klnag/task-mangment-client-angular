import { AuthService } from 'src/app/guards/auth.service';
import { Component } from '@angular/core';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {
  isLoggedIn: boolean = false
  constructor(private authGuard: AuthService, private authService: AuthService) {
  }
  ngOnInit() {
    this.authService.isLoggedIns().subscribe(res => this.isLoggedIn = res)
  }
  handleOnLogout() {
    // this.isLoggedIn = !this.isLoggedIn 
    this.authGuard.logout()
  }

}
