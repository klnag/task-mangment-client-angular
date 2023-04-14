import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPageService } from './project-page.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent {
  projectData = JSON.parse(localStorage.getItem("project")+"")
  projectId 
  allTodos: any[] = []
  isLoadding = false
  newTodo = ""
  selectedTask: any = {}
  isUpdatingTask = false
  isCreatingNewTodo = false
  allSelectedTodoComments = []
  commentMsg = ""
  constructor(private route: ActivatedRoute, private projectPageService: ProjectPageService) {
    this.projectId = this.route.snapshot.paramMap.get("id")
  }
  ngOnInit() {
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectId+"").subscribe((data: any) => {
      this.allTodos = data
      console.log(data)
      this.isLoadding = false 
    }, err => console.log(err))
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
    this.projectPageService.handleOnUpdateTodoStatus(todoId,title,this.projectId+"",status)
    .subscribe(data => {
      const temp = this.allTodos
      const i = temp.findIndex(todo => todo.id == todoId)
      temp[i].status = status 
      this.allTodos = temp
    })
  }

  handleOnClickDelete(todoId: string) {
    this.projectPageService.handleOnDeleteTodoStatus(todoId)
    .subscribe(data => {
      this.allTodos = this.allTodos.filter((todo: any) => todo.id !== todoId)
    })
  }

  handleOnClickTask(todo: any) {
    this.isUpdatingTask = true
    this.selectedTask = todo
    this.projectPageService.handleOnGetAllTaskComments(todo.id)
    .subscribe((data: any) => {
      this.allSelectedTodoComments = data
      console.log(data)
    })
  }

  handleOnClickSendComment() {
    if(this.commentMsg) {
      this.projectPageService.handleOnPostComment(this.selectedTask.id, this.commentMsg, JSON.parse(localStorage.getItem("user")+""))
      .subscribe((data: any) => {
        console.log(data)
      })
    }
  }
}
