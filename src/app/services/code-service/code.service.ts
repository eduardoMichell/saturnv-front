import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private code: string;
  code$ = new Subject<string>(); 
  constructor() { 
    this.code = '.data\n\n.text\n';
  }



  setCode(code: string){
    this.code = code;
    this.code$.next(code);
  }

  getCode(){
    return this.code;
  }

}
