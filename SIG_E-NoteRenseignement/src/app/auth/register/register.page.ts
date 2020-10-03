import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isSenting: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    this.isSenting = false;

  }

  onSubmit(registrationForm: NgForm) {

    this.isSenting = true;

    console.log(registrationForm.value)

    //if the user find a way to enable the button event if the form is not valid
    if (!registrationForm.valid) {
      return;
    }

    //extract from the form the credentials
    const username = registrationForm.value.username;
    const password = registrationForm.value.password;
    const role = registrationForm.value.role;
    const agencyKey = registrationForm.value.agencyKey;

    this.authService.signUp(username, password, role, agencyKey);
    
    registrationForm.reset(); //reset the form

    this.isSenting = false;
  }
  
}
