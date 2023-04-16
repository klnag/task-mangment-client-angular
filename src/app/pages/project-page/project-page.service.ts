import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectPageService {
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.cookieService.get("token")}`)
  constructor(private http: HttpClient, private cookieService: CookieService) { 
  }

  handleOnGetAllTodos(id: string) {
    return this.http.post('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Project/projecttodos?projectId='+id, {}, {headers:this.headers})
  }

  handleOnCreateNewTodo(title: string, projectId: string) {
    return this.http.post('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Todo', {title, projectId, context: ""}, {headers:this.headers})
  }
  handleOnUpdateTodoStatus(todoId: string,title: string, projectId: string, status: string) {
    return this.http.patch('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Todo/status/'+todoId, {title, projectId, context: "qw", status}, {headers:this.headers, })
  }
  handleOnUpdateTodoContext(todoId: string, context: string) {
    return this.http.patch('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Todo/context/'+todoId, {title: "s", projectId: 4, context, status: "s"}, {headers:this.headers, })
  }
  handleOnDeleteTodoStatus(todoId: string) {
    return this.http.delete('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Todo/'+todoId, {headers:this.headers, responseType: "text"})
  }

  handleOnGetAllTaskComments(todoId: string) {
    return this.http.get('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Todo/alltodocomments?todoId='+todoId, {headers:this.headers, })
  }
  handleOnPostComment(todoId: string, commentMsg: string, user: any) {
    return this.http.post('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Comment',{userName: user.user.username, todoId,userId: 3, context: commentMsg}, {headers:this.headers, })
  }
}
