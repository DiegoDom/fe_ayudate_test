import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: []
})
export class AddProfileComponent implements OnInit, AfterViewInit {

  title = 'Agregar';

  @ViewChild('name') name: ElementRef | undefined;
  id: number;
  form: FormGroup;
  public loading = false;

  constructor(private fb: FormBuilder, private router: Router,
    private rest: AuthService, private activatedRoute: ActivatedRoute,
    public location: Location) {
      this.form = this.fb.group ({
        name       : [ null , Validators.required],
        description : [ null,  Validators.maxLength(254) ]
      });

      this.id = this.activatedRoute.snapshot.params.id;
      if (this.id) {
        this.loading = true;
        this.title = 'Editar';
        /* this.cargarProducto(); */
      }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.name?.nativeElement.focus();
  }

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }

  get descInvalid() {
    return this.form.get('description')?.invalid && this.form.get('description')?.touched;
  }

  onSubmit() {
    this.loading = true;
    this.rest.createProfile(this.form.value)
    .subscribe(() => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Perfil registrado con éxito',
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
