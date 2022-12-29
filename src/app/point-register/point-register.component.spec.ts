import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointRegisterComponent } from './point-register.component';

describe('PointRegisterComponent', () => {
  let component: PointRegisterComponent;
  let fixture: ComponentFixture<PointRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
