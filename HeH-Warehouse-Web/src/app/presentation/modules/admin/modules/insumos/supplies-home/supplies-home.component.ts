import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { DialogSuppliesComponent } from '../dialog-supplies.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

interface Insumo {
  id: number;
  nombre: string;
  valor: number;
  cantidad: number;
  stockMinimo: number;
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
  styleUrls: ['./supplies-home.component.css']
})
export class SuppliesHomeComponent implements OnInit, OnDestroy {
  insumosData: Insumo[] = [
    { id: 1, nombre: 'Tornillos hexagonal', valor: 0.15, cantidad: 1200, stockMinimo: 500, imagenUrl: 'https://caterpillar.scene7.com/is/image/Caterpillar/CM20210621-8e238-a88bd' },
    { id: 2, nombre: 'Cable eléctrico 2.5mm', valor: 1.20, cantidad: 150, stockMinimo: 50, imagenUrl: 'https://th.bing.com/th/id/R.00650bbd8d025780c0a01cc35a9d576f?rik=Ar5v%2bApH%2f5%2b0cg&riu=http%3a%2f%2fwww.ledycia.com%2falmacen%2farticulos%2fzoom_cable-electrico-25-mm-varios-colores.jpg&ehk=fqRHn8uzzy0WWlHb6N256cmYVLS4XipPL9XnXliB%2fgQ%3d&risl=&pid=ImgRaw&r=0' },
    { id: 3, nombre: 'Malla electrosoldada', valor: 3.50, cantidad: 80, stockMinimo: 30, imagenUrl: 'https://th.bing.com/th/id/OIP.ikJ5oAg0D8NX9qONd7fV2wHaHa?rs=1&pid=ImgDetMain' },
    { id: 4, nombre: 'Lija al agua #120', valor: 0.80, cantidad: 200, stockMinimo: 100, imagenUrl: 'https://www.pronor.com.ar/images/3M-532731604598834138.jpg' },
    { id: 5, nombre: 'Clavos para drywall', valor: 0.10, cantidad: 2500, stockMinimo: 1000, imagenUrl: 'https://th.bing.com/th/id/OIP.WJMQQBUtk_vDIepMIm3agwHaHa?rs=1&pid=ImgDetMain' },
  ];

  dataSource = new MatTableDataSource<Insumo>(this.insumosData);
  displayedColumns: string[] = ['imagen', 'nombre', 'valor', 'cantidad', 'stockMinimo', 'acciones'];
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