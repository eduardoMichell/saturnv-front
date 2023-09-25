import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Asm } from 'src/app/core/utils/types';
import { UtilsService } from '../utils-service/utils.service';
@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private code: string;
  code$ = new Subject<string>();

  private convertedCode: Asm;
  convertedCode$ = new Subject<Asm>();

  private previousCode: Array<string>;
  previousCode$ = new Subject<Array<string>>();

  constructor(private utils: UtilsService) {
    this.code = '.data\n\n.text\n';
    this.previousCode = [];
    this.convertedCode = this.utils.initAsm();
  }


  setPreviousCode(code: Asm) {
    this.previousCode.push(JSON.stringify(code));
  }

  clearPreviousCode() {
    this.previousCode = [];
  }

  getLastPreviousCode() {
    return this.previousCode.pop();
  }

  setCode(code: string) {
    this.code = code;
    this.code$.next(code);
  }

  getCode() {
    return this.code;
  }

  setConvertedCode(convertedCode: Asm) {
    this.convertedCode = convertedCode;
    this.convertedCode$.next(convertedCode);
  }

  getConvertedCode() {
    return this.convertedCode;
  }


}
