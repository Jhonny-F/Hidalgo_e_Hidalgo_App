import { MatIcon } from '@angular/material/icon';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation',
    imports: [MatIcon],
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {

  public type = signal<boolean>(false)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private _dialogRef: MatDialogRef<ConfirmationComponent>,
  ) { }

  ngOnInit(): void {
    this.type.set(this.data)
  }

  decline(): void {
    this._dialogRef.close(false)
  }

  accept(): void {
    this._dialogRef.close(true)
  }

}
