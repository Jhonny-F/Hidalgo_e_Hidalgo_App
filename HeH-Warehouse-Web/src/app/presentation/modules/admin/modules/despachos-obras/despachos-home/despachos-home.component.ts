import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DespachosService } from '@core/services/despachos.service';
import { DespachosModel } from '@core/models/despachos-model';
import { DespachosFormComponent } from '../despachos-form/despachos-form.component';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-despachos-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatDialogModule],
  templateUrl: './despachos-home.component.html',
  styleUrl: './despachos-home.component.css'
})
export class DespachosHomeComponent {
  
  displayedColumns: string[] = ['material', 'quantity', 'measure', 'client', 'location', 'status', 'actions'];
  dataSource = new MatTableDataSource<DespachosModel>();

  constructor(private despachosService: DespachosService, private _dialog: MatDialog) {
    this.loadData();
  }

  loadData(): void {
    this.despachosService.getAll().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

    openEdit(element: DespachosModel) {
    console.log('Editando despacho:', element);
    const dialogRef = this._dialog.open(DespachosFormComponent, {
        width: 'auto',
        data: { mode: 'edit', entity: element }
    });

    dialogRef.afterClosed().subscribe(updatedDespacho => {
        console.log('Diálogo cerrado, despacho actualizado:', updatedDespacho);
        if (updatedDespacho) {
            this.loadData(); // ← Recargar los datos desde `localStorage`
        } else {
            console.error("Error: No se recibió despacho actualizado.");
        }
    });
}

    openDelete(id: number) {
    console.log('Eliminando despacho con ID:', id);
    const dialogRef = this._dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: true
    });

    dialogRef.afterClosed().subscribe(confirmed => {
        console.log('Confirmación recibida:', confirmed);
        if (confirmed) {
            this.despachosService.delete(id).subscribe(() => {
                console.log('Despacho eliminado, recargando tabla...');
                this.loadData(); // Recargar la tabla después de eliminar
            });
        }
    });
}

    openAdd() {
    console.log("Abrir formulario para agregar despacho");
    const dialogRef = this._dialog.open(DespachosFormComponent, {
        width: 'auto',
        data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(newDespacho => {
        console.log('Diálogo cerrado, despacho agregado:', newDespacho);
        if (newDespacho) {
            this.loadData(); // ← Solo recargamos los datos en lugar de agregarlos manualmente
        }
    });
}

  isLoading() {
    return false;
  }
}