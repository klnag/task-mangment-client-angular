import { DashboardService } from './dashboard.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userData = JSON.parse(localStorage.getItem("user")+"").user
  projects: any
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.handleOnGetAllProjects().subscribe(data => {
      this.projects = data
      console.log(this.projects)
    })
  }
}
