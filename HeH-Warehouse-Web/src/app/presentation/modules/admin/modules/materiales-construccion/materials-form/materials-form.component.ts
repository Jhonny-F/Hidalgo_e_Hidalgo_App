import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@core/common/toast.service';
import { MaterialsModel } from '@core/models/materials-model';
import { MaterialsService } from '@core/services/materials.service';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';

type FormMode = 'create' | 'edit' | 'detail';

@Component({
    selector: 'app-materials-form',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './materials-form.component.html',
    styleUrl: './materials-form.component.css'
})
export class MaterialsFormComponent implements OnInit {

  public form!: FormGroup;
  public isSubmitting = signal(false);

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _materialsService: MaterialsService,
    private _dialogRef: MatDialogRef<MaterialsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode, entity?: MaterialsModel }
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

        const materialsData: MaterialsModel = this.form.value;
        const request$ = this.data.mode === 'edit'
          ? this._materialsService.update(materialsData)
          : this._materialsService.create(materialsData);

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
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      measure: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  private setData(data: MaterialsModel): void {
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
  get quantity() { return this.form.get('quantity')!; }
  get measure() { return this.form.get('measure')!; }
  get location() { return this.form.get('location')!; }
}
