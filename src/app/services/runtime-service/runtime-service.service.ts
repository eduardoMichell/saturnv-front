import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuntimeServiceService {

  private currentTabIndex: number;
  currentTabIndex$ = new Subject<number>(); 

  constructor() { 
    this.currentTabIndex = 0;
  }

  setCurrentTabIndex(currentTabIndex: number){
    this.currentTabIndex = currentTabIndex;
    this.currentTabIndex$.next(currentTabIndex);
  }

  getCurrentTabIndex(){
    return this.currentTabIndex;
  }

}
