import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Component, OnInit, AfterViewInit, ViewChild, signal } from '@angular/core';

import { ToastService } from '@core/common/toast.service';
import { MachineryModel } from '@core/models/machinery-model';
import { MachineryService } from '@core/services/machinery.service';
import { MachineryFormComponent } from '../machinery-form/machinery-form.component';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';
import { MachineryDetailComponent } from '../machinery-detail/machinery-detail.component';

@Component({
  selector: 'app-machinery-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './machinery-home.component.html',
  styleUrls: ['./machinery-home.component.css']
})
export class MachineryHomeComponent implements OnInit, AfterViewInit {

  public isLoading = signal(false);
  public dataSource = new MatTableDataSource<MachineryModel>();
  public displayedColumns: string[] = ['image', 'name', 'type', 'originCountry', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _machineryService: MachineryService
  ) { }

  ngOnInit(): void {
    this.loadMachinery();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadMachinery(): void {
    this.isLoading.set(true);
    this._machineryService.getAll().subscribe({
      next: (data) => this.dataSource.data = data,
      error: () => this._toast.error('Error cargando maquinaria'),
      complete: () => this.isLoading.set(false)
    });
  }

  openAdd(): void {
    this._dialog.open(MachineryFormComponent, {
      autoFocus: false,
      disableClose: true,
      width: '500px',
      data: { mode: 'create' }
    }).afterClosed().subscribe(() => this.loadMachinery());
  }

  openEdit(entity: MachineryModel): void {
    this._dialog.open(MachineryFormComponent, {
      autoFocus: false,
      disableClose: true,
      width: '500px',
      data: { mode: 'edit', entity }
    }).afterClosed().subscribe(() => this.loadMachinery());
  }

  openDetail(entity: MachineryModel): void {
    this._dialog.open(MachineryDetailComponent, {
      autoFocus: false,
      disableClose: true,
      width: '500px',
      data: entity
    })
  }

  openDelete(id: number): void {
    this.openConfirmationDialog(false).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._machineryService.delete(id).subscribe({
          next: () => {
            this._toast.success('Maquinaria eliminada correctamente');
            this.loadMachinery();
          },
          error: () => this._toast.error('Error al eliminar maquinaria')
        });
      }
    });
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
