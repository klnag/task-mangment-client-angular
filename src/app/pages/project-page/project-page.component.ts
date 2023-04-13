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
  newTodo = ""
  isCreatingNewTodo = false
  constructor(private route: ActivatedRoute, private projectPageService: ProjectPageService) {
    this.projectId = this.route.snapshot.paramMap.get("id")
  }
  ngOnInit() {
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectId+"").subscribe(data => {
      this.allTodos = data
      console.log(data)
      this.isLoadding = false 
    })
  }

  handleOnAddNewTodo() {
    if(this.newTodo) {
      this.projectPageService.handleOnCreateNewTodo(this.newTodo, this.projectId+"")
        .subscribe(data => {
          this.allTodos.push(data)
          this.newTodo = ""
          this.isCreatingNewTodo = false
          console.log(data)
        })
    }
  }
  handleOnClickMove(todoId: string, title: string, status: string) {
    console.log(todoId, title, status)
    this.projectPageService.handleOnUpdateTodoStatus(todoId,title,this.projectId+"",status)
    .subscribe(data => {
      this.allTodos = data
      console.log(data)
    })
  }
}
