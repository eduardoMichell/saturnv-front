import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { DumpFileDialogComponent } from 'src/app/core/dialogs/dump-file-dialog/dump-file-dialog.component';
import { HelpDialogComponent } from 'src/app/core/dialogs/help-dialog/help-dialog.component';
import { ConstantsInit } from 'src/app/core/utils/constants';
import { Asm } from 'src/app/core/utils/types';
import { ApiService } from 'src/app/services/api-service/api.service';
import { CodeService } from 'src/app/services/code-service/code.service';
import { RuntimeServiceService } from 'src/app/services/runtime-service/runtime-service.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent implements OnDestroy {

  private runtimeSubscription: Subscription;
  private codeSubscription: Subscription;

  convertedCode: Asm;
  code: String;

  canRun: boolean = true;
  canDump: boolean = true;

  currentTabIndex: number = 0;

  previousCode: string

  constructor(private apiService: ApiService,
              private utils: UtilsService,
              private codeService: CodeService,
              private runtimeService: RuntimeServiceService,
              public dialog: MatDialog) {

    this.convertedCode = this.utils.initAsm();
    this.code = this.codeService.getCode();
    this.previousCode = this.codeService.getLastPreviousCode() || '';

    this.codeSubscription = combineLatest(this.codeService.convertedCode$, this.codeService.code$).subscribe(([convertedCode, code]) => {
      console.log(convertedCode, code)
      this.convertedCode = convertedCode;
      this.code = code;
    })

    this.runtimeSubscription = this.runtimeService.currentTabIndex$.subscribe((newTabIndex) => {
      this.currentTabIndex = newTabIndex;
    })
  }


  ngOnDestroy() {
    this.codeSubscription.unsubscribe();
    this.runtimeSubscription.unsubscribe();
  }

  async assembleCode() {
    this.resetCode();
    this.currentTabIndex = 1;
    this.convertedCode.code = {
      "data": [
        {
          "directive": "word",
          "label": "Array",
          "source": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          "basic": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }
      ],
      "text": {
        "source": [
          ["addi", "s2", "zero", "11"],
          ["addi", "s3", "zero", "-4"],
          ["add", "s4", "s2", "s3"],
        ],
        "basic": [
          ["addi", "x18", "x0", "11"],
          ["addi", "x19", "x0", "-4"],
          ["add", "x20", "x18", "x19"]
        ]
      }
    }
    await this.apiService.assembleCode(this.convertedCode).toPromise().then((res: any) => {
      this.convertedCode = this.utils.createAsmObject(res.data);
      this.canRun = false;
      this.canDump = false;
      this.utils.setConsole(`Assembling code`)
    })
  }

  async runOneStep() {
    this.codeService.setPreviousCode(this.convertedCode);
    await this.apiService.runOneStep(this.convertedCode).toPromise().then((res: any) => {
      this.convertedCode = this.utils.createAsmObject(res.data);
    })
  }
  async runEntireProgram() {
    await this.apiService.runEntireProgram(this.convertedCode).toPromise().then((res: any) => {
      this.convertedCode = this.utils.createAsmObject(res.data);
      this.codeService.clearPreviousCode();
    })
  }

  undoLastStep() {
    const previousCode = this.codeService.getLastPreviousCode() || null;
    if (previousCode) {
      this.convertedCode = JSON.parse(previousCode);
    }
  }

  async dumpFile() {
    this.dialog.open(DumpFileDialogComponent, {
      data: this.convertedCode
    });
  }

  downloadFile() {
    this.utils.downloadFile(`saturnv-${Date.now()}.asm`, this.codeService.getCode())
    this.utils.setConsole(`Downloaded file saturnv-${Date.now()}.asm`);
  }

  async onFileSelected(event: any): Promise<void> {
    const code = await this.utils.onFileSelected(event);
    if (code) {
      this.codeService.setCode(code);
    }
  }

  help() {
    this.dialog.open(HelpDialogComponent, {
    });
  }

  isEnd() {
    return this.convertedCode?.memories.pc === ConstantsInit.PC + (this.convertedCode.code.text.source.length * 4);
  }
  canUndoLastStep() {
    return this.convertedCode?.memories.pc === ConstantsInit.PC;
  }

  resetCode() {
    this.convertedCode = this.utils.initAsm();
  }

  resetAll() {
    this.convertedCode = this.utils.initAsm();
    this.canRun = false;
    this.canDump = false;
    this.utils.clearConsole();
    this.codeService.clearPreviousCode();
  }
}

