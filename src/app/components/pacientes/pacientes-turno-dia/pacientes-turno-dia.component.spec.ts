import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesTurnoDiaComponent } from './pacientes-turno-dia.component';

describe('PacientesTurnoDiaComponent', () => {
  let component: PacientesTurnoDiaComponent;
  let fixture: ComponentFixture<PacientesTurnoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacientesTurnoDiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientesTurnoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
