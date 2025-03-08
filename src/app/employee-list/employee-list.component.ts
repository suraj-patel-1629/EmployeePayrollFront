import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../services/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [CommonModule, RouterModule,FormsModule]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchText: string = ''; 

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  goToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  deleteEmployee(id?: number) {
    if (id !== undefined) {
      if (confirm('Are you sure you want to delete this employee?')) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            console.log('Employee deleted successfully'); 
            this.loadEmployees(); 
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          }
        });
      }
    } else {
      console.error('Invalid employee ID:', id);
    }
  }

  updateEmployee(id?: number, employee?: Employee) {
    if (id !== undefined && employee) {
      console.log('Updating employee with ID:', id, 'Data:', employee);
      this.employeeService.updateEmployee(id, employee).subscribe({
        next: () => {
          console.log('Employee updated successfully'); 
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      console.error('Invalid employee ID or data:', id, employee);
    }
  }

  filteredEmployees() {
    if (!this.searchText.trim()) return this.employees; 

    return this.employees.filter(employee =>
      employee.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      employee.department?.some(dept => dept.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }
}
