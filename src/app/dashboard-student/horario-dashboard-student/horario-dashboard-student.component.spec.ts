import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioDashboardStudentComponent } from './horario-dashboard-student.component';

describe('HorarioDashboardStudentComponent', () => {
  let component: HorarioDashboardStudentComponent;
  let fixture: ComponentFixture<HorarioDashboardStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorarioDashboardStudentComponent]
    });
    fixture = TestBed.createComponent(HorarioDashboardStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
