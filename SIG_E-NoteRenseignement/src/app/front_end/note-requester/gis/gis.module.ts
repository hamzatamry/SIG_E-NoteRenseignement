import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GisPageRoutingModule } from './gis-routing.module';

import { GisPage } from './gis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GisPageRoutingModule
  ],
  declarations: [GisPage]
})
export class GisPageModule {}
