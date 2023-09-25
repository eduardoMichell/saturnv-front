import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonBarComponent } from './button-bar.component';

describe('ButtonBarComponent', () => {
  let component: ButtonBarComponent;
  let fixture: ComponentFixture<ButtonBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonBarComponent]
    });
    fixture = TestBed.createComponent(ButtonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
