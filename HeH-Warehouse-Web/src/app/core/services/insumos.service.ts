import { Injectable } from '@angular/core';
import { InsumosModel } from '@core/models/insumos-model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InsumosService {
    private storageKey = 'insumos_materials';
    private insumosKeepers: InsumosModel[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const storedData = localStorage.getItem(this.storageKey);
        this.insumosKeepers = storedData ? JSON.parse(storedData) : [
    { id: 1, nombre: 'Tornillos hexagonal', valor: 0.15, cantidad: 1200, stockMinimo: 500, imagenUrl: 'https://caterpillar.scene7.com/is/image/Caterpillar/CM20210621-8e238-a88bd' },
    { id: 2, nombre: 'Cable eléctrico 2.5mm', valor: 1.20, cantidad: 40, stockMinimo: 50, imagenUrl: 'https://th.bing.com/th/id/R.00650bbd8d025780c0a01cc35a9d576f?rik=Ar5v%2bApH%2f5%2b0cg&riu=http%3a%2f%2fwww.ledycia.com%2falmacen%2farticulos%2fzoom_cable-electrico-25-mm-varios-colores.jpg&ehk=fqRHn8uzzy0WWlHb6N256cmYVLS4XipPL9XnXliB%2fgQ%3d&risl=&pid=ImgRaw&r=0' },
    { id: 3, nombre: 'Malla electrosoldada', valor: 3.50, cantidad: 80, stockMinimo: 30, imagenUrl: 'https://th.bing.com/th/id/OIP.ikJ5oAg0D8NX9qONd7fV2wHaHa?rs=1&pid=ImgDetMain' },
    { id: 4, nombre: 'Lija al agua #120', valor: 0.80, cantidad: 200, stockMinimo: 100, imagenUrl: 'https://www.pronor.com.ar/images/3M-532731604598834138.jpg' },
    { id: 5, nombre: 'Clavos para drywall', valor: 0.10, cantidad: 2500, stockMinimo: 1000, imagenUrl: 'https://th.bing.com/th/id/OIP.WJMQQBUtk_vDIepMIm3agwHaHa?rs=1&pid=ImgDetMain' },,
            
        ];
        this.saveToStorage();
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.insumosKeepers));
    }

    getAll(): Observable<InsumosModel[]> {
        return of(this.insumosKeepers);
    }

    getById(id: number): Observable<InsumosModel | undefined> {
        const result = this.insumosKeepers.find(w => w.id === id);
        return of(result);
    }

    create(insumosKeepers: InsumosModel): Observable<void> {
        const newId = Math.max(...this.insumosKeepers.map(w => w.id || 0), 0) + 1;
        this.insumosKeepers.push({ ...insumosKeepers, id: newId });
        this.saveToStorage();
        return of(void 0);
    }

    update(updatedInsumos: InsumosModel): Observable<void> {
        const index = this.insumosKeepers.findIndex(w => w.id === updatedInsumos.id);
        if (index !== -1) {
            this.insumosKeepers[index] = { ...this.insumosKeepers[index], ...updatedInsumos };
            this.saveToStorage();
        }
        return of(void 0);
    }

    delete(id: number): Observable<boolean> {
        const index = this.insumosKeepers.findIndex(w => w.id === id);
        if (index !== -1) {
            this.insumosKeepers.splice(index, 1);
            this.saveToStorage();
            return of(true);
        }
        return of(false);
    }
}