import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MachineryModel } from '@core/models/machinery-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-machinery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './machinery-detail.component.html',
  styleUrl: './machinery-detail.component.css'
})
export class MachineryDetailComponent {

  constructor(
    private _dialogRef: MatDialogRef<MachineryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public entity: MachineryModel
  ) { }

  onClose(): void {
    this._dialogRef.close();
  }
}
