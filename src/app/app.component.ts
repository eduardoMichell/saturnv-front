import { KeyValue } from "@angular/common";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from "./services/api-service/api.service";
import { UtilsService } from "./services/utils-service/utils.service";
import { ConstantsInit } from "./core/utils/constants";
import { Asm } from './core/utils/types';
import { CodeService } from "./services/code-service/code.service";
import { Subscription } from 'rxjs';
import { HelpDialogComponent } from "./core/dialogs/help-dialog/help-dialog.component";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { RuntimeServiceService } from "./services/runtime-service/runtime-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {



 
  private codeSubscription: Subscription;



  stepBack: any;
  text: any = [];
  result: string = "";
  messages: string = "";


  state: any
 
  convertedCode: Asm;

  console: string = "";
  code: string;

  constructor(
    private utils: UtilsService,
    private runtimeService: RuntimeServiceService,
    private codeService: CodeService,
    public dialog: MatDialog) {
    this.convertedCode = this.codeService.getConvertedCode();
    this.code = this.codeService.getCode();
  

    this.codeSubscription = this.codeService.convertedCode$.subscribe((convertedCode) => {
      this.convertedCode = convertedCode;
    })


  }

  ngOnInit() {
  }

  ngOnDestroy() {
 
    this.codeSubscription.unsubscribe();
  }

  printRegFileKey(reg: any) {
    return Object.keys(reg)[0];
  }

  printRegFileValue(reg: any) {
    return Object.values(reg)[0];
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }




  createTextSegment() {
    const asm = this.convertedCode;
    const visualization = []
    for (let i = ConstantsInit.PC; i < ConstantsInit.PC + (asm.code.text.basic.length * 4); i += 4) {
      visualization.push({
        code: this.binaryToHexadecimal(asm.memories.instMem[i].code),
        basic: asm.memories.instMem[i].basic.join(" "),
        source: asm.memories.instMem[i].source.join(" "),
        address: this.numberToHexadecimal(i)
      })
    }
    return visualization;
  }
  createDataSegment() {
    const asm = this.convertedCode;
    const visualization = []
    for (let i = ConstantsInit.DATAMEM; i < ConstantsInit.DATAMEM + (128 * 4); i += 4) {
      visualization.push({
        address: this.numberToHexadecimal(i),
        value0: this.numberToHexadecimal(asm.memories.dataMem[i]),
        value4: this.numberToHexadecimal(asm.memories.dataMem[i + 4]),
        value8: this.numberToHexadecimal(asm.memories.dataMem[i + 8]),
        value12: this.numberToHexadecimal(asm.memories.dataMem[i + 12]),
        value16: this.numberToHexadecimal(asm.memories.dataMem[i + 16]),
        value20: this.numberToHexadecimal(asm.memories.dataMem[i + 20]),
        value24: this.numberToHexadecimal(asm.memories.dataMem[i + 24]),
        value28: this.numberToHexadecimal(asm.memories.dataMem[i + 28]),
      })
      i += 28;
    }
    console.log(visualization)
    return visualization;
  }


  numberToHexadecimal(number: number) {
    return this.utils.numberToHexadecimal(number);
  }

  binaryToHexadecimal(binary: any) {
    return this.utils.binaryToHexadecimal(binary);
  }

  getBasic(inst: any) {
    return inst.basic;
  }

  getSource(inst: any) {
    return inst.source;
  }


}


