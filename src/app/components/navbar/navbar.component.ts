import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: ['.navbar { padding: 10px 100px; }']
})
export class NavbarComponent implements OnInit {

  public userName = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user_name');
    user ? this.userName = user : this.userName = 'Guest';
  }

}
