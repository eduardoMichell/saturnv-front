import { KeyValue } from "@angular/common";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from "./services/api-service/api.service";
import { UtilsService } from "./services/utils-service/utils.service";
import { ConstantsInit } from "./core/utils/constants";
import { Asm, Code, Memories, Text, Data } from './core/utils/types';
import { CodeService } from "./services/code-service/code.service";
import { Subscription } from 'rxjs';
import { DumpFileDialogComponent } from "./core/dialogs/dump-file-dialog/dump-file-dialog.component";
import { HelpDialogComponent } from "./core/dialogs/help-dialog/help-dialog.component";
import { MatTabChangeEvent } from "@angular/material/tabs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  editorOptions = { theme: 'rv32i-theme', language: 'rv32i', minimap: { enabled: false }, };

  private codeSubscription: Subscription;

  currentTabIndex: number = 0;
  code: string;

  stepBack: any
  text: any = [];
  result: string = "";
  messages: string = "";
  textSegment: any = [];
  assembledCode: boolean = true;
  canRunOneStep: boolean = true;
  canUndoLastStep: boolean = true;
  canResetMemoryAndRegisters: boolean = true;
  state: any
  currentCode: Asm

  console: string = "";

  constructor(private apiService: ApiService,
              private utils: UtilsService,
              private codeService: CodeService,
              public dialog: MatDialog) {
    this.currentCode = this.initAsm()
    this.code = this.codeService.getCode();
    this.codeSubscription = this.codeService.code$.subscribe((newCode) => {
      this.code = newCode;
    })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.codeSubscription.unsubscribe();
  }

  async getMachineLanguage() {

  }

  convertCode() {
    this.currentCode = this.initAsm();
  }

  async assembleCode() {
    this.currentTabIndex = 1;
    this.convertCode();
    this.currentCode.code = {
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
          ["auipc", "s3", "64528"],
          ["addi", "s3", "s3", "-4"],
          ["lb", "t0", "32(s3)"],
          ["add", "t0", "s2", "t0"],
          ["sw", "t0", "48(s3)"]
        ],
        "basic": [
          ["addi", "s2", "zero", "11"],
          ["auipc", "x19", "64528"],
          ["addi", "x19", "x19", "-4"],
          ["lb", "x5", "32(x19)"],
          ["add", "x5", "x18", "x5"],
          ["sw", "x5", "48(x19)"]
        ]
      }
    },
      this.stepBack = this.currentCode;
    await this.apiService.assembleCode(this.currentCode).toPromise().then((res: any) => {
      this.currentCode = this.createAsmObject(res.data);
      this.textSegment = this.createAsmVisualization();
      console.log(this.currentCode)
      this.canRunOneStep = false;
      this.assembledCode = false;

      this.printConsole(`Assembling code`);


    })
  }

  printConsole(message: string) {
    this.utils.setConsole(message);
  }

  getConsole(): string {
    return this.utils.getConsole();
  }

  async runTheCurrentProgram() {

  }

  createAsmObject(asm: Asm) {
    return {
      code: asm.code,
      memories: asm.memories
    }
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

  async runOneStep() {
    this.stepBack = this.currentCode;
    await this.apiService.runTheCurrentProgram(this.currentCode).toPromise().then((res: any) => {
      this.currentCode = this.createAsmObject(res.data)
      console.log(this.stepBack.memories.pc)
      console.log(this.currentCode.memories.pc)
      this.canUndoLastStep = this.canLastStep();
    })
  }

  canLastStep() {
    return this.currentCode?.memories.pc === ConstantsInit.PC + (this.currentCode.code.text.source.length * 4)
  }

  async undoLastStep() {
    console.log(this.stepBack.memories.pc);
    console.log(this.currentCode.memories.pc);
    console.log("\n")
    await this.apiService.runTheCurrentProgram(this.stepBack).toPromise().then((res: any) => {
      console.log(this.stepBack.memories.pc);
      console.log(this.currentCode.memories.pc);
      console.log(res.data.memories.pc);
      this.currentCode = this.createAsmObject(res.data);
      this.canUndoLastStep = this.canLastStep();
    })
  }

  resetMemoryAndRegisters() {
    this.currentCode = this.initAsm();
    this.canRunOneStep = true;
    this.assembledCode = true;
    this.canUndoLastStep = true;
    this.utils.clearConsole();
  }
  getSelectedIndex(): number {
    return this.currentTabIndex
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTabIndex = event.index
  }

  createAsmVisualization(){
    const asm = this.currentCode;
    const visualization = []
    for(let i = ConstantsInit.PC; i < ConstantsInit.PC + (asm.code.text.basic.length*4); i+=4){
      visualization.push({
        code: this.binaryToHexadecimal(asm.memories.instMem[i].code),
        basic: asm.memories.instMem[i].basic.join(" "),
        source: asm.memories.instMem[i].source.join(" "),
        address: this.numberToHexadecimal(i)
      })
    }
    return visualization;
  }

  numberToHexadecimal(number: number){
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

  async dumpFile() {
    this.dialog.open(DumpFileDialogComponent, {
      data: this.currentCode
    });
  }

  help(){
    this.dialog.open(HelpDialogComponent, {
      
    });
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
      dataMem[`"${firstPosition}"`] = 0;
      firstPosition += 4;
    }
    return dataMem;
  }

  async onFileSelected(event: any): Promise<void> {
    const code = await this.utils.onFileSelected(event);
    if(code){ 
      this.codeService.setCode(code);
    }
  }

  downloadFile() {
    this.utils.downloadFile(`saturnv-${Date.now()}.asm`, this.codeService.getCode())
    this.utils.setConsole(`Downloaded file saturnv-${Date.now()}.asm`);

  }


}


