import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '@core/services/clientes.service';
import { ClientesModel } from '@core/models/clientes-model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cliente-dialog',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ]

})
export class ClienteDialogComponent {
  form: FormGroup;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientesService: ClientesService
  ) {
    this.esEdicion = this.data?.esEdicion || false;

    this.form = this.fb.group({
      fullName: [this.data?.fullName || '', Validators.required],
      identification: [this.data?.identification || '', Validators.required],
      phone: [this.data?.phone || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      yearsOfExperience: [this.data?.yearsOfExperience || 0, Validators.required],
      shift: [this.data?.shift || 'Mañana', Validators.required]
    });
  }
 

  guardar(): void {
    if (this.form.valid) {
        const esEdicion = this.esEdicion; // ✅ Mantener esEdicion separado
        const clientesData: ClientesModel = { ...this.form.value, id: this.data?.id || 0 }; // ✅ Solo incluir propiedades de ClientesModel

        if (esEdicion) {
            this.clientesService.update(clientesData).subscribe(() => this.dialogRef.close(true));
        } else {
            this.clientesService.create(clientesData).subscribe(() => this.dialogRef.close(true));
        }
    }
}




  cerrar(): void {
    this.dialogRef.close();
  }
}