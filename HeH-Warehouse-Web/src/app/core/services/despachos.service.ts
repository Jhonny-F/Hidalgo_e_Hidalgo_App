import { Injectable } from '@angular/core';
import { DespachosModel } from '@core/models/despachos-model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DespachosService {
    private storageKey = 'construction_despachos';
    private despachosKeepers: DespachosModel[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const storedData = localStorage.getItem(this.storageKey);
        this.despachosKeepers = storedData ? JSON.parse(storedData) : [
            {
                id: 1, material: "Cemento gris", quantity: 200, measure: "Bultos",
                client: "Juanito Pérez", location: "Obra Quito", status: "Pendiente"
            },
            {
                id: 2, material: "Varilla de hierro", quantity: 150, measure: "Barras",
                client: "Mariana López", location: "Proyecto Guayaquil", status: "Enviado"
            },
            {
                id: 3, material: "Arena gruesa", quantity: 30, measure: "Metros cúbicos",
                client: "Carlos Gómez", location: "Obra Loja", status: "Entregado"
            }
        ];
        this.saveToStorage();
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.despachosKeepers));
    }

    getAll(): Observable<DespachosModel[]> {
        return of(this.despachosKeepers);
    }

    getById(id: number): Observable<DespachosModel | undefined> {
        const result = this.despachosKeepers.find(w => w.id === id);
        return of(result);
    }

    create(despacho: DespachosModel): Observable<DespachosModel> {
    const newId = Math.max(...this.despachosKeepers.map(w => w.id || 0), 0) + 1;
    const newDespacho = { ...despacho, id: newId };

    if (!this.despachosKeepers.some(d => d.id === newId)) { // Evita duplicados
        this.despachosKeepers.push(newDespacho);
        this.saveToStorage();
    }

    console.log("Despacho agregado:", newDespacho); // ← Verificación en consola
    return of(newDespacho);
}

    update(updatedDespacho: DespachosModel): Observable<DespachosModel> {
    const index = this.despachosKeepers.findIndex(w => w.id === updatedDespacho.id);
    if (index !== -1) {
        this.despachosKeepers[index] = { ...this.despachosKeepers[index], ...updatedDespacho }; // ← Mezcla los valores correctamente
        this.saveToStorage();
    } else {
        console.error("Error: No se encontró el despacho a actualizar.", updatedDespacho);
    }

    console.log("Despacho actualizado en localStorage:", this.despachosKeepers);
    return of(updatedDespacho);
}

    delete(id: number): Observable<boolean> {
        const index = this.despachosKeepers.findIndex(w => w.id === id);
        if (index !== -1) {
            this.despachosKeepers.splice(index, 1);
            this.saveToStorage();
            return of(true);
        }
        return of(false);
    }
}