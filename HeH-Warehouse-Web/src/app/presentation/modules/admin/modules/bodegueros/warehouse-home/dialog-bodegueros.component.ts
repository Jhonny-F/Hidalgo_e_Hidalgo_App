import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface DialogData {
  esEdicion: boolean;
  nombre?: string;
  direccion?: string;
}

@Component({
  selector: 'app-dialog-bodegueros',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './dialog-bodegueros.component.html',
  styleUrls: ['./dialog-bodegueros.component.css']
})
export class DialogBodeguerosComponent {
  esEdicion: boolean;
  nombre: string = '';
  direccion: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogBodeguerosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.esEdicion = data?.esEdicion || false;
    this.nombre = data?.nombre || '';
    this.direccion = data?.direccion || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardarDatos(): void {
    const formData = { nombre: this.nombre, direccion: this.direccion, esEdicion: this.esEdicion };
    this.dialogRef.close(formData); // <-- Esta línea es crucial para enviar los datos
  }
}