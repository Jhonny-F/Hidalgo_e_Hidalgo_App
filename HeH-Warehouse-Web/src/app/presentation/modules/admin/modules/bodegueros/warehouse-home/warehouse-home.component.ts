import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AfterViewInit, Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ToastService } from '@core/common/toast.service';
import { WarehouseModel } from '@core/models/warehouse-model';
import { WarehouseService } from '@core/services/warehouse.service';

@Component({
  selector: 'app-warehouse-home',
  standalone: true,
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

}