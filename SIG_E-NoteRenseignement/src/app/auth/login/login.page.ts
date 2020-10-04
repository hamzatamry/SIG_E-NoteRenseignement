import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(authentificationForm: NgForm) {
    
    console.log(authentificationForm.value);

    if (!authentificationForm.valid) {
      return;
    }

    const username = authentificationForm.value.username;
    const password = authentificationForm.value.password;
    const role = authentificationForm.value.role;

    this.authService.login(username, password, role);

    //authentificationForm.reset();

  }

}
