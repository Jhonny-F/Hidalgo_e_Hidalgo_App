import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CredentialsModel } from '@core/models/credentials-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(credentials: CredentialsModel): Observable<any> {
    if (credentials.username === 'jhonny' && credentials.password === 'root@1234') {
      return of('FLORES GARCIA JHONNY ROBERTH');
    } else {
      return of('');
    }
  }

}
