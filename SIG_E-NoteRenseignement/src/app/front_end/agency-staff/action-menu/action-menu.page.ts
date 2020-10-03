import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.page.html',
  styleUrls: ['./action-menu.page.scss'],
})
export class ActionMenuPage implements OnInit {

  constructor(private menuController: MenuController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'action');

  }

}
