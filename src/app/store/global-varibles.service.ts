import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariblesService {
  isLoggedIn = false

  private errMsg = new BehaviorSubject<string>('');

  constructor() { }

  setErrMsg(value: string): void {
    this.errMsg.next(value);
  }

  getErrMsg(): BehaviorSubject<string> {
    return this.errMsg;
  }
}
