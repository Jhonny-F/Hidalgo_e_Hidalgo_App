import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule

@Component({
    selector: 'app-cliente-dialog',
    templateUrl: './dialog-cliente.component.html',
    styleUrls: ['./dialog-cliente.component.css'],
    imports: [
        ReactiveFormsModule, // Importa ReactiveFormsModule para trabajar con formularios reactivos
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule // También podrías necesitar MatDialogModule aquí
    ]
})
export class ClienteDialogComponent {

  form: FormGroup;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.esEdicion = this.data?.esEdicion || false;

    this.form = this.fb.group({
      nombre: [this.data?.nombre || '', Validators.required],
      correo: [this.data?.correo || '', [Validators.required, Validators.email]],
      telefono: [this.data?.telefono || '', Validators.required],
      direccion: [this.data?.direccion || '', Validators.required],
      estado: [this.data?.estado || 'Activo', Validators.required],
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value, esEdicion: this.esEdicion });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
