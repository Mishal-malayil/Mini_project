import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  today = new Date();
  dashboard:any = {};

  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(){

    this.dashboardService.getDashboard().subscribe({

      next:(res)=>{

        this.dashboard = res;

      },

      error:(err)=>{

        console.log(err);

      }

    });

  }

}