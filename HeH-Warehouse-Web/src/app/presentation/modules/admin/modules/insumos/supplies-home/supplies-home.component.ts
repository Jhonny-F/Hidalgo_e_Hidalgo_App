import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { DialogSuppliesComponent } from '../../insumos/dialog-supplies.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

interface Insumo {
  id: number;
  nombre: string;
  valor: number;
  cantidad: number;
  stockMinimo: number;
  unidadMedida?: string;
  ubicacion?: string;
  imagenUrl?: string;
}

@Component({
  selector: 'app-supplies-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    //DialogSuppliesComponent,
    MatPaginatorModule,
  ],
  templateUrl: './supplies-home.component.html',
  styleUrls: ['./supplies-home.component.css'],
})
export class SuppliesHomeComponent implements OnInit, OnDestroy {
  insumosData: Insumo[] = [
    { id: 1, nombre: 'Bloques De Cemento', valor: 2.50, cantidad: 500, stockMinimo: 100, unidadMedida: 'Unidades', ubicacion: 'Almacén A', imagenUrl: 'assets/img/bloque.png' },
    { id: 2, nombre: 'Cemento Gris', valor: 8.00, cantidad: 200, stockMinimo: 50, unidadMedida: 'Bultos', ubicacion: 'Almacén B', imagenUrl: 'assets/img/cemento.png' },
    { id: 3, nombre: 'Varilla De Hierro', valor: 5.50, cantidad: 150, stockMinimo: 30, unidadMedida: 'Barras', ubicacion: 'Almacén C', imagenUrl: 'assets/img/varilla.png' },
    { id: 4, nombre: 'Arena Gruesa', valor: 12.00, cantidad: 30, stockMinimo: 10, unidadMedida: 'Metros Cúbicos', ubicacion: 'Patio Exterior', imagenUrl: 'assets/img/arena.png' },
    { id: 5, nombre: 'Piedra Triturada', valor: 15.00, cantidad: 150, stockMinimo: 40, unidadMedida: 'Metros Cúbicos', ubicacion: 'Patio Exterior', imagenUrl: 'assets/img/piedra.png' },
  ];

  dataSource = new MatTableDataSource<Insumo>(this.insumosData);
  displayedColumns: string[] = ['imagen', 'nombre', 'cantidad', 'unidadMedida', 'ubicacion', 'acciones'];
  searchInputChange = new Subject<string>();
  searchSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.setupSearch();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  setupSearch(): void {
    this.searchSubscription = this.searchInputChange.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchInput(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchInputChange.next(filterValue);
  }

  registrarInsumo(insumo?: Insumo): void {
    const dialogRef = this.dialog.open(DialogSuppliesComponent, {
      width: '400px',
      data: insumo ? { ...insumo, esEdicion: true } : { esEdicion: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.esEdicion && insumo) {
          const index = this.insumosData.findIndex(i => i.id === insumo.id);
          if (index !== -1) {
            this.insumosData[index] = { ...insumo, ...result };
            this.actualizarTabla();
          }
        } else if (!result.esEdicion) {
          const newInsumo: Insumo = {
            id: this.insumosData.length > 0 ? Math.max(...this.insumosData.map(i => i.id)) + 1 : 1,
            ...result
          };
          this.insumosData.push(newInsumo);
          this.actualizarTabla();
        }
      }
    });
  }

  eliminarInsumo(insumo: Insumo): void {
    this.insumosData = this.insumosData.filter(i => i.id !== insumo.id);
    this.actualizarTabla();
  }

  actualizarTabla(): void {
    this.dataSource = new MatTableDataSource<Insumo>(this.insumosData);
    this.dataSource.paginator = this.paginator;
    this.applyFilter((document.getElementById('searchInput') as HTMLInputElement)?.value || '');
  }
}