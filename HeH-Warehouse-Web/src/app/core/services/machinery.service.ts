import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MachineryModel } from '@core/models/machinery-model';
import { BaseHttpService } from '@core/common/base-http.service';

@Injectable({ providedIn: 'root' })
export class MachineryService extends BaseHttpService<MachineryModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint}Machinery/`);
  }
}
