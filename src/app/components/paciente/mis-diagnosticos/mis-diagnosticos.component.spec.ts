import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDiagnosticosComponent } from './mis-diagnosticos.component';

describe('MisDiagnosticosComponent', () => {
  let component: MisDiagnosticosComponent;
  let fixture: ComponentFixture<MisDiagnosticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisDiagnosticosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisDiagnosticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
