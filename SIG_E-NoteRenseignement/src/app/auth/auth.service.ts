import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _username: string;
  private _role: string;

  private _userId: string;
  static _token: string;
  private _isAuthenticated: boolean;

  constructor(private http: HttpClient, private router: Router) { }

  get username(): string {
    return this._username;
  }

  get userId(): string {
    return this._userId;
  }

  get token(): string {
    return AuthService._token;
  }

  get role(): string {
    return this._role;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set isAuthenticated(isAuthenticated: boolean) {
    this._isAuthenticated = isAuthenticated;
  }

  signUp(username: string, password: string, role: string, agencyKey?: string) {

    this._isAuthenticated = false;

    this.http.post(`http://127.0.0.1:8000/api/register/`, {
        username: username,
        password: password,
        role: role,
        agencyKey: agencyKey
      })
      .subscribe((response: {id: string, username: string, role: string, token: string}) => {
        
        console.log(response);

        this._username = response.username;
        this._userId = response.id;
        this._role = response.role;
        AuthService._token = response.token;

        if (AuthService._token) {

          this._isAuthenticated = true; console.log("You are authorized");

          if (this._role === 'c') {
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

    this._isAuthenticated = false;

    this.http.post(`http://127.0.0.1:8000/auth/`, {
      username: username,
      password: password
    }).subscribe((response: {userId: string, username: string, role: string, token: string}) => {
      
      console.log(response);

      this._userId = response.userId;
      this._username = response.username;
      this._role = role; //must be change to reponse.role
      AuthService._token = response.token;

      if (AuthService._token) {

        this._isAuthenticated = true; console.log("You are authorized");

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

  logout() {
    this._username = null;
    this._userId = null;
    this._role = null;
    AuthService._token = null;
    this._isAuthenticated = false;
    this.router.navigate(['/']);
  }




}
