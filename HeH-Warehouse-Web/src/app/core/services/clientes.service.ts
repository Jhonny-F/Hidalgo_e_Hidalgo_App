import { Injectable } from '@angular/core';
import { ClientesModel } from '@core/models/clientes-model';
import { Observable, of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private clientes: ClientesModel[] = [ // ✅ Cambia `warehouseKeepers` a `clientes`
        { id: 1, fullName: "Carlos Pérez", identification: "0102030405", phone: "0991234567",
          email: "carlos.perez@example.com", address: "Av. Principal", status: "Activo", shift: "Mañana" },
        { id: 2, fullName: "Luisa Gómez", identification: "0607080910", phone: "0987654321",
          email: "luisa.gomez@example.com", address: "Calle Secundaria", status: "Inactivo", shift: "Tarde" }
    ];

    getAll(): Observable<ClientesModel[]> {
        return of(this.clientes);
    }

    getById(id: number): Observable<ClientesModel | undefined> {
        const result = this.clientes.find(w => w.id === id);
        return of(result);
    }

    create(warehouseKeeper: ClientesModel): Observable<void> {
    const existe = this.clientes.some(w => w.identification === warehouseKeeper.identification);
    if (!existe) {
        const newId = Math.max(...this.clientes.map(w => w.id || 0), 0) + 1;
        this.clientes.push({ ...warehouseKeeper, id: newId });
    }
    return of(void 0);
}


    update(updatedCliente: ClientesModel): Observable<void> {
        const index = this.clientes.findIndex(c => c.id === updatedCliente.id);
        if (index !== -1) {
            this.clientes[index] = { ...this.clientes[index], ...updatedCliente };
        }
        return of(void 0);
    }

    delete(id: number): Observable<boolean> {
    const index = this.clientes.findIndex(w => w.id === id);
    if (index !== -1) {
        this.clientes.splice(index, 1);
    }
    return of(true); 
    }
}