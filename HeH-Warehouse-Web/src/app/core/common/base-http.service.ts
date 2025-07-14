import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/common/api-response';

export class BaseHttpService<T> {
  constructor(protected readonly http: HttpClient, private readonly apiUrl: string) {}

  getAll(): Observable<T[]> {
    return this.http
      .get<ApiResponse<T[]>>(this.apiUrl)
      .pipe(map((res) => res.data ?? []));
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.apiUrl}${id}`)
      .pipe(map((res) => res.data));
  }

  create(body: T): Observable<object> {
    return this.http.post<ApiResponse<object>>(this.apiUrl, body);
  }

  update(body: T): Observable<object> {
    return this.http.put<ApiResponse<object>>(this.apiUrl, body);
  }

  delete(id: number): Observable<object> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}${id}`);
  }
}
