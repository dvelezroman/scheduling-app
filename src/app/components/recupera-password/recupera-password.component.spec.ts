import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperaPasswordComponent } from './recupera-password.component';

describe('RecuperaPasswordComponent', () => {
  let component: RecuperaPasswordComponent;
  let fixture: ComponentFixture<RecuperaPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperaPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
