import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../../models/app.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public loading = false;
  public users: User[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.users = [];
    this.authService.getUsers()
    .subscribe((resp: any) => {
      this.users = resp;
      this.loading = false;
    }, (err) => {
      this.authService.obtener_mensajes_error(err);
      this.loading = false;
    })
  }

  deleteUser(id: any, name: string) {

    Swal.fire({
      title: 'Estas seguro de eliminar el usuario?',
      text: name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.authService.deleteUser(id)
        .subscribe(() => {
          this.loading = false;
          this.getUsers();
          Swal.fire(
            'Eliminado!',
            'El usuario fue eliminado con éxito.',
            'success'
          );
        }, (err) => {
          this.authService.obtener_mensajes_error(err);
          this.loading = false;
        })

      }
    })
  }

}
