import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/ApiResponse";

@Injectable({
    providedIn: 'root',
  })

export class CorreoService{
    private url: string = 'http://localhost:3000/api/correo/'; 
    constructor(private http: HttpClient,
    ) {}


sendEmail(destinatario:string,asunto:string,mensaje:string):Observable<any>{

const payload={
origen:'nachojdimartino@gmail.com',
destinatario,
asunto,
mensaje}

return this.http.post(`${this.url}`,payload);

}

}