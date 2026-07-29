import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EventCategoryService } from '../../core/services/event-category';

@Component({
  selector: 'app-event-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './event-categories.html',
  styleUrl: './event-categories.css'
})
export class EventCategories implements OnInit {

  categories: any[] = [];

  category = {
    category_name: '',
    description: '',
    status: 'active'
  };

  selectedCategory: any = {};

  editCategoryData: any = {
    id: '',
    category_name: '',
    description: '',
    status: 'active'
  };

  constructor(
    private categoryService: EventCategoryService
  ) {}

  ngOnInit(): void {

    this.loadCategories();

  }

  // Load Categories

  loadCategories() {

    this.categoryService.getCategories().subscribe({

      next: (res: any) => {

        this.categories = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Add Category

  addCategory(form: NgForm) {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }

    this.categoryService.addCategory(this.category).subscribe({

      next: () => {

        alert("Category Added Successfully");

        this.loadCategories();

        form.resetForm();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // View Category

  viewCategory(id: number) {

    this.categoryService.getCategory(id).subscribe({

      next: (res: any) => {

        this.selectedCategory = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Edit Category

  editCategory(id: number) {

    this.categoryService.getCategory(id).subscribe({

      next: (res: any) => {

        this.editCategoryData = { ...res };

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Update Category

  updateCategory() {

    this.categoryService.updateCategory(

      this.editCategoryData.id,
      this.editCategoryData

    ).subscribe({

      next: () => {

        alert("Category Updated Successfully");

        this.loadCategories();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Delete Category

  deleteCategory(id: number) {

    if (confirm("Delete this Category?")) {

      this.categoryService.deleteCategory(id).subscribe({

        next: () => {

          alert("Category Deleted");

          this.loadCategories();

        },

        error: (err) => {

          console.log(err);

        }

      });

    }

  }

}