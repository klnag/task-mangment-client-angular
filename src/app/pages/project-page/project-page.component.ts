import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPageService } from './project-page.service';
import { JsonPipe } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
interface Status {
  prevStatus: "TODO" | "INPROGRACE" | "DONE",
  newStatus: "TODO" | "INPROGRACE" | "DONE",
}
@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],

})
export class ProjectPageComponent {
  projectData = JSON.parse(localStorage.getItem("project")+"")
  userData = JSON.parse(localStorage.getItem("user")+"")
  isLoadding = false
  newTodo = ""
  selectedTask: any = {}
  isUpdatingTask = false
  isCreatingNewTodo = false
  allSelectedTodoComments: any = []
  selectedTaskCreatedAt = ""
  selectedTaskUpdateAt = ""
  commentMsg = ""
  isUpdateTodoContext = false
  isTodoCommentLoading = false
  selectedTodoContext = ""
  isUpdateingTodoTitle = false
  selectedTodoTitleUpdate = ""
  allTodoColTodos: any[] = []
  allInPrograceColTodos: any[] = []
  allDoneColTodos: any[] = []
  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private projectPageService: ProjectPageService) {
  }
  ngOnInit() {

    this.stringTOHtml("Hi\n there\n")
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectData.id).subscribe((data: any) => {
      data.map((todo: any) => {
        if(todo.status === "TODO") {
          this.allTodoColTodos.push(todo)
        }else if(todo.status === "INPROGRACE") {
          this.allInPrograceColTodos.push(todo)
        } else if(todo.status === "DONE") {
          this.allDoneColTodos.push(todo)
        }
      })
      console.log(this.allTodoColTodos)
      console.log(this.allInPrograceColTodos)
      console.log(this.allDoneColTodos)
      this.isLoadding = false 
    })
  }

  handleOnAddNewTodo() {
    if(this.newTodo) {
      this.projectPageService.handleOnCreateNewTodo(this.newTodo, this.projectData.id, this.userData.user.username, this.allTodoColTodos.length )
        .subscribe(data => {
          this.allTodoColTodos.push(data)
          this.newTodo = ""
          this.isCreatingNewTodo = false
          console.log(data)
        })
    }
  }
  handleOnUpdateTodo(todoId: string, title: string,context: string, status: string, username: string, index: number) {
    this.projectPageService.handleOnUpdateTodo(todoId, title, this.projectData.id, context, status, username, index)
      .subscribe(data => {
        if(status == this.selectedTask.status) {
          if(this.selectedTask.status === "TODO") {
            const i = this.allTodoColTodos.findIndex(t => t.id === this.selectedTask.id)
            this.allTodoColTodos[i].title = title
            this.allTodoColTodos[i].context = context 
          }else if(this.selectedTask.status === "INPROGRACE") {
            const i = this.allInPrograceColTodos.findIndex(t => t.id === this.selectedTask.id)
            this.allInPrograceColTodos[i].title = title
            this.allInPrograceColTodos[i].context = context 
          }else if(this.selectedTask.status === "DONE") {
            const i = this.allDoneColTodos.findIndex(t => t.id === this.selectedTask.id)
            this.allDoneColTodos[i].title = title
            this.allDoneColTodos[i].context = context 
          }
        }
        console.log(data)
        this.isUpdateTodoContext = false
        this.selectedTask = data
        this.isUpdateingTodoTitle = false

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

  drop(event: CdkDragDrop<string[]>) {
     if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
        );
    }

      let newIndex = 0
      let todoArr: any[] = []
      let todoStatus = ""
    if(event.container.id === "cdk-drop-list-0") {
      todoArr = this.allTodoColTodos
      todoStatus = "TODO"
      // const todo = this.allTodoColTodos[event.currentIndex]
      // if(this.allTodoColTodos[event.currentIndex + 1] && this.allTodoColTodos[event.currentIndex - 1]) {
      //   newIndex = (this.allTodoColTodos[event.currentIndex + 1].index - this.allTodoColTodos[event.currentIndex - 1].index) / 2
      // }else if(this.allTodoColTodos[event.currentIndex + 1]) {
      //   newIndex = this.allTodoColTodos[event.currentIndex + 1].index - 0.01 
      // } else if(this.allTodoColTodos[event.currentIndex - 1]) {
      //   newIndex = this.allTodoColTodos[event.currentIndex - 1].index + 0.01 
      // }
      // this.allTodoColTodos[event.currentIndex].index = newIndex
      // this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "TODO").subscribe()
    }else if(event.container.id === "cdk-drop-list-1") {
      todoArr = this.allInPrograceColTodos
      todoStatus = "INPROGRACE"
      // const todo = this.allInPrograceColTodos[event.currentIndex]
      // if(this.allInPrograceColTodos[event.currentIndex + 1] && this.allInPrograceColTodos[event.currentIndex - 1]) {
      //   newIndex = (this.allInPrograceColTodos[event.currentIndex + 1].index - this.allInPrograceColTodos[event.currentIndex - 1].index) / 2
      // }else if(this.allInPrograceColTodos[event.currentIndex + 1]) {
      //   newIndex = this.allInPrograceColTodos[event.currentIndex + 1].index - 0.01 
      // } else if(this.allInPrograceColTodos[event.currentIndex - 1]) {
      //   newIndex = this.allInPrograceColTodos[event.currentIndex - 1].index + 0.01 
      // }
      // this.allInPrograceColTodos[event.currentIndex].index = newIndex
      // this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE").subscribe()
    }else if(event.container.id === "cdk-drop-list-2") {
      todoArr = this.allDoneColTodos
      todoStatus = "DONE"
      // const todo = this.allDoneColTodos[event.currentIndex]
      // if(this.allDoneColTodos[event.currentIndex + 1] && this.allDoneColTodos[event.currentIndex - 1]) {
      //   newIndex = (this.allDoneColTodos[event.currentIndex + 1].index - this.allDoneColTodos[event.currentIndex - 1].index) / 2
      // }else if(this.allDoneColTodos[event.currentIndex + 1]) {
      //   newIndex = this.allDoneColTodos[event.currentIndex + 1].index - 0.01 
      // } else if(this.allDoneColTodos[event.currentIndex - 1]) {
      //   newIndex = this.allDoneColTodos[event.currentIndex - 1].index + 0.01 
      // }
      // this.allDoneColTodos[event.currentIndex].index = newIndex
      // this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "DONE").subscribe()
    }

      const todo = todoArr[event.currentIndex]
      if(todoArr[event.currentIndex + 1] && todoArr[event.currentIndex - 1]) {
        newIndex = (todoArr[event.currentIndex + 1].index - todoArr[event.currentIndex - 1].index) / 2
      }else if(todoArr[event.currentIndex + 1]) {
        newIndex = todoArr[event.currentIndex + 1].index - 0.01 
      } else if(todoArr[event.currentIndex - 1]) {
        newIndex = todoArr[event.currentIndex - 1].index + 0.01 
      }
      todoArr[event.currentIndex].index = newIndex
      console.log(newIndex)
      console.log(todoArr)
      this.projectPageService.handleOnChangePosTask(todo.id, newIndex, todoStatus).subscribe()
  }

  stringTOHtml(str: string) {
    let res = ""
    for(let i = 0; i < str.length; i++) {
      if(str[i] === '\n') {
        res += '<br>'
      }else {
        res += str[i]
      }
    }

    console.log(res)
    return res
  }
  
}
