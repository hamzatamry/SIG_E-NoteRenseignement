import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {


  constructor() { }

  ngOnInit() {
  }

  onSubmit(authentificationForm: HTMLFormElement) {
    
    console.log(authentificationForm.value)

    // http request post




  }

}
