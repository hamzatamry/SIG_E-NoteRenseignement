import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';
import { DataManagerService } from '../data-manager.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

  _username: string;
  _role: string;

  public agencyStaffProfile: AgencyStaffProfile = {};

  departments: string[] = [
    'Administratif et financier',
    'Gestion urbaine',
    'Juridiques et foncières',
    'Etudes',
    'Informatique',
    'Autre'
  ];

  constructor(private authService: AuthService, 
    private http: HttpClient, private menuController: MenuController, private dataManager: DataManagerService) {

  }

  ngOnInit() {
    

    console.log(this.authService.token);
    
    this._username = this.authService.username;
    this._role = this.authService.role;

    const SERVER_URL = SERVER_ADDRESS + `api/agencyProfile/`;

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    } 

    this.http.get(SERVER_URL, HEADERS).subscribe(response => {

      console.log(response);

      this.agencyStaffProfile = response['agencyStaffProfile'];


      this.dataManager.data = this.agencyStaffProfile.firstName + " " + this.agencyStaffProfile.lastName;
      
            
    }, error => {
      console.log(error);
    });
  

  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'profile');
  }

  onSubmit() {

    console.log(this.authService.token);
    console.log(this.agencyStaffProfile); //

    const SERVER_URL = SERVER_ADDRESS + `api/agencyProfile/`;

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

      this.dataManager.data = this.agencyStaffProfile.firstName + " " + this.agencyStaffProfile.lastName;
    }, error => {
      console.log(error);
    })

  }

  logout() {
    console.log("log out");
    this.authService.logout();

  }

}

export interface AgencyStaffProfile
{
  lastName?: string;
  firstName?: string;
  nationalIdCard?: string;
  profession?: string;
  department?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}
