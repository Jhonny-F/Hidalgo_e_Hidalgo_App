import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@core/common/toast.service';
import { DespachosModel } from '@core/models/despachos-model';
import { DespachosService } from '@core/services/despachos.service';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '@presentation/modules/shared/components/confirmation/confirmation.component';
import { MaterialsService } from '@core/services/materials.service';
import { ClientesService } from '@core/services/clientes.service';

import { MaterialsModel } from '@core/models/materials-model';
import { ClientesModel } from '@core/models/clientes-model';
import { ChangeDetectorRef } from '@angular/core';


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
    public materials: MaterialsModel[] = [];
    public clients: ClientesModel[] = [];
    public selectedMaterial: string = ''; 
    public selectedClient: string = ''; 

    constructor(
    private cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _materialsService: MaterialsService,
    private _clientesService: ClientesService,
    private _despachosService: DespachosService,
    private _dialogRef: MatDialogRef<DespachosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode, entity?: DespachosModel }
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadMaterials(); 
    this.loadClients();

    setTimeout(() => {
        this.form.controls['material'].updateValueAndValidity();
        this.form.controls['client'].updateValueAndValidity();
        this.form.controls['quantity'].updateValueAndValidity();
        this.form.controls['measure'].updateValueAndValidity();
        this.form.controls['location'].updateValueAndValidity();
        this.cdr.detectChanges(); 
    });

    if (this.data.mode === 'edit') {
        this.setData(this.data.entity!);
    }
}


  onMaterialChange(event: any): void {
    const materialId = +event.target.value;
    const selectedMaterial = this.materials.find(m => m.id === materialId);
    if (selectedMaterial) {
        this.form.patchValue({
            material: selectedMaterial.id,
            quantity: selectedMaterial.quantity,
            measure: selectedMaterial.measure,
            location: selectedMaterial.location
        });

        setTimeout(() => this.cdr.detectChanges(), 100); 
    }
}

    onClientChange(event: any): void {
        const clientId = +event.target.value;
        const selectedClient = this.clients.find(c => c.id === clientId);
        if (selectedClient) {
            this.form.patchValue({ client: selectedClient.id });
            setTimeout(() => this.cdr.detectChanges(), 100);
        }
    }




  loadMaterials(): void {
        this._materialsService.getAll().subscribe(materials => {
            this.materials = materials;
        });
    }

    loadClients(): void {
    this._clientesService.getAll().subscribe(clients => {
        this.clients = clients;
    });
}



    onSubmit(): void {
    if (this.isSubmitting()) return;

    if (this.form.invalid) {
        this.form.markAllAsTouched();
        this._toast.error('Por favor llena todos los campos requeridos');
        return;
    }

    const selectedMaterial = this.materials.find(m => m.id === this.form.value.material);
    const selectedClient = this.clients.find(c => c.id === this.form.value.client);

    const despachoData: DespachosModel = { 
        ...this.data.entity, 
        ...this.form.value,
        material: selectedMaterial ? selectedMaterial.name : this.form.value.material,
        client: selectedClient ? selectedClient.fullName : this.form.value.client
    };

    // **Verificar si ya existe un despacho con los mismos datos**
    this._despachosService.getAll().subscribe(existingDespachos => {
        const exists = existingDespachos.some(despacho => 
            despacho.material === despachoData.material &&
            despacho.client === despachoData.client &&
            despacho.quantity === despachoData.quantity &&
            despacho.measure === despachoData.measure &&
            despacho.location === despachoData.location &&
            despacho.status === despachoData.status
        );

        if (!exists) {
            const request$ = this.data.mode === 'edit'
                ? this._despachosService.update(despachoData)
                : this._despachosService.create(despachoData);

            request$.subscribe({
                next: (updatedDespacho) => {
                    console.log("Despacho guardado correctamente:", updatedDespacho);
                    this._dialogRef.close(updatedDespacho);
                },
                error: () => this._toast.error('Ha ocurrido un error.')
            });
        } else {
            this._toast.error('Este despacho ya existe.');
            console.warn("Intento de duplicación evitado.");
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
    const selectedMaterial = this.materials.find(m => m.name === data.material);
    const selectedClient = this.clients.find(c => c.fullName === data.client);

    this.form.patchValue({
        material: selectedMaterial ? selectedMaterial.id : data.material, // Guardar ID correctamente
        client: selectedClient ? selectedClient.id : data.client, 
        quantity: data.quantity,
        measure: data.measure,
        location: data.location,
        status: data.status
    });

    this.cdr.detectChanges();
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