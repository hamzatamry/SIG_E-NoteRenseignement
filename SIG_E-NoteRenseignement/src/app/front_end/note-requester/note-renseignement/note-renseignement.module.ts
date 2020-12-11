import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteRenseignementPageRoutingModule } from './note-renseignement-routing.module';

import { NoteRenseignementPage } from './note-renseignement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteRenseignementPageRoutingModule
  ],
  declarations: [NoteRenseignementPage]
})
export class NoteRenseignementPageModule {}
