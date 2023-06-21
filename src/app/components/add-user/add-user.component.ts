import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  userModel: UserModel;
  isEditing: boolean;

  constructor(
    private _userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this._userService.currentIsEditing.subscribe(isEditing => this.isEditing = isEditing);
    this._userService.currentUser.subscribe((user:UserModel) => {
      if (user) {
        this.userForm.patchValue({
          email: user.email,
          name: user.name,
          surname: user.surname,
          id: user.id
        });
      } else {
        this.loadForm();
      }
    });
  }

  loadForm() {
    this.userForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.compose([Validators.required])],
      surname: ['', Validators.compose([Validators.required])],
      id: [null]
    });
    this._userService.changeIsEditing(false);
  }

  submitForm() {
    this.userForm.markAllAsTouched()
    if (this.userForm.invalid) {
      this.toastr.warning('Formu tekrar kontrol edin', 'İşlem Başarısız')
      return 
    }
    const formValue = this.userForm.value;
    this.userModel = {
      email: formValue.email,
      name: formValue.name,
      surname: formValue.surname,
    };
    if (this.isEditing) {
      this._userService
      .updateUser(this.userModel, formValue.id)
      .then(() => {
        this.toastr.success('Kullanıcı başarıyla güncellendi', 'İşlem Başarılı');
        this.loadForm();
      })
      .catch((error) => {
        this.toastr.error('Kullanıcı güncelleme işlemi başarısız', 'İşlem Başarısız');
      });
    }
    else {
      this._userService
      .addUser(this.userModel)
      .then(() => {
        this.toastr.success('Kullanıcı başarıyla eklendi', 'İşlem Başarılı');
        this.loadForm();
      })
      .catch((error) => {
        this.toastr.error('Kullanıcı ekleme işlemi başarısız', 'İşlem Başarısız');
      });
    }
  }
}
