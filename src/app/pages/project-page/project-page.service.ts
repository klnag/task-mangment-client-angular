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
    console.log('http://localhost:5242/api/Todo/'+todoId)
    return this.http.patch('http://localhost:5242/api/Todo/status/'+todoId, {title, projectId, status}, {headers:this.headers, })
  }
}
