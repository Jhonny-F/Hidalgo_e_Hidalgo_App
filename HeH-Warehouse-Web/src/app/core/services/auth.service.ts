import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CredentialsModel } from '@core/models/credentials-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  login(credentials: CredentialsModel): Observable<string> {
    const username = credentials.username ?? '';
    const password = credentials.password ?? '';

    const validUsers = new Map([
      ['jhonny', '1234'],
      ['admin', 'admin123']
    ]);

    if (validUsers.get(username) === password) {
      return of(`Bienvenido, ${username}`);
    } else {
      return of('');
    }
  }
  
}