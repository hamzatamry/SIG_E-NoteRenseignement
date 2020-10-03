import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {


  constructor(private menuController: MenuController, public authService: AuthService) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'side');
  }

  logout() {
    this.authService.logout();
  }

}
