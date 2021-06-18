import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      name      : [ null, Validators.required],
      email     : [ null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)]],
      password  : [ null, [Validators.required, Validators.minLength(8)]],
      password2 : [ null, [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
  }

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }

  get emailInvalid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get passwordInvalid() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }

  get password2Invalid() {
    return this.form.get('password2')?.invalid && this.form.get('password2')?.touched;
  }

  get passwordsInvalids() {
    if (!this.passwordInvalid && !this.password2Invalid) {
      return this.form.value.password !== this.form.value.password2 ? true : false;
    } else {
      return false;
    }

  }

  onSubmit() {
    if (this.form.value.password !== this.form.value.password2) {
      return;
    }
    this.loading = true;
    this.authService.register({...this.form.value})
    .subscribe((resp: any) => {
      localStorage.setItem('user_email', resp['data']['email']);
      this.router.navigate (['/login']);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.authService.obtener_mensajes_error(err);
    });

  }

}
