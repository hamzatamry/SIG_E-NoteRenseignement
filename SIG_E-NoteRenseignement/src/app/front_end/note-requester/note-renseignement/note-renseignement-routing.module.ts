import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteRenseignementPage } from './note-renseignement.page';

const routes: Routes = [
  {
    path: '',
    component: NoteRenseignementPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteRenseignementPageRoutingModule {}
