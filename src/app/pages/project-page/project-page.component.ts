import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPageService } from './project-page.service';
import { JsonPipe } from '@angular/common';

interface Status {
  prevStatus: "TODO" | "INPROGRACE" | "DONE",
  newStatus: "TODO" | "INPROGRACE" | "DONE",
}
@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProjectPageComponent {
  projectData = JSON.parse(localStorage.getItem("project")+"")
  // projectId 
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
  isUpdateingTodoTitle = false
  selectedTodoTitleUpdate = ""
  allTodoColTodos: any[] = []
  allInPrograceColTodos: any[] = []
  allDoneColTodos: any[] = []
  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private projectPageService: ProjectPageService) {
    // this.projectId = this.route.snapshot.paramMap.get("id")
  }
  ngOnInit() {
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectData.id).subscribe((data: any) => {
      // this.allTodos = data
      // console.log(data)
      // const allTodoColTodosTemp: any[] = []
      data.map((todo: any) => {
        if(todo.status === "TODO") {
          this.allTodoColTodos.push(todo)
        }else if(todo.status === "INPROGRACE") {
          this.allInPrograceColTodos.push(todo)
        } else if(todo.status === "DONE") {
          this.allDoneColTodos.push(todo)
        }
      })
      // console.log(this.allTodoColTodos)
      // console.log(this.allInPrograceColTodos)
      // console.log(this.allDoneColTodos)
      this.isLoadding = false 
    })
  }

  handleOnAddNewTodo() {
    if(this.newTodo) {
      this.projectPageService.handleOnCreateNewTodo(this.newTodo, this.projectData.id)
        .subscribe(data => {
          this.allTodoColTodos.push(data)
          this.newTodo = ""
          this.isCreatingNewTodo = false
          console.log(data)
        })
    }
  }
  handleOnUpdateTodo(todoId: string, title: string,context: string, status: Status) {
    // const temp = 
    this.projectPageService.handleOnUpdateTodo(todoId, title, this.projectData.id, context, status.newStatus)
      .subscribe(data => {
        if (status.prevStatus !== status.newStatus) {
          if (status.prevStatus === "TODO") {
            this.allTodoColTodos = this.allTodoColTodos.filter(todo => todo.id !== todoId)
            this.allInPrograceColTodos.push(data)
          }else if (status.prevStatus === "INPROGRACE") {
            this.allInPrograceColTodos = this.allInPrograceColTodos.filter(todo => todo.id !== todoId)
            if(status.newStatus === "TODO") {
              this.allTodoColTodos.push(data)
            }else if(status.newStatus === "DONE") {
              this.allDoneColTodos.push(data)
            }
          }else if (status.prevStatus === "DONE") {
            this.allDoneColTodos = this.allDoneColTodos.filter(todo => todo.id !== todoId)
            this.allInPrograceColTodos.push(data)
          }
        }
      })
  }

  handleOnClickDelete() {
    this.projectPageService.handleOnDeleteTodo(this.selectedTask.id)
    .subscribe(data => {
      if(this.selectedTask.status === "TODO") {
        this.allTodoColTodos = this.allTodoColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }else if(this.selectedTask.status === "INPROGRACE") {
        this.allInPrograceColTodos = this.allInPrograceColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }else if(this.selectedTask.status === "DONE") {
        this.allDoneColTodos = this.allDoneColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }
      // this.allTodos = this.allTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
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
