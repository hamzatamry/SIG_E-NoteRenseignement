import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

  agencyStaffProfile: AgencyStaffProfile = {};

  departments: string[];

  constructor(private authService: AuthService, private http: HttpClient) {

  }

  ngOnInit() {

    console.log(this.authService.token);

    const SERVER_URL = `http://127.0.0.1:8000/api/AgencyProfile/`;

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    } 

    this.http.get(SERVER_URL, HEADERS).subscribe(response => {

      this.agencyStaffProfile = response['agencyStaffProfile'] 


      console.log(response);
    }, error => {
      console.log(error);
    });
    
    this.departments = [
      'Administratif et financier',
      'Gestion urbaine',
      'Juridiques et foncières',
      'Etudes',
      'Informatique',
      'Autre'
    ]


  }

  onSubmit() {

    console.log(this.authService.token);
    console.log(this.agencyStaffProfile); //

    const SERVER_URL = `http://127.0.0.1:8000/api/AgencyProfile/`;

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    } 

    const BODY = {
      "agencyStaffProfile": this.agencyStaffProfile
    }

    this.http.post(SERVER_URL, BODY, HEADERS).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })

  }

  logout() {
    console.log("log out");
  }

}

export interface AgencyStaffProfile
{
  username?: string;
  role?: string;
  lastName?: string;
  firstName?: string;
  nationalIdCard?: string;
  profession?: string;
  department?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}
