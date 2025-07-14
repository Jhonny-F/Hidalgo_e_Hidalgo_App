import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ToastService } from '@core/common/toast.service';
import { WarehouseModel } from '@core/models/warehouse-model';
import { WarehouseService } from '@core/services/warehouse.service';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

@Component({
    selector: 'app-warehouse-home',
    imports: [
        CommonModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatProgressBarModule,
    ],
    templateUrl: './warehouse-home.component.html',
    styleUrls: ['./warehouse-home.component.css']
})
export class WarehouseHomeComponent implements OnInit {

  public isLoading = signal<boolean>(false);
  public dataSource = new MatTableDataSource<WarehouseModel>();
  public displayedColumns: string[] = ['identification', 'fullName', 'shift', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _warehouseService: WarehouseService,
  ) { }

  ngOnInit(): void {
    this.loadWarehouse();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = "Items por Página ";
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadWarehouse() {
    this.isLoading.set(true)
    this._warehouseService.getAll().subscribe({
      next: (data: WarehouseModel[]) => this.dataSource.data = data,
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false)
    })
  }

  openAdd() {
    this._dialog.open(WarehouseFormComponent, {
      autoFocus: false,
      disableClose: true,
      width: '450px',
      data: { mode: 'create' }
    }).afterClosed().subscribe(() => this.loadWarehouse());
  }

  openEdit(entity: WarehouseModel) {
    this._dialog.open(WarehouseFormComponent, {
      autoFocus: false,
      disableClose: true,
      width: '450px',
      data: { mode: 'edit', entity }
    }).afterClosed().subscribe(() => this.loadWarehouse());
  }

  openDetail(entity: WarehouseModel) {
    this._dialog.open(WarehouseFormComponent, {
      autoFocus: false,
      disableClose: true,
      width: '450px',
      data: { mode: 'detail', entity }
    }).afterClosed().subscribe(() => this.loadWarehouse());
  }

  openDelete(id: number): void {
    this.openConfirmationDialog(false).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._warehouseService.delete(id).subscribe({
          next: () => {
            this._toast.success('Eliminación éxitosa')
            this.loadWarehouse()
          },
          error: () => this._toast.error('Ha ocurrido un error')
        })
      }
    })
  }

  openConfirmationDialog(data: boolean): Observable<boolean> {
    return this._dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: data
    }).afterClosed();
  }

}