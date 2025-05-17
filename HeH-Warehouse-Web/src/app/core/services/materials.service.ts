import { Injectable } from '@angular/core';
import { MaterialsModel } from '@core/models/materials-model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MaterialsService {
    private storageKey = 'construction_materials';
    private materialsKeepers: MaterialsModel[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const storedData = localStorage.getItem(this.storageKey);
        this.materialsKeepers = storedData ? JSON.parse(storedData) : [
            {
                id: 1, name: "Bloques de cemento", quantity: 500, measure: "Unidades",
                location: "Almacen A"
            },
            {
                id: 2, name: "Cemento gris", quantity: 200, measure: "Bultos",
                location: "Almacen B"
            },
            {
                id: 3, name: "Varilla de hierro", quantity: 150, measure: "Barras",
                location: "Almacen C"
            },
            {
                id: 4, name: "Arena gruesa", quantity: 30, measure: "Metros cúbicos",
                location: "Patio exterior"
            },
            {
                id: 5, name: "Piedra triturada", quantity: 150, measure: "Metros cúbicos",
                location: "Patio exterior"
            },
        ];
        this.saveToStorage();
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.materialsKeepers));
    }

    getAll(): Observable<MaterialsModel[]> {
        return of(this.materialsKeepers);
    }

    getById(id: number): Observable<MaterialsModel | undefined> {
        const result = this.materialsKeepers.find(w => w.id === id);
        return of(result);
    }

    create(materialsKeepers: MaterialsModel): Observable<void> {
        const newId = Math.max(...this.materialsKeepers.map(w => w.id || 0), 0) + 1;
        this.materialsKeepers.push({ ...materialsKeepers, id: newId });
        this.saveToStorage();
        return of(void 0);
    }

    update(updatedMaterials: MaterialsModel): Observable<void> {
        const index = this.materialsKeepers.findIndex(w => w.id === updatedMaterials.id);
        if (index !== -1) {
            this.materialsKeepers[index] = { ...this.materialsKeepers[index], ...updatedMaterials };
            this.saveToStorage();
        }
        return of(void 0);
    }

    delete(id: number): Observable<boolean> {
        const index = this.materialsKeepers.findIndex(w => w.id === id);
        if (index !== -1) {
            this.materialsKeepers.splice(index, 1);
            this.saveToStorage();
            return of(true);
        }
        return of(false);
    }
}