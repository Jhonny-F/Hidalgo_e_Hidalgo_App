import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastService } from '@core/common/toast.service';
import { MachineryModel } from '@core/models/machinery-model';
import { MachineryService } from '@core/services/machinery.service';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

type FormMode = 'create' | 'edit';

@Component({
    selector: 'app-machinery-form',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './machinery-form.component.html',
    styleUrl: './machinery-form.component.css'
})
export class MachineryFormComponent implements OnInit {

  public form!: FormGroup;
  public isSubmitting = signal(false);

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _machineryService: MachineryService,
    private _dialogRef: MatDialogRef<MachineryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode, entity?: MachineryModel }
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data.mode === 'edit' && this.data.entity) {
      this.setData(this.data.entity);
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
      if (!confirmed) return;

      this.isSubmitting.set(true);
      const machineryData: MachineryModel = this.form.value;

      const request$ = this.data.mode === 'edit'
        ? this._machineryService.update(machineryData)
        : this._machineryService.create(machineryData);

      request$.subscribe({
        next: () => {
          this.form.reset();
          this._toast.success('Acción ejecutada correctamente');
          this._dialogRef.close(true);
        },
        error: () => {
          this._toast.error('Ha ocurrido un error.');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false)
      });
    });
  }

  onCancel(): void {
    this._dialogRef.close(false);
  }

  private initializeForm(): void {
    this.form = this._fb.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      originCountry: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  private setData(data: MachineryModel): void {
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

  get name() { return this.form.get('name')!; }
  get type() { return this.form.get('type')!; }
  get brand() { return this.form.get('brand')!; }
  get model() { return this.form.get('model')!; }
  get originCountry() { return this.form.get('originCountry')!; }
  get imageUrl() { return this.form.get('imageUrl')!; }
}
