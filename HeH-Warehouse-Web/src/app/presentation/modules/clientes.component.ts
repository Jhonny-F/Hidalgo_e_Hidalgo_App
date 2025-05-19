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
import { ClientesService } from '@core/services/clientes.service';
import { ClientesModel } from '@core/models/clientes-model';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: true,
  
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})

export class ClientesComponent {
  clientes: ClientesModel[] = [];
  filtro: string = '';
  displayedColumns: string[] = ['fullName', 'email', 'phone', 'identification', 'shift', 'acciones'];

  constructor(private dialog: MatDialog, private clientesService: ClientesService) {
    this.cargarClientes();

  }

  cargarClientes(): void {
  this.clientesService.getAll().subscribe((clientes: ClientesModel[]) => {
    console.log("Clientes cargados:", clientes); 
    this.clientes = clientes;
  });
  }


  get clientesFiltrados(): ClientesModel[] {
    return this.clientes.filter(c => 
      Object.values(c).some(valor => 
        valor.toString().toLowerCase().includes(this.filtro.toLowerCase())
      )
    );
  }

  abrirDialogo(cliente?: ClientesModel): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
        width: '400px',
        data: cliente ? { ...cliente, esEdicion: true } : { esEdicion: false }
    });

    dialogRef.afterClosed().subscribe(resultado => {
        if (resultado) {
            this.cargarClientes(); 
        }
    });
}


  eliminarCliente(cliente: ClientesModel): void {
    if (cliente.id !== undefined) {
        this.clientesService.delete(cliente.id).subscribe(() => this.cargarClientes());
    } else {
        console.error("Error: Cliente sin ID válido", cliente);
    }
}

}
