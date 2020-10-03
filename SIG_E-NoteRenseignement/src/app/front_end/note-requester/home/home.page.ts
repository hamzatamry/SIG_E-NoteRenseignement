import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slides') slides: HTMLIonSlidesElement;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.slides.startAutoplay().then();
  }

}
