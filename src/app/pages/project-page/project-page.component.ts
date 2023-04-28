import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPageService } from './project-page.service';
import { JsonPipe } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';
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
  newShareProjectEmail = ""

  errMsg = ""
  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private projectPageService: ProjectPageService, private store: GlobalVariblesService) {
this.store.getErrMsg().subscribe((value) => {
      this.errMsg = value
    }, err => {
        this.store.setErrMsg(err.error.error)
      })
  }
  ngOnInit() {
    this.stringTOHtml("Hi\n there\n")
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectData.id).subscribe((res: any) => {
      const data = res.data
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
    }, err => {
        this.store.setErrMsg(err.error.error)
      })
    console.log(this.projectData)
  }

  handleOnAddNewTodo() {
    if(this.newTodo) {
          this.allTodoColTodos.push({id: -1,title: this.newTodo, projectId: this.projectData.id, username: this.userData.user.username,index: this.allTodoColTodos.length-1,context: "", assignTo: "", priority: "low"})
          this.isCreatingNewTodo = false
      this.projectPageService.handleOnCreateNewTodo(this.newTodo, this.projectData.id, this.userData.user.username, this.allTodoColTodos.length-1 )
        .subscribe((data: any) => {
          // this.allTodoColTodos.push(data)
          this.newTodo = ""

        this.allTodoColTodos[this.allTodoColTodos.length - 1].id = data.id 
          console.log(data)
          console.log(this.allTodoColTodos)
        }, err => {
        this.store.setErrMsg(err.error.error)
      })
    }
  }
  handleOnUpdateTodo(todoId: string, title: string,context: string, status: string, username: string, index: number, priority: any, assignTo: string) {
    let d = priority
    if(priority.value) d = priority.value
    this.projectPageService.handleOnUpdateTodo(todoId, title, this.projectData.id, context, status, username, index, d, assignTo)
      .subscribe((data: any) => {
          let list = []
          if (this.selectedTask.status === "TODO" || status === "TODO") {
            list = this.allTodoColTodos
          } else if (this.selectedTask.status === "INPROGRACE" || status === "INPROGRACE") {
            list = this.allInPrograceColTodos
          } else if (this.selectedTask.status === "DONE" || status === "DONE") {
            list = this.allDoneColTodos
          }
            const index = list.findIndex(t => t.id === data.id)
            console.log(index, data)
            list[index] = data
        
        console.log(data)
        // console.log(this.allTodoColTodos)
        // console.log(this.allInPrograceColTodos)
        // console.log(this.allDoneColTodos)
        this.isUpdateTodoContext = false
        this.selectedTask = data
        this.isUpdateingTodoTitle = false

      }, err => {
        this.store.setErrMsg(err.error.error)
      })
  }

  handleOnClickDelete() {
if(this.selectedTask.status === "TODO") {
        this.allTodoColTodos = this.allTodoColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }else if(this.selectedTask.status === "INPROGRACE") {
        this.allInPrograceColTodos = this.allInPrograceColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }else if(this.selectedTask.status === "DONE") {
        this.allDoneColTodos = this.allDoneColTodos.filter((todo: any) => todo.id !== this.selectedTask.id)
      }
    this.projectPageService.handleOnDeleteTodo(this.selectedTask.id)
    .subscribe(data => {
      
    }, err => {
        this.store.setErrMsg(err.error.error)
      })
      this.isUpdatingTask = false
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
    }, err => {
        this.store.setErrMsg(err.error.error)
      })
  }

  handleOnClickSendComment() {
    if(this.commentMsg) {
      this.projectPageService.handleOnPostComment(this.selectedTask.id, this.commentMsg, JSON.parse(localStorage.getItem("user")+""))
      .subscribe((data: any) => {
        this.allSelectedTodoComments.unshift(data)
        this.commentMsg = ""
        console.log(data)
      }, err => {
        this.store.setErrMsg(err.error.error)
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
    }else if(event.container.id === "cdk-drop-list-1") {
      todoArr = this.allInPrograceColTodos
      todoStatus = "INPROGRACE"
    }else if(event.container.id === "cdk-drop-list-2") {
      todoArr = this.allDoneColTodos
      todoStatus = "DONE"
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
      // console.log(newIndex)
      // console.log(todoArr)
      // this.projectPageService.handleOnUpdateTodo(todo.id, todo.title,todo.projectId,todo.context,todoStatus, todo.username, newIndex, todo.priority, todo.assignTo).subscribe()
      console.log(todoStatus)
      this.handleOnUpdateTodo(todo.id, todo.title,todo.context,todoStatus, todo.username, newIndex, todo.priority, todo.assignTo)
      //  handleOnUpdateTodo(todoId, title,context, status, username, index, priority, assignTo) {
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

  handleOnClickAddEmail() {
    if(this.newShareProjectEmail) {
      console.log(123 )
      this.projectPageService.handleOnShareProject(this.projectData.id, this.newShareProjectEmail)
      .subscribe(data => {
        console.log(data)
      }, err => {
        this.store.setErrMsg(err.error.error)
      })
    }
  }
 handleOnChangeTodoUserAssign(e: any) {

     this.handleOnUpdateTodo(this.selectedTask.id, this.selectedTask.title, this.selectedTask.context, this.selectedTask.status, this.selectedTask.username, this.selectedTask.index, this.selectedTask.priority, e.target.value)
 } 

 handleOnReturnUsername(todo: any) {
  const t = this.projectData.shareUsersId.$values.findIndex((j: any) => j === +todo.assignTo)
  // console.log(t, todo.assignTo)
  return this.projectData.shareUsersUsername.$values[t]
 }
}
