import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private apiUrl = 'http://localhost:3000/send-whatsapp';

  constructor(private http: HttpClient) { }

  sendNotification(to: string, body: string):Observable<any> {
    return this.http.post<any>(this.apiUrl, { to, body });
  }
}
