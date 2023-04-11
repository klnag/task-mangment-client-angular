import { DashboardService } from './dashboard.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  isLoading = false
  userData = JSON.parse(localStorage.getItem("user")+"").user
  projects: any[] = []
  newProjectName = ""
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.isLoading = true
    this.dashboardService.handleOnGetAllProjects().subscribe((data: any) => {
      this.projects = data
      this.isLoading = false 
    })
  }

  handleOnAddProject() {
    if(this.newProjectName) {
      this.dashboardService.handleOnAddNewProject(this.newProjectName).subscribe(data => {
        this.projects.push(data)
      })
    }
  }

}
