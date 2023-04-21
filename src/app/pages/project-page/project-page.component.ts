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
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class ProjectPageComponent {
  projectData = JSON.parse(localStorage.getItem("project")+"")
  userData = JSON.parse(localStorage.getItem("user")+"")
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

    this.stringTOHtml("Hi\n there\n")
    this.isLoadding = true
    this.projectPageService.handleOnGetAllTodos(this.projectData.id).subscribe((data: any) => {
      // this.allTodos = data
      // console.log(data)
      // const allTodoColTodosTemp: any[] = []
      data.map((todo: any) => {
        if(todo.status === "TODO") {
          // this.allTodoColTodos[todo.index] = todo
          this.allTodoColTodos.push(todo)
        }else if(todo.status === "INPROGRACE") {
          // this.allInPrograceColTodos[todo.index] = todo
          this.allInPrograceColTodos.push(todo)
        } else if(todo.status === "DONE") {
          // this.allDoneColTodos[todo.index] = todo
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
    // const temp = 
    this.projectPageService.handleOnUpdateTodo(todoId, title, this.projectData.id, context, status, username, index)
      .subscribe(data => {
        // if (status !== status.newStatus) {
        //   if (status.prevStatus === "TODO") {
        //     this.allTodoColTodos = this.allTodoColTodos.filter(todo => todo.id !== todoId)
        //     this.allInPrograceColTodos.push(data)
        //   }else if (status.prevStatus === "INPROGRACE") {
        //     this.allInPrograceColTodos = this.allInPrograceColTodos.filter(todo => todo.id !== todoId)
        //     if(status.newStatus === "TODO") {
        //       this.allTodoColTodos.push(data)
        //     }else if(status.newStatus === "DONE") {
        //       this.allDoneColTodos.push(data)
        //     }
        //   }else if (status.prevStatus === "DONE") {
        //     this.allDoneColTodos = this.allDoneColTodos.filter(todo => todo.id !== todoId)
        //     this.allInPrograceColTodos.push(data)
        //   }
        // }
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
        // this.handleOnClickTask(data)
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
  drop(event: CdkDragDrop<string[]>) {
      // const i = event.previousIndex

      

    // if(event.previousContainer.id === "cdk-drop-list-0") {
    //   const todo = this.allTodoColTodos[i]
    //   if(event.container.id === "cdk-drop-list-1") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "INPROGRACE", todo.username, todo.index)
    //   const newIndex = this.allInPrograceColTodos.length > 0 ? this.allInPrograceColTodos[event.currentIndex - 1].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE").subscribe()
    //   } else if(event.container.id === "cdk-drop-list-2") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "DONE", todo.username, todo.index)
    //   const newIndex = this.allInPrograceColTodos.length > 0 ? this.allInPrograceColTodos[event.currentIndex].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "DONE").subscribe()
    //   }
    // }else if(event.previousContainer.id === "cdk-drop-list-1"){
    //   const todo = this.allInPrograceColTodos[i]
    //   if(event.container.id === "cdk-drop-list-0") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "TODO", todo.username, todo.index)
    //   const newIndex = this.allTodoColTodos.length > 0 ? this.allTodoColTodos[event.currentIndex].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "TODO").subscribe()
    //   } else if(event.container.id === "cdk-drop-list-2") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "DONE", todo.username, todo.index)
    //   const newIndex = this.allDoneColTodos.length > 0 ? this.allDoneColTodos[event.currentIndex].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "DONE").subscribe()
    //   }
    // }else if(event.previousContainer.id === "cdk-drop-list-2") {
    //   const todo = this.allDoneColTodos[i]
    //   if(event.container.id === "cdk-drop-list-0") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "TODO", todo.username, todo.index)
    //   const newIndex = this.allTodoColTodos.length > 0 ? this.allTodoColTodos[event.currentIndex].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "TODO").subscribe()
    //   } else if(event.container.id === "cdk-drop-list-1") {
    //     // this.handleOnUpdateTodo(todo.id, todo.title, todo.context, "INPROGRACE", todo.username, todo.index)
    //   const newIndex = this.allInPrograceColTodos.length > 0 ? this.allInPrograceColTodos[event.currentIndex].index - 0.01 : 0
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE").subscribe()
    //   }
    // }
    
    // if (event.previousContainer.id === "cdk-drop-list-0") {
    //   const todo = this.allTodoColTodos[i]
    //   if (event.container.id === "cdk-drop-list-1") {
    //     this.projectPageService.handleOnChangePosTask(todo.id, event.currentIndex, "INPROGRACE")
    //       .subscribe(data => {
    //         console.log(data)
    //         console.log(this.allTodoColTodos)
    //         console.log(this.allInPrograceColTodos)
    //       })
    //   }
    // }


    // if (event.container.id === "cdk-drop-list-0") {
    //   const newIndex = this.allTodoColTodos[event.currentIndex].index - 0.01
    //   const todo = this.allTodoColTodos[i]
    //   this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "TODO")
    //     .subscribe(data => {
    //       console.log(data)
    //     })
    // } else if (event.container.id === "cdk-drop-list-1") {
    //   const newIndex = this.allInPrograceColTodos.length > 0 ? this.allInPrograceColTodos[event.currentIndex].index - 0.01 : 0
    //   let todo: any = {}
    //   if (event.previousContainer.id === "cdk-drop-list-0") {
    //     todo = this.allTodoColTodos[i]
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE")
    //       .subscribe(data => {
    //         console.log(data)
    //       })
    //   } else if (event.previousContainer.id === "cdk-drop-list-2") {
    //     todo = this.allDoneColTodos[i]
    //     this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE")
    //       .subscribe(data => {
    //         console.log(data)
    //       })
    //   }

    // } else if (event.container.id === "cdk-drop-list-2") {
    //   const newIndex = this.allDoneColTodos[event.currentIndex].index - 0.01
    //   const todo = this.allDoneColTodos[i]
    //   this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "DONE")
    //     .subscribe(data => {
    //       console.log(data)
    //     })
    // } 


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

        let newIndex = 0
        if (event.previousContainer.id === "cdk-drop-list-0") {
          const todo = this.allInPrograceColTodos[event.currentIndex]
          console.log(todo.title)
          if (event.container.id === "cdk-drop-list-1") {
            if (this.allInPrograceColTodos.length) {
              if (this.allInPrograceColTodos[event.currentIndex]) newIndex = this.allInPrograceColTodos[event.currentIndex].index - 0.01
              else newIndex = this.allInPrograceColTodos[event.currentIndex - 1].index + 0.01
            }
            this.projectPageService.handleOnChangePosTask(todo.id, newIndex, "INPROGRACE").subscribe()
          } 
        }
    }
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
