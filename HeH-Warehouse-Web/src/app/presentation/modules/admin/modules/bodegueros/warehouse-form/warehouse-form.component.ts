import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@core/common/toast.service';
import { WarehouseModel } from '@core/models/warehouse-model';
import { WarehouseService } from '@core/services/warehouse.service';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

type FormMode = 'create' | 'edit' | 'detail';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.css'
})
export class WarehouseFormComponent implements OnInit {

  public form!: FormGroup;
  public isSubmitting = signal(false);
  public shifts = ['Mañana', 'Tarde', 'Noche'];

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _warehouseService: WarehouseService,
    private _dialogRef: MatDialogRef<WarehouseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode, entity?: WarehouseModel }
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data.mode === 'edit' || this.data.mode === 'detail') {
      this.setData(this.data.entity!);
      console.log(this.data);

      if (this.data.mode === 'detail') {
        this.form.disable();
      }
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

        const warehouseData: WarehouseModel = this.form.value;
        const request$ = this.data.mode === 'edit'
          ? this._warehouseService.update(warehouseData)
          : this._warehouseService.create(warehouseData);

        request$.subscribe({
          next: () => {
            this.form.reset()
            this._toast.success('Acción ejecutada correctamente')
            this._dialogRef.close();
          },
          error: () => this._toast.error('Ha ocurrido un error.')
        })
      }
    })
  }

  onCancel(): void {
    this._dialogRef.close(false);
  }


  private initializeForm(): void {
    this.form = this._fb.group({
      id: [''],
      fullName: ['', Validators.required],
      identification: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      yearsOfExperience: ['', Validators.required],
      shift: ['', Validators.required],
    });
  }

  private setData(data: WarehouseModel): void {
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

  get phone() { return this.form.get('phone')!; }
  get email() { return this.form.get('email')!; }
  get shift() { return this.form.get('shift')!; }
  get fullName() { return this.form.get('fullName')!; }
  get identification() { return this.form.get('identification')!; }
  get yearsOfExperience() { return this.form.get('yearsOfExperience')!; }

}
