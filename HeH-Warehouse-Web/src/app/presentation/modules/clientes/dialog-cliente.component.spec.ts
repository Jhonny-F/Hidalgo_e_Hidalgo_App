import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDialogComponent } from './dialog-cliente.component';

describe('DialogClienteComponent', () => {
  let component: ClienteDialogComponent ;
  let fixture: ComponentFixture<ClienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
