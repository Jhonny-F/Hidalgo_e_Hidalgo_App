import { Injectable } from '@angular/core';
import { WarehouseModel } from '@core/models/warehouse-model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {

    private warehouseKeepers: WarehouseModel[] = [
        {
            id: 1, fullName: "Carlos Pérez", identification: "0102030405", phone: "0991234567",
            email: "carlos.perez@example.com", yearsOfExperience: 5, shift: "Mañana"
        },
        {
            id: 2, fullName: "Luisa Gómez", identification: "0607080910", phone: "0987654321",
            email: "luisa.gomez@example.com", yearsOfExperience: 3, shift: "Tarde"
        },
        {
            id: 3, fullName: "Pedro Sánchez", identification: "1102233445", phone: "0971122334",
            email: "pedro.sanchez@example.com", yearsOfExperience: 7, shift: "Noche"
        },
        {
            id: 4, fullName: "Andrea Torres", identification: "1203344556", phone: "0969988776",
            email: "andrea.torres@example.com", yearsOfExperience: 4, shift: "Mañana"
        },
        {
            id: 5, fullName: "José Morales", identification: "1304455667", phone: "0955544332",
            email: "jose.morales@example.com", yearsOfExperience: 6, shift: "Tarde"
        }
    ];

    getAll(): Observable<WarehouseModel[]> {
        return of(this.warehouseKeepers);
    }

    getById(id: number): Observable<WarehouseModel | undefined> {
        const result = this.warehouseKeepers.find(w => w.id === id);
        return of(result);
    }

    create(warehouseKeeper: WarehouseModel): Observable<void> {
        const newId = Math.max(...this.warehouseKeepers.map(w => w.id || 0), 0) + 1;
        this.warehouseKeepers.push({ ...warehouseKeeper, id: newId });
        return of(void 0);
    }

    update(updatedWarehouse: WarehouseModel): Observable<void> {
        const index = this.warehouseKeepers.findIndex(w => w.id === updatedWarehouse.id);
        if (index !== -1) {
            this.warehouseKeepers[index] = { ...this.warehouseKeepers[index], ...updatedWarehouse };
        }

        return of(void 0);
    }

    delete(id: number): Observable<boolean> {
        const index = this.warehouseKeepers.findIndex(w => w.id === id);
        if (index !== -1) {
            this.warehouseKeepers.splice(index, 1);
            return of(true);
        }
        return of(false);
    }
}
