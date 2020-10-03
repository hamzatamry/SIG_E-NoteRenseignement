import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActionMenuPageRoutingModule } from './action-menu-routing.module';

import { ActionMenuPage } from './action-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActionMenuPageRoutingModule
  ],
  declarations: [ActionMenuPage]
})
export class ActionMenuPageModule {}
