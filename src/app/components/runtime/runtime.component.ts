import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription, combineLatest} from 'rxjs';
import { Asm } from 'src/app/core/utils/types';
import { CodeService } from 'src/app/services/code-service/code.service';
import { RuntimeServiceService } from 'src/app/services/runtime-service/runtime-service.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html',
  styleUrls: ['./runtime.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RuntimeComponent implements OnInit, OnDestroy  {

  editorOptions = { theme: 'rv32i-theme', language: 'rv32i', minimap: { enabled: false }, };


  private codeSubscription: Subscription;

  currentTabIndex: number = 0;
  convertedCode: Asm;
  code: string;

  textSegment: any = [];
  dataSegment: any = [];

  constructor(
    private utils: UtilsService,
    private runtimeService: RuntimeServiceService,
    private codeService: CodeService,
  ) {
    this.convertedCode = this.codeService.getConvertedCode();
    this.code = this.codeService.getCode();
    this.codeSubscription = combineLatest(this.codeService.convertedCode$, this.codeService.code$).subscribe(([convertedCode, code]) => {
      console.log(convertedCode, code)
      this.convertedCode = convertedCode;
      this.code = code;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.codeSubscription.unsubscribe();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTabIndex = event.index
  }

  
  getSelectedIndex(): number {
    return this.currentTabIndex
  }
}
