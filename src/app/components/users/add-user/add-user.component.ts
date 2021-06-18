import { Location } from '@angular/common';
import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: []
})
export class AddUserComponent implements AfterViewInit, OnInit {

  title = 'Agregar';

  @ViewChild('name') name: ElementRef | undefined;
  id: number;
  form: FormGroup;
  public loading = false;

  public profiles: Profile[] = [];

  constructor(private fb: FormBuilder, public location: Location,
    private rest: AuthService, private activatedRoute: ActivatedRoute) {

      this.form = this.fb.group ({
        name       : [ null , Validators.required],
        email      : [ null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)]],
        phone      : [ null ],
        status     : [ null ],
        profile_id : [ null,  Validators.required ],
        password   : [ null, [Validators.required, Validators.minLength(8)]],
        password2  : [ null, [Validators.required, Validators.minLength(8)]]
      });

      this.id = this.activatedRoute.snapshot.params.id;
      if (this.id) {
        this.loading = true;
        this.title = 'Editar';
        this.getUser();
      }
  }

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }

  get emailInvalid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get profileInvalid() {
    return this.form.get('profile_id')?.invalid && this.form.get('profile_id')?.touched;
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

  ngOnInit(): void {
    this.getPerfiles();
  }

  ngAfterViewInit(): void {
    this.name?.nativeElement.focus();
  }

  getPerfiles() {
    this.loading = true;
    this.profiles = [];
    this.rest.getPerfiles()
    .subscribe((resp: any) => {
      this.loading = false;
      this.profiles = resp;
    }, (err) => {
      this.loading = false;
      this.rest.obtener_mensajes_error(err);
    });
  }

  getUser() {
    this.rest.getSingleProfile(this.id)
    .subscribe((resp: any) => {
      this.form.controls['password'].clearValidators();
      this.form.controls['password2'].clearValidators();
      this.form.controls['password'].updateValueAndValidity();
      this.form.controls['password2'].updateValueAndValidity();
      this.form.patchValue({
        name       : resp.name,
        email      : resp.email,
        phone      : resp.phone,
        status     : resp.status,
        profile_id : resp.profile_id
      });
    }, (err) => {
      this.rest.obtener_mensajes_error(err);
    });
  }

  onSubmit() {

    if (this.id) {
      this.onEdit();
      return;
    }

    this.loading = true;
    this.rest.register(this.form.value)
    .subscribe(() => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      this.location.back();
    }, (err) => {
      this.rest.obtener_mensajes_error(err);
      this.loading = false;
    });
  }

  onEdit() {

    this.loading = true;

    const user = {
      name : this.form.value.name,
      email: this.form.value.email,
      profile_id : this.form.value.profile_id,
      phone : this.form.value.phone
    };

    this.rest.editProfile(this.id, user)
    .subscribe(() => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      this.location.back();
    }, (err) => {
      this.rest.obtener_mensajes_error(err);
      this.loading = false;
    });
  }

}
