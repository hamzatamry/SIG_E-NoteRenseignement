import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _id: string;
  private _username: string;
  private _role: string;
  private _token: string;

  constructor(private http: HttpClient, private router: Router, private platform: Platform) { }

  get username(): string {
    return this._username;
  }

  get userId(): string {
    return this._id;
  }

  get token(): string {
    return this._token;
  }

  get role(): string {
    return this._role;
  }

  signUp(username: string, password: string, role: string, agencyKey?: string) {


    const SERVER_URL = SERVER_ADDRESS + "api/register/";
    
    
    const BODY = {
      username: username,
      password: password,
      role: role,
      agencyKey: agencyKey
    };

    this.http.post(SERVER_URL, BODY)
      .subscribe((response: {id: string, username: string, role: string, token: string}) => {
        
        console.log(response);

        this._id = response.id;
        this._username = response.username;
        this._role = response.role;
        this._token = response.token;

        if (this._token) {

          localStorage.setItem("userData", JSON.stringify({
            id: this._id,
            username: this._username,
            role: this._role,
            token: this._token
          }));

          if (this._role === 'nr') {
            this.router.navigate(['/nr']);
          }
          else if (this._role === 'as') {
            this.router.navigate(['/as']);
          }
          
        }

      }, error => {
        console.log(error);
      })
      
  }

  login(username: string, password: string, role: string) {

    const SERVER_URL = SERVER_ADDRESS + "auth/";
    
    const BODY = {
      username: username,
      password: password
    }

    this.http.post(SERVER_URL, BODY)
    .subscribe((response: {id: string, username: string, role: string, token: string}) => {
      
      console.log(response);
    

      this._id = response.id;
      this._username = response.username;
      this._role = role; //must be change to reponse.role
      this._token = response.token;

      if (this._token) {

        console.log("You are authorized");

        localStorage.setItem("userData", JSON.stringify({
            id: this._id,
            username: this._username,
            role: this._role,
            token: this._token
        }));

        if (this._role === 'nr') {
          this.router.navigate(['/nr']);
        }
        else if (this._role === 'as') {
          this.router.navigate(['/as']);
        }

      }
      else {
        console.log("You are not authorized");
      }

    }, error => {
      console.log(error);
    })
  }

  autoLogin() {

    const userData : {
      id: string;
      username: string;
      role: string;
      token: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    if (userData.token) {
      this._id = userData.id;
      this._username = userData.username;
      this._role = userData.role;
      this._token = userData.token;
    }
  }

  logout() {
    
    this._username = null;
    this._id = null;
    this._role = null;
    this._token = null;
    
    localStorage.removeItem("userData");
    this.router.navigate(['/']);
  }




}
