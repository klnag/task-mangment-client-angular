import { Component } from '@angular/core';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {

  isLoading = false
  isAddNewProjectLoading = false
  userData = JSON.parse(localStorage.getItem("user")+"").user
  projects: any[] = []
  newProjectName = ""
  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.isLoading = true
    this.projectsService.handleOnGetAllProjects().subscribe((data: any) => {
      this.projects = data
      this.isLoading = false 
    })
  }

  handleOnAddProject() {
    if(this.newProjectName) {
      this.isAddNewProjectLoading = true
      this.projectsService.handleOnAddNewProject(this.newProjectName).subscribe(data => {
        this.projects.push(data)
        this.newProjectName = ""
        this.isAddNewProjectLoading = true
      })
    }
  }

}
