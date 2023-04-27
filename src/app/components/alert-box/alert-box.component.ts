import { Component, Input } from '@angular/core';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
})
export class AlertBoxComponent {
  @Input() err: string = "";
  constructor(private store: GlobalVariblesService) {}
  ngOnInit() {
    console.log(this.err)
  }

  handleOnClickX() {
    this.store.setErrMsg("");
  }
}
