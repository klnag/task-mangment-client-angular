import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent {
  projectId 
  constructor(private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get("id")
  }
  ngOnInit() {
    console.log(this.projectId)
  }

}
