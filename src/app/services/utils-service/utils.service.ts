import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { saveAs } from 'file-saver';
import { ConstantsInit } from 'src/app/core/utils/constants';
import { Asm, Code, Memories, Text, Data } from 'src/app/core/utils/types';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private console: string = "";


  constructor(private snackBar: MatSnackBar) {
  }


  async onFileSelected(event: any): Promise<string | null> {
    const file: File = event.target.files[0];
    if (file?.name.split(".")[1] === "asm") {
       return await this.readAsmFile(file);
    } else {
      this.showMessage('Error: Invalid file format. Please provide an .asm file to continue', true)
      return null;
    }
  }

  readAsmFile(file: File):  Promise<string> {
    return new Promise<string>((resolve) => {
      if (!file) {
          resolve('');
      }
      const reader = new FileReader();
      reader.onload = (e) => {
          const text = reader.result?.toString();
          this.setConsole(`${file.name} file has been opened`);
          resolve(text || '');
      };
      reader.readAsText(file);
  });
  }

  binaryToHexadecimal(binary: string) {
    return "0x" + this.addZeros(parseInt(binary, 2).toString(16), 8);
  }

  numberToHexadecimal(number: number) {
    return "0x" + this.addZeros(number.toString(16), 8);
  }

  addZeros (inst: any, quantity: number, number = '0') :string {
    const increment = quantity - inst.length
    for (let i = 0; i < increment; i++) {
      inst = number + inst
    }
    return inst
  }

  showMessage(msg: string, isError: boolean = false, isWarning: boolean = false): void {
    if (isWarning) {
      this.snackBar.open(msg, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [' msg-warning']
      });
    } else {
      this.snackBar.open(msg, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: isError ? ['msg-error'] : ['msg-success']
      });
    }
  }

  downloadFile(fileName:string, fileContent: string){
    const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(file, fileName);
  }

  setConsole(message: string){
    this.console += `Saturn V: ${message}` + "\n"
  }

  getConsole(){
    return this.console;
  }

  clearConsole(){
    this.console = '';
  }


  initAsm(): Asm {
    return {
      code: this.initCode(),
      memories: this.initMemories()
    }
  }

  initCode(): Code {
    const text: Text = {
      source: [],
      basic: []
    }
    const data: Array<Data> = []
    return {
      text,
      data
    }
  }

  initMemories(): Memories {
    return {
      regFile: {
        x0: 0,
        x1: 0,
        x2: 0,
        x3: 0,
        x4: 0,
        x5: 0,
        x6: 0,
        x7: 0,
        x8: 0,
        x9: 0,
        x10: 0,
        x11: 0,
        x12: 0,
        x13: 0,
        x14: 0,
        x15: 0,
        x16: 0,
        x17: 0,
        x18: 0,
        x19: 0,
        x20: 0,
        x21: 0,
        x22: 0,
        x23: 0,
        x24: 0,
        x25: 0,
        x26: 0,
        x27: 0,
        x28: 0,
        x29: 0,
        x30: 0,
        x31: 0
      },
      instMem: this.initInstMem(),
      dataMem: this.initDataMem(),
      pc: ConstantsInit.PC
    }
  }

  initInstMem() {
    let firstPosition = ConstantsInit.INSTMEM;
    let instMem: any = {};
    for (let i = 0; i < 128; i++) {
      instMem[`${firstPosition}`] = {
        "code": "0",
        "basic": "",
        "source": ""
      };
      firstPosition += 4;
    }
    return instMem;
  }

  initDataMem() {
    let firstPosition = ConstantsInit.DATAMEM;
    let dataMem: any = {};
    for (let i = 0; i < 128; i++) {
      dataMem[`${firstPosition}`] = 0;
      firstPosition += 4;
      
    }
    return dataMem;
  }

  createAsmObject(asm: Asm) {
    return {
      code: asm.code,
      memories: asm.memories
    }
  }


}
