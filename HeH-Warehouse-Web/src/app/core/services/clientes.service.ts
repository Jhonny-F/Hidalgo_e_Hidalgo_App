import { Injectable } from '@angular/core';
import { ClientesModel } from '@core/models/clientes-model';
import { Observable, of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private clientes: ClientesModel[] = [
    { id: 1, fullName: "Carlos Santos", identification: "0102030405", phone: "0991234567",
      email: "carlossan@gmail.com", address: "Av. Quito", status: "Activo", shift: "Mañana" },
    { id: 2, fullName: "Luisa Astudillo", identification: "0607080910", phone: "0987654321",
      email: "luisa.ast@outlook.com", address: "Av. Perimetral", status: "Inactivo", shift: "Tarde" },
    { id: 3, fullName: "Juan Rodríguez", identification: "0708091011", phone: "0976543210",
      email: "juan.conejito@hotmail.com", address: "Vía Daule", status: "Activo", shift: "Noche" },
    { id: 4, fullName: "Ana Fernández", identification: "0203040506", phone: "0965432109",
      email: "ana.fernandez@protonmail.com", address: "Lejos", status: "Activo", shift: "Mañana" }
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