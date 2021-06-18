import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      email : [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  get emailInvalid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get passwordInvalid() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
    }

  ngOnInit(): void {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.form.get('email')?.setValue(email);
    }
  }

  onSubmit() {
    this.loading = true;
    this.authService.login({...this.form.value})
    .subscribe((resp: any) => {
      localStorage.setItem('jwt', resp['access_token']);
      localStorage.setItem('user_name', resp['user']);
      this.router.navigate (['/']);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      Swal.fire({
        title: 'Credenciales incorrectas!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });

  }

}
