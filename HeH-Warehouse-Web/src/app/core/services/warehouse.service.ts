import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WarehouseModel } from '@core/models/warehouse-model';
import { environment } from 'src/environments/environment';
import { BaseHttpService } from '@core/common/base-http.service';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseHttpService<WarehouseModel> {

  constructor(http: HttpClient) {
    super(http, `${environment.endpoint}Warehouse/`);
  }
  
}
