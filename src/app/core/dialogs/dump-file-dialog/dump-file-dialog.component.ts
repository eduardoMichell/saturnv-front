import { Component, Inject } from '@angular/core';
import { ApiService } from 'src/app/services/api-service/api.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Asm } from '../../utils/types';

 
@Component({
  selector: 'app-dump-file-dialog',
  templateUrl: './dump-file-dialog.component.html',
  styleUrls: ['./dump-file-dialog.component.scss']
})
export class DumpFileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DumpFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentCode: Asm,
    private apiService: ApiService,
    private utils: UtilsService) {
    
  }

  type: string = 'binary'


  async dumpFile(){
    await this.apiService.dumpCode(this.currentCode, this.type).toPromise().then((res: any) => {
      const text = this.prepareDataToDump(this.type, res.data);
      this.utils.downloadFile(`dump-${this.type}-${Date.now()}.txt`, text);
      this.utils.setConsole(`The file dump-${this.type}-${Date.now()}.txt was successfully created`);
      this.closeDialog();
    })
  }

  private prepareDataToDump(type: string, data: any): string {
    switch (type) {
      case 'binary':
      case 'hexadecimal':
        return data.toString().replaceAll(',', '\n')
      case 'text':
        let text = 'Address        Code              Basic                   Line Source\n';
        for (let i = 0; i < data.address.length; i++) {
          text += `${data.address[i]}     ${data.code[i]}        ${data.basic[i]}${" ".repeat(24 - data.basic[i].toString().length)}${i}   ${data.source[i]}\n`;
        }
        return text;
    }
    return 'Error';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
}
