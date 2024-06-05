import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximosDashboardStudentComponent } from './proximos-dashboard-student.component';

describe('ProximosDashboardStudentComponent', () => {
  let component: ProximosDashboardStudentComponent;
  let fixture: ComponentFixture<ProximosDashboardStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProximosDashboardStudentComponent]
    });
    fixture = TestBed.createComponent(ProximosDashboardStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
