import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../core/services/attendance';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  attendances: any[] = [];

  selectedAttendance: any = {};

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {

    this.attendanceService.getAttendance().subscribe({

      next: (res: any) => {

        this.attendances = res;

      }

    });

  }

  viewAttendance(id:number){

    this.attendanceService.getSingleAttendance(id).subscribe({

      next:(res:any)=>{

        this.selectedAttendance=res;

      }

    });

  }

}