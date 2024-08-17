import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosDatosComponent } from './medicos-datos.component';

describe('MedicosDatosComponent', () => {
  let component: MedicosDatosComponent;
  let fixture: ComponentFixture<MedicosDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicosDatosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicosDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
