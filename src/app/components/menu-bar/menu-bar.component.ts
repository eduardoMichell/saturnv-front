import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CodeService } from 'src/app/services/code-service/code.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';


@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {

  constructor(private utils: UtilsService,
    private codeService: CodeService) {
  }

  async onFileSelected(event: any): Promise<void> {
    const code = await this.utils.onFileSelected(event);
    this.codeService.setCode(code);
  }

  downloadFile() {
    this.utils.downloadFile(`saturnv-${Date.now()}.asm`, this.codeService.getCode())
  }

}