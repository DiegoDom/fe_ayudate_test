import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      old_password: [null, [Validators.required, Validators.minLength(8)]],
      new_password: [null, [Validators.required, Validators.minLength(8)]],
      confirm_password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  get oldpasswordInvalid() {
    return this.form.get('old_password')?.invalid && this.form.get('old_password')?.touched;
  }

  get newpasswordInvalid() {
    return this.form.get('new_password')?.invalid && this.form.get('new_password')?.touched;
  }

  get confirmpasswordInvalid() {
    return this.form.get('confirm_password')?.invalid && this.form.get('confirm_password')?.touched;
  }

  get passwordsInvalids() {
    if (!this.newpasswordInvalid && !this.confirmpasswordInvalid) {
      return this.form.value.new_password !== this.form.value.confirm_password ? true : false;
    } else {
      return false;
    }

  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.value.password !== this.form.value.password2) {
      return;
    }
    this.loading = true;
    this.authService.changePassword({...this.form.value})
    .subscribe((resp: any) => {
      this.loading = false;
      this.form.reset();
      Swal.fire(
        'Contraseña actualizada con éxito!',
        'success'
      );
    }, (err) => {
      this.loading = false;
      let $msj = err.error.message ?  err.error.message : 'Ocurrio un error inesperado';
      Swal.fire({
        title: 'Lo sentimos!',
        text: $msj,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });

  }

}
