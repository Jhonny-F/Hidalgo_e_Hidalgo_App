import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteDialogComponent } from '@presentation/modules/clientes/dialog-cliente.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  estado: string;
}

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        //ClienteDialogComponent
    ]
})
export class ClientesComponent {
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@gmail.com', telefono: '0991234567', direccion: 'Quito', estado: 'Activo' },
    { id: 2, nombre: 'María López', correo: 'maria@hotmail.com', telefono: '0987654321', direccion: 'Guayaquil', estado: 'Inactivo' }
  ];

  filtro: string = '';

  constructor(private dialog: MatDialog) {}

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter(c =>
      Object.values(c).some(valor =>
        valor.toString().toLowerCase().includes(this.filtro.toLowerCase())
      )
    );
  }

  abrirDialogo(cliente?: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '400px',
      data: cliente ? { ...cliente, esEdicion: true } : { esEdicion: false }
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (resultado.esEdicion) { // Verificamos la propiedad esEdicion
          const index = this.clientes.findIndex(c => c.id === resultado.id);
          if (index !== -1) this.clientes[index] = resultado;
        } else {
          const nuevoId = Math.max(...this.clientes.map(c => c.id), 0) + 1; // Aseguramos que el ID sea al menos 1 si no hay clientes
          this.clientes.push({ ...resultado, id: nuevoId });
        }
      }
    });
  }

  eliminarCliente(cliente: Cliente): void {
    this.clientes = this.clientes.filter(c => c.id !== cliente.id);
  }
}
