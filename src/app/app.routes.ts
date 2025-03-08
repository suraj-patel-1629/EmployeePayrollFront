import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent }, // Home (Employee List)
  { path: 'add-employee', component: EmployeeFormComponent }, 
  { path: 'edit/:id', component: EmployeeFormComponent } 
];
