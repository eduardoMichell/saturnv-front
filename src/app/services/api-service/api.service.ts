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

  // TODO: CRIAR CLASSES PARA OS TIPOS

  constructor(private http: HttpClient) {
  }

  assembleCode(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/assemble" , asm);
  }

  runTheCurrentProgram(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/run", asm);
  }
  runOneStepAtTime(asm: Asm): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/runOneStep", asm);
  }

  resetMemoryAndRegisters(): Observable<String> {
    return this.http.get<String>(this.apiUrl + "/reset");
  }

  dumpCode(asm: Asm, type: string): Observable<String> {
    return this.http.post<String>(this.apiUrl + "/dump", {asm, type});
  }



}
