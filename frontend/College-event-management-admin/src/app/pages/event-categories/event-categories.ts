import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EventCategoryService } from '../../core/services/event-category';
import Swal from 'sweetalert2';

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
  status: ''
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

    next: (res) => {

      console.log(res);

      this.categories = res;

    }

  });

}

  // Add Category

  addCategory(categoryForm: NgForm) {

  if (categoryForm.invalid) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields.',
      confirmButtonColor: '#F59E0B'
    });

    return;

  }

  this.categoryService.addCategory(this.category).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Category added successfully.',
        confirmButtonColor: '#2563EB'
      });

      this.loadCategories();

      categoryForm.resetForm({
        status: 1
      });

      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById('addCategoryModal')
      );

      modal?.hide();

    },

    error: (error) => {

  console.log('Validation Error:', error.error);

  Swal.fire({
    icon: 'error',
    title: 'Validation Error',
    text: JSON.stringify(error.error.errors),
    confirmButtonColor: '#DC2626'
  });

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

  Swal.fire({
    title: 'Save Changes?',
    text: 'Do you want to update this category?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Update',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563EB',
    cancelButtonColor: '#6c757d'
  }).then((result) => {

    if (result.isConfirmed) {

      this.categoryService.updateCategory(
        this.editCategoryData.id,
        this.editCategoryData
      ).subscribe({

        next: () => {

          const modal = document.getElementById('editCategoryModal');

          if (modal) {
            const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
            bsModal?.hide();
          }

          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category updated successfully.',
            confirmButtonColor: '#2563EB',
            timer: 1800,
            showConfirmButton: false
          });

          this.loadCategories();

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Update Failed!',
            text: 'Something went wrong.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

    }

  });

}

  // Delete Category

  deleteCategory(id: number) {

  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to recover this category!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {

    if (result.isConfirmed) {

      this.categoryService.deleteCategory(id).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Category deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadCategories();

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to delete category.'
          });

        }

      });

    }

  });

}
}