import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsPageService {
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.cookieService.get("token")}`)
  userData: any
  constructor(private http: HttpClient, private cookieService: CookieService) { 
    this.userData = JSON.parse(localStorage.getItem("user")+"")
  }

  handleOnGetAllProjects() {
    return this.http.post('https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Project/userprojects', {}, {headers:this.headers})
  }
  handleOnAddNewProject(name: string) {
    console.log(`https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Project?id=${this.userData.user.id}&name=${name}`)
    return this.http.post(`https://5242-klnag-taskmanagerapido-mpy2lq8e2jy.ws-us94.gitpod.io/api/Project`, {name}, {headers:this.headers, responseType: "json"})
  }
}
