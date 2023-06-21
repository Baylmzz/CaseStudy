import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
  users: Observable<UserModel[]>;
  constructor(
    private _userservice: UserService,
    private toastr: ToastrService
    ) {}
  ngOnInit(): void {
    this.users = this._userservice.users$;
  }

  edit(user: UserModel) {
    this._userservice.changeUser(user);
    this._userservice.changeIsEditing(true);
  }

  delete(id?: string) {
    if (id) {
      this._userservice
        .deleteUser(id)
        .then(() => {
          this.toastr.success('Kullanıcı başarıyla silindi', 'İşlem Başarılı');
        })
        .catch((error) => {
          this.toastr.error('Kullanıcı silme işlemi başarısız', 'İşlem Başarısız');
        });
    } else {
      this.toastr.warning('Kullanıcı silme işlemi başarısız', 'İşlem Başarısız');
    }
  }
}
