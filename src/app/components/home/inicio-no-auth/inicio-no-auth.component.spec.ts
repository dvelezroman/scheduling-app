import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioNoAuthComponent } from './inicio-no-auth.component';

describe('InicioNoAuthComponent', () => {
  let component: InicioNoAuthComponent;
  let fixture: ComponentFixture<InicioNoAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioNoAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioNoAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
