import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDashboardStudentComponent } from './navbar-dashboard-student.component';

describe('NavbarDashboardStudentComponent', () => {
  let component: NavbarDashboardStudentComponent;
  let fixture: ComponentFixture<NavbarDashboardStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarDashboardStudentComponent]
    });
    fixture = TestBed.createComponent(NavbarDashboardStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
