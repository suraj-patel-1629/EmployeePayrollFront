import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: any = {
    name: '',
    profilePic: '',
    gender: '',
    department: [],
    salary: '',
    startDate: '',
    note: ''
  };

  formTitle: string = 'Add New Employee'; 

 

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private employeeService: EmployeeService
) {}

  employeeId!: number | null;

  ngOnInit(): void {
    // Get Employee ID from URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.formTitle = 'Update Employee'; 
        this.loadEmployee(this.employeeId);
      }
    });
  }

  loadEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe(employee => {
      if (employee) {
        this.employee = {
          ...employee,
          // startDate: this.parseDate(employee.startDate),
        };
      }
    });
  }


  
 
 

  // Toggle Department Selection
  toggleDepartment(dept: string) {
    const index = this.employee.department.indexOf(dept);
    if (index > -1) {
      this.employee.department.splice(index, 1);
    } else {
      this.employee.department.push(dept); 
    }
  }

  // Save Employee (Create or Update)
  saveEmployee() {
  // Ensure startDate is correctly formatted before sending to the backend
  const formattedEmployee = {
    ...this.employee,
     startDate: `${this.formatDate(this.employee.startDate)}`, // Convert object to string
  };

  if (this.employeeId) {
    // Update Employee
    this.employeeService.updateEmployee(this.employeeId, formattedEmployee).subscribe({
      next: () => {
        console.log('Employee updated successfully');
        this.router.navigate(['/']); 
      },
      error: (err) => console.error('Error updating employee:', err) 
    });
  } else {
    // Add New Employee
    this.employeeService.addEmployee(formattedEmployee).subscribe({
      next: () => {
        console.log('Employee added successfully');
        this.router.navigate(['/']); 
      },
      error: (err) => console.error('Error adding employee:', err) 
    });
  }
}

  setSalary(amount: number) {
  this.employee.salary = amount;
}



formatDate(date: any): string {
  console.log(date);
  if (!date) return ''; // Handle empty case

  // Convert to Date object
  const newDate = new Date(date);
  console.log(newDate);

  // Extract day, month, and year
  const day = String(newDate.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const year = newDate.getFullYear();
  console.log(year)
  return `${day}-${month}-${year}`; // Return in "DD-MM-YYYY" format
}

}
