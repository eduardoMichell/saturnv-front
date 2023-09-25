import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Asm } from '../../core/utils/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  assembleCode(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/assemble-code" , asm);
  }

  runOneStep(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/run-one-step", asm);
  }
  runEntireProgram(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/run-entire-program", asm);
  }

  dumpCode(asm: Asm, type: string): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/dump-machine-code", {asm, type});
  }



}
