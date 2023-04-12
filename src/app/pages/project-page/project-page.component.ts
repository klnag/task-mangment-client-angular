import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPageService } from './project-page.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent {
  projectId 
  allTodos: any = []
  isLoadding = false
  constructor(private route: ActivatedRoute, private projectPageService: ProjectPageService) {
    this.projectId = this.route.snapshot.paramMap.get("id")
  }
  ngOnInit() {
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectId+"").subscribe(data => {
      this.allTodos = data
      this.isLoadding = false 
    })
  }
}
