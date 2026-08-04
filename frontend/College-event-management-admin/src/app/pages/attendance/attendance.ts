import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../core/services/attendance';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  attendances: any[] = [];
  filteredAttendances: any[] = [];

  selectedAttendance: any = {};

  constructor(private attendanceService: AttendanceService, private searchService: SearchService    ) {}

  ngOnInit(): void {
    this.loadAttendance();
    this.searchService.search$.subscribe(text => {

    console.log("Search:", text);

    this.filteredAttendances = this.attendances.filter(attendance =>

      attendance.registration?.student?.name
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||

      attendance.registration?.event?.event_name
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||

      attendance.status
        ?.toLowerCase()
        .includes(text.toLowerCase())

    );

  });
  }

  loadAttendance() {

    this.attendanceService.getAttendance().subscribe({

      next: (res: any) => {

        this.attendances = res;
        this.filteredAttendances = res;

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