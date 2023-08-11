import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { saveAs } from 'file-saver';

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

}
