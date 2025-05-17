import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Bodega {
  id: number;
  nombre: string;
  direccion?: string; // La dirección podría ser opcional
  // ... otras propiedades
}

@Component({
  selector: 'app-warehouse-home',
  templateUrl: './warehouse-home.component.html',
  styleUrls: ['./warehouse-home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class WarehouseHomeComponent implements OnInit {
  bodegueros: Bodega[] = [
    { id: 1, nombre: 'Bodega Central', direccion: 'Quito' },
    { id: 2, nombre: 'Bodega Norte', direccion: 'Guayaquil' }
    // ... más bodegas
  ];
  displayedColumns: string[] = ['nombre', 'direccion'];
  dataSource = new MatTableDataSource(this.bodegueros); // Inicializa dataSource aquí

  constructor() { }

  ngOnInit(): void {
  }
}