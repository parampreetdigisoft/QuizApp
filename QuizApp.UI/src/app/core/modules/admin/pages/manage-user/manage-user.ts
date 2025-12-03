import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../shared/services/user-service';
import { UserDetailModel } from '../../../auth/models/auth-model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.css',
})
export class ManageUser implements OnInit {

  userList: UserDetailModel[] = [];
  userForm!: FormGroup;
  bootstrap: any;
  constructor(private _userService: UserService, private _fb: FormBuilder

  ) {
    this.resetForm('', '', '', 0);
  }
  ngOnInit(): void {
    this.loadUsers()
  }

  resetForm(username: string, email: string, role: string, id: number) {
    this.userForm = this._fb.group({
      username: [username, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [email, [Validators.required, Validators.email]],
      role: [role, [Validators.required]],
      password: ["", [Validators.required]],
      id: [id]
    })
  }

  loadUsers() {
    this._userService.getAll().subscribe({
      next: (res: UserDetailModel[]) => {
        this.userList = res;
      },
      error: (err) => {

      },
      complete: () => {

      }
    })
  }
  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      var user = this.userList.find(c => c.userId == userId);
      if (!user)
        alert("No record found");
      else {
        this._userService.delete(userId).subscribe({
          next: (res: any) => {
            alert(res.message);
            this.loadUsers();
          },
          error: (err) => {

          }, complete: () => {

          }
        })
      }
    }
  }
  editUser(userId: number) {
    var user = this.userList.find(c => c.userId == userId);
    if (!user)
      alert("No record found");
    else {
      this.resetForm(user.userName, user.email, user.role, user.userId)
    }
  }

  createOrUpdate() {
    if (this.userForm.valid) {
      this._userService.createOrUpdate({
        email: this.userForm.value.email,
        id: this.userForm.value.id,
        password: this.userForm.value.password,
        role: this.userForm.value.role,
        username: this.userForm.value.username,
        confirmPassword: this.userForm.value.password
      }).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadUsers();
        },
        error: (err) => {

        }, complete: () => {

        }
      })
    }
  }
}
