import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GisPage } from '../gis/gis.page';
import { Printer } from '@ionic-native/printer/ngx';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.page.html',
  styleUrls: ['./action-menu.page.scss'],
})
export class ActionMenuPage implements OnInit {

  @ViewChild(GisPage) gisPage: GisPage;

  constructor(private menuController: MenuController) { }

  topRightUI;
  topLeftUI;
  bottomRightUI;
  bottomLeftUI;


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'action');

    this.gisPage = new GisPage();
  }

}
