import { Component } from '@angular/core';
import { ProjectsPageService } from './projects-page.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects-page.component.html',
})
export class ProjectsPageComponent {

  isLoading = false
  isAddNewProjectLoading = false
  userData = JSON.parse(localStorage.getItem("user")+"").user
  projects: any[] = []
  newProjectName = ""
  constructor(private projectsPageService: ProjectsPageService) {}

  ngOnInit() {
    this.isLoading = true
    this.projectsPageService.handleOnGetAllProjects().subscribe((data: any) => {
      this.projects = data
      this.isLoading = false 
    })
  }

  handleOnAddProject() {
    if(this.newProjectName) {
      this.isAddNewProjectLoading = true
      this.projectsPageService.handleOnAddNewProject(this.newProjectName).subscribe(data => {
        this.projects.push(data)
        this.newProjectName = ""
        this.isAddNewProjectLoading = true
      })
    }
  }

}
