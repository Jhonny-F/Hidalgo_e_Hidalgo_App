import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importa MatDialog y MatDialogModule
import { DialogBodeguerosComponent } from './dialog-bodegueros.component'; // Importa el componente del diálogo

interface Bodega {
  id: number;
  nombre: string;
  direccion?: string;
  // ... otras propiedades
}

@Component({
  selector: 'app-warehouse-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule, // Asegúrate de tener MatDialogModule aquí
    DialogBodeguerosComponent // Importa el componente del diálogo
  ],
  templateUrl: './warehouse-home.component.html',
  styleUrls: ['./warehouse-home.component.css']
})
export class WarehouseHomeComponent implements OnInit {
  bodeguerosData: Bodega[] = [
    { id: 1, nombre: 'Bodega Central', direccion: 'Quito' },
    { id: 2, nombre: 'Bodega Norte', direccion: 'Guayaquil' }
  ];
  dataSource = new MatTableDataSource(this.bodeguerosData);
  displayedColumns: string[] = ['nombre', 'direccion'];

  constructor(public dialog: MatDialog) { } // Inyecta el servicio MatDialog

  ngOnInit(): void {
  }

  abrirFormularioIngreso(bodega?: Bodega): void {
    const dialogRef = this.dialog.open(DialogBodeguerosComponent, {
      width: '400px',
      data: bodega ? { ...bodega, esEdicion: true, nombre: bodega.nombre, direccion: bodega.direccion } : { esEdicion: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado', result);
      if (result) {
        if (result.esEdicion) {
          // Lógica para editar una bodega existente
          const index = this.bodeguerosData.findIndex(b => b.id === bodega?.id);
          if (index !== -1 && bodega) {
            this.bodeguerosData[index] = { ...bodega, nombre: result.nombre, direccion: result.direccion };
          }
        } else {
          // Lógica para agregar una nueva bodega
          const newBodega: Bodega = {
            id: this.bodeguerosData.length > 0 ? Math.max(...this.bodeguerosData.map(b => b.id)) + 1 : 1,
            nombre: result.nombre,
            direccion: result.direccion
          };
          this.bodeguerosData.push(newBodega);
        }
        this.dataSource = new MatTableDataSource(this.bodeguerosData); // Actualiza el dataSource
      }
    });
  }
}