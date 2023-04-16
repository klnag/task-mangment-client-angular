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
  allSelectedTodoComments: any = []
  selectedTaskCreatedAt = ""
  selectedTaskUpdateAt = ""
  commentMsg = ""
  // selectedNewTodoContext = ""
  isUpdateTodoContext = false
  isTodoCommentLoading = false
  selectedTodoContext = ""
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
  handleOnUpdateTodo(todoId: string, title: string,context: string, status: string) {
    this.projectPageService.handleOnUpdateTodo(todoId,title,this.projectId+"",context,status)
    .subscribe(data => {
      // const temp = this.allTodos
      // const i = temp.findIndex(todo => todo.id == todoId)
      // temp[i].status = status 
      // this.allTodos = temp
      this.selectedTask = data
      this.selectedTodoContext =this.selectedTask.context 
      console.log(data)
    })
  }

  handleOnClickDelete() {
    this.projectPageService.handleOnDeleteTodo(this.selectedTask.id)
    .subscribe(data => {
      this.allTodos = this.allTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      this.isUpdatingTask = false
    })
  }

  handleOnClickTask(todo: any) {
    this.isTodoCommentLoading = true
    this.isUpdatingTask = true
    this.selectedTask = todo
      this.selectedTodoContext = todo.context
    console.log(todo, new Date(todo.createdAt).toLocaleString())
    this.selectedTaskCreatedAt = new Date(todo.createdAt).toLocaleString()
    this.selectedTaskUpdateAt = new Date(todo.updateddAt).toLocaleString()
    this.projectPageService.handleOnGetAllTaskComments(todo.id)
    .subscribe((data: any) => {
      this.allSelectedTodoComments = data.reverse()
      this.isTodoCommentLoading = false 
    })
  }

  handleOnClickSendComment() {
    if(this.commentMsg) {
      this.projectPageService.handleOnPostComment(this.selectedTask.id, this.commentMsg, JSON.parse(localStorage.getItem("user")+""))
      .subscribe((data: any) => {
        this.allSelectedTodoComments.unshift(data)
        this.commentMsg = ""
        console.log(data)
      })
    }
  }

  // handleOnClickUpdateSelectedTodoContext() {
  //   if(this.selectedNewTodoContext) {
  //     this.projectPageService.handleOnUpdateTodoContext(this.selectedTask.id, this.selectedNewTodoContext)
  //     .subscribe(data => {
  //       const temp = this.selectedTask
  //       temp.context = this.selectedNewTodoContext
  //       this.selectedTodoContext = this.selectedNewTodoContext
  //       this.selectedTask = temp
  //       console.log(data)
  //     })
  //   }
  // }
}
