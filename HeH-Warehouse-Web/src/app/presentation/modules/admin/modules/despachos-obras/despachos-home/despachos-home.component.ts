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
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ClientesService } from '@core/services/clientes.service';

const getSpanishPaginator = (): MatPaginatorIntl => {
    const paginator = new MatPaginatorIntl();
    paginator.itemsPerPageLabel = 'Ítems por página';
    paginator.nextPageLabel = 'Siguiente';
    paginator.previousPageLabel = 'Anterior';
    paginator.firstPageLabel = 'Primera página';
    paginator.lastPageLabel = 'Última página';
    paginator.getRangeLabel = (page, pageSize, length) => `${page * pageSize + 1} – ${Math.min((page + 1) * pageSize, length)} de ${length}`;
    return paginator;
    };

@Component({
  selector: 'app-despachos-home',
  standalone: true,
  providers: [{ provide: MatPaginatorIntl, useFactory: getSpanishPaginator }],
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
  data.forEach(despacho => {
    console.log(`Material: ${despacho.material}, Tipo: ${typeof despacho.material}`);
    console.log(`Cliente: ${despacho.client}, Tipo: ${typeof despacho.client}`);
  });

  this.dataSource.data = data.map(despacho => ({
    ...despacho,
    material: despacho.material ? String(despacho.material) : '',
    client: despacho.client ? String(despacho.client) : '' // ✅ Se mantiene consistente con `ClienteModel`
  
  }));

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
            this.loadData();
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
                this.loadData(); // Se vuelve a recargar la tabla aqui
            });
        }
    });
}

@ViewChild(MatPaginator) paginator!: MatPaginator;
    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
      // Verificar si ya existe un despacho con ese ID para evitar duplicados
      const exists = this.dataSource.data.some(despacho => despacho.id === newDespacho.id);
      if (!exists) {
        const despachoCorregido = {
          ...newDespacho,
          material: String(newDespacho.material || ''),
          client: String(newDespacho.client || '')
        };

        this.despachosService.create(despachoCorregido).subscribe(() => this.loadData());
      } else {
        console.warn("Intento de duplicación evitado.");
      }
    }
  });


}

  isLoading() {
    return false;
  }
}
