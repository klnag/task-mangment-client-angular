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
    return this.http.post('http://localhost:5242/api/Project/projecttodos?projectId='+id, {}, {headers:this.headers})
  }

  handleOnCreateNewTodo(title: string, projectId: string) {
    return this.http.post('http://localhost:5242/api/Todo', {title, projectId}, {headers:this.headers})
  }
  handleOnUpdateTodoStatus(todoId: string,title: string, projectId: string, status: string) {
    return this.http.patch('http://localhost:5242/api/Todo/status/'+todoId, {title, projectId, status}, {headers:this.headers, })
  }
  handleOnDeleteTodoStatus(todoId: string) {
    return this.http.delete('http://localhost:5242/api/Todo/'+todoId, {headers:this.headers, responseType: "text"})
  }
  handleOnGetAllTaskComments(todoId: string) {
    return this.http.get('http://localhost:5242/api/Todo/alltodocomments?todoId='+todoId, {headers:this.headers, })
  }
  handleOnPostComment(todoId: string, commentMsg: string, user: any) {
    console.log()
    return this.http.post('http://localhost:5242/api/Comment',{userName: user.user.username, todoId,userId: 3, context: commentMsg}, {headers:this.headers, })
  }
}
