import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@core/common/toast.service';
import { DespachosModel } from '@core/models/despachos-model';
import { DespachosService } from '@core/services/despachos.service';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

type FormMode = 'create' | 'edit' | 'detail';

@Component({
    selector: 'app-despachos-form',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './despachos-form.component.html',
    styleUrl: './despachos-form.component.css'
})
export class DespachosFormComponent implements OnInit {

  public form!: FormGroup;
  public isSubmitting = signal(false);

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _despachosService: DespachosService,
    private _dialogRef: MatDialogRef<DespachosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode, entity?: DespachosModel }
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data.mode === 'edit') {
      this.setData(this.data.entity!);
    }
  }

    onSubmit(): void {
    if (this.isSubmitting()) return;

    if (this.form.invalid) {
        this.form.markAllAsTouched();
        this._toast.error('Por favor llena todos los campos requeridos');
        return;
    }

    this.openConfirmationDialog(true).subscribe((confirmed: boolean) => {
        if (confirmed) {
            const despachoData: DespachosModel = { ...this.data.entity, ...this.form.value }; // ← Mezcla datos originales y editados
            const request$: Observable<DespachosModel> = this.data.mode === 'edit'
                ? this._despachosService.update(despachoData)
                : this._despachosService.create(despachoData);

            request$.subscribe({
                next: (updatedDespacho) => {
                    console.log("Despacho actualizado correctamente:", updatedDespacho);
                    this._dialogRef.close(updatedDespacho); // ← Enviar el despacho editado correctamente
                },
                error: () => this._toast.error('Ha ocurrido un error.')
            });
        }
    });
}

  onCancel(): void {
    this._dialogRef.close(false);
  }

  private initializeForm(): void {
    this.form = this._fb.group({
      material: ['', Validators.required],
      quantity: ['', Validators.required],
      measure: ['', Validators.required],
      client: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  private setData(data: DespachosModel): void {
    this.form.patchValue(data);
  }

  openConfirmationDialog(data: boolean): Observable<boolean> {
    return this._dialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: data
    }).afterClosed();
  }

  get material() { return this.form.get('material')!; }
  get quantity() { return this.form.get('quantity')!; }
  get measure() { return this.form.get('measure')!; }
  get client() { return this.form.get('client')!; }
  get location() { return this.form.get('location')!; }
  get status() { return this.form.get('status')!; }

}