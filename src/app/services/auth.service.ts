import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, Profile } from '../models/app.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* private baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apiKEY = 'AIzaSyDo3r9VfBDXCy_aVwNpGj5_S41hF0Fy7RU'; */

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient,  private router: Router) { }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.post(`${ this.baseUrl }/logout`, { }, httpOptions)
    .subscribe(() => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user_name');
      this.router.navigate(['/login']);
    }, (err) => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user_name');
      this.router.navigate(['/login']);
    });
  }

  login(user: User) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${ this.baseUrl }/login`, {...user }, httpOptions);
  }

  register(user: User) {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.post(`${ this.baseUrl }/users`, {...user }, httpOptions);
  }

  getPerfiles() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.get(`${ this.baseUrl }/profiles`, httpOptions);
  }

  createProfile(profile: Profile) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.post(`${ this.baseUrl }/profiles`, {...profile }, httpOptions);
  }

  getUsers() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.get(`${ this.baseUrl }/users`, httpOptions);
  }

  getSingleProfile(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.get(`${ this.baseUrl }/users/${ id }`, httpOptions);
  }

  editProfile(id: number, user: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.post(`${ this.baseUrl }/users/${ id }`, {...user }, httpOptions);
  }

  deleteUser(id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      }),
    };

    return this.http.delete(`${ this.baseUrl }/users/${ id }`, httpOptions);
  }

    /* ERRORES */
  obtener_mensajes_error(err: any) {

      if (err.error.email) {
        Swal.fire({
          title: 'Error!',
          text: 'El email ingresado ya se encuentra registrado',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        Swal.fire({
          title: 'Lo sentimos!',
          text: 'Ocurrio un error inesperado',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }

      if (err.status === 401) {
        Swal.fire({
          title: 'Sesión expirada!',
          text: 'Inicie sesión de nuevo',
          icon: 'error',
          confirmButtonText: `Ok`,
        }).then(() => {
          this.logout();
        });
      }

  }

}
