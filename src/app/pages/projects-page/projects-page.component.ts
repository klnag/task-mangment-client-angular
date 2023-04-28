import { Component } from '@angular/core';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';
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
  localStorage = localStorage

  errMsg = ""
  constructor(private projectsPageService: ProjectsPageService,  private store: GlobalVariblesService) {
this.store.getErrMsg().subscribe((value) => {
      this.errMsg = value
    })
  }

  ngOnInit() {
    console.log(111)
    this.handleOnGetAllUserProjects()
  }

  handleOnGetAllUserProjects(){
this.isLoading = true
    this.projectsPageService.handleOnGetAllProjects(this.userData.id).subscribe((data: any) => {
      console.log(data)
      this.projects = data
      this.isLoading = false 
    })
  }

  handleOnAddProject() {
    if(this.newProjectName) {
      this.isAddNewProjectLoading = true
      this.projectsPageService.handleOnAddNewProject(this.newProjectName).subscribe((data: any) => {
        this.projects.push(data.data)
      console.log(data.data)
        this.newProjectName = ""
        this.isAddNewProjectLoading = false 
      }, err => {
        this.store.setErrMsg(err.error.error)
        this.isAddNewProjectLoading = false 
      })
    }
  }

  jsonToString(json: any) {
    return JSON.stringify(json)
  }

}
