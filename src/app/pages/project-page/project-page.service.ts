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

  handleOnCreateNewTodo(title: string, projectId: string, username:string, index: number) {
    console.log(username)
    return this.http.post('http://localhost:5242/api/Todo', {title, projectId,username, context: "", index, priority: "low", assignTo: ""}, {headers:this.headers})
  }
  handleOnUpdateTodo(todoId: string,title: string, projectId: string, context: string, status: string, username: string, index: number, priority: string, assignTo: string) {
    console.log({title, projectId,context, username, index, status})
    return this.http.patch('http://localhost:5242/api/Todo/'+todoId, {title, projectId,context, username, index, status, priority, assignTo}, {headers:this.headers })
  }
  handleOnDeleteTodo(todoId: string) {
    return this.http.delete('http://localhost:5242/api/Todo/'+todoId, {headers:this.headers, responseType: "text"})
  }

  // handleOnUpdateTodoContext(todoId: string, context: string) {
  //   return this.http.patch('http://localhost:5242/api/Todo/context/'+todoId, {title: "s", projectId: 4, context, status: "s"}, {headers:this.headers, })
  // }

  handleOnGetAllTaskComments(todoId: string) {
    return this.http.get('http://localhost:5242/api/Comment?todoId='+todoId, {headers:this.headers, })
  }
  handleOnPostComment(todoId: string, commentMsg: string, user: any) {
    return this.http.post('http://localhost:5242/api/Comment',{userName: user.user.username, todoId,userId: 3, context: commentMsg}, {headers:this.headers, })
  }
  handleOnShareProject(projectId: string, email: string) {
    return this.http.patch(`http://localhost:5242/api/Project/addUserIdToProject?projectId=${projectId}&sharedUserEmail=${email}`,{}, {headers:this.headers, })
  }
}
