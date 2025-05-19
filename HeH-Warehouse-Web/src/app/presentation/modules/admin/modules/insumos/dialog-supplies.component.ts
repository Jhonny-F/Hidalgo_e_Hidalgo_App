// dialog-cliente.component.ts
import { Component, Inject }               from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA }   from '@angular/material/dialog';
import { MatFormFieldModule }              from '@angular/material/form-field';
import { MatInputModule }                  from '@angular/material/input';
import { MatButtonModule }                 from '@angular/material/button';

export interface DialogData {
  esEdicion: boolean;
  id?: number;
  nombre?: string;
  valor?: number;
  cantidad?: number;
  stockMinimo?: number;
}

@Component({
  selector: 'app-dialog-supplies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dialog-supplies.component.html',
  styleUrls: ['./dialog-supplies.component.css'],
})
export class DialogSuppliesComponent {

  // Propiedades enlazadas con ngModel
  nombre: string;
  valor: number;
  cantidad: number;
  stockMinimo: number;

  constructor(
    private dialogRef: MatDialogRef<DialogSuppliesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Inicializa campos, bien para edición o para un nuevo registro
    this.nombre      = data.nombre      || '';
    this.valor       = data.valor       || 0;
    this.cantidad    = data.cantidad    || 0;
    this.stockMinimo = data.stockMinimo || 0;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardarInsumo(): void {
    // Cierra el diálogo pasando los datos de vuelta
    this.dialogRef.close({
      esEdicion: this.data.esEdicion,
      id:        this.data.id,
      nombre:      this.nombre,
      valor:       this.valor,
      cantidad:    this.cantidad,
      stockMinimo: this.stockMinimo
    });
  }
}
