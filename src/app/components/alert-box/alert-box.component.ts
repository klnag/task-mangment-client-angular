import { Component, Input } from '@angular/core';
import { GlobalVariblesService } from 'src/app/store/global-varibles.service';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
})
export class AlertBoxComponent {
  @Input() err: string = "";
  // constructor(private store: GlobalVariblesService) {
  //   this.err = store.errMsg
  // }
  ngOnInit() {
    console.log(this.err)
  }
}
