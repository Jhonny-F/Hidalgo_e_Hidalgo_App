import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MachineryModel } from '@core/models/machinery-model';

@Injectable({
    providedIn: 'root'
})
export class MachineryService {

    private machineryList: MachineryModel[] = [
        {
            id: 1, name: "Excavadora 320D", type: "Excavadora",
            brand: "Caterpillar", model: "320D", originCountry: "EE.UU."
        },
        {
            id: 2, name: "Montacarga 8FGCU25", type: "Montacarga",
            brand: "Toyota", model: "8FGCU25", originCountry: "Japón"
        },
        {
            id: 3, name: "Compactadora BW213", type: "Compactadora",
            brand: "Bomag", model: "BW213", originCountry: "Alemania"
        },
        {
            id: 4, name: "Retroexcavadora 310L", type: "Retroexcavadora",
            brand: "John Deere", model: "310L", originCountry: "Canadá"
        },
        {
            id: 5, name: "Grúa LTM 1055", type: "Grúa Telescópica",
            brand: "Liebherr", model: "LTM 1055", originCountry: "Alemania"
        }
    ];

    getAll(): Observable<MachineryModel[]> {
        return of(this.machineryList).pipe(delay(300));
    }

    getById(id: number): Observable<MachineryModel | undefined> {
        const result = this.machineryList.find(m => m.id === id);
        return of(result).pipe(delay(300));
    }

    create(machine: MachineryModel): Observable<void> {
        const newId = Math.max(...this.machineryList.map(m => m.id || 0), 0) + 1;
        this.machineryList.push({ ...machine, id: newId });
        return of(void 0).pipe(delay(300));
    }

    update(id: number, updatedData: Partial<MachineryModel>): Observable<boolean> {
        const index = this.machineryList.findIndex(m => m.id === id);
        if (index !== -1) {
            this.machineryList[index] = { ...this.machineryList[index], ...updatedData };
            return of(true).pipe(delay(300));
        }
        return of(false).pipe(delay(300));
    }

    delete(id: number): Observable<boolean> {
        const index = this.machineryList.findIndex(m => m.id === id);
        if (index !== -1) {
            this.machineryList.splice(index, 1);
            return of(true).pipe(delay(300));
        }
        return of(false).pipe(delay(300));
    }

}
