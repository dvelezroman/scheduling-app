import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesDiagnosticosComponent } from './pacientes-diagnosticos.component';

describe('PacientesDiagnosticosComponent', () => {
  let component: PacientesDiagnosticosComponent;
  let fixture: ComponentFixture<PacientesDiagnosticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacientesDiagnosticosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientesDiagnosticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
