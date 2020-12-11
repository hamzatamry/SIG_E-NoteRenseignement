import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotePage } from './note.page';

const routes: Routes = [
  {
    path: '',
    component: NotePage,
  },
  {
    path: 'note_renseignement/:id',
    loadChildren: () => import("../note-renseignement/note-renseignement.module")
    .then(m => m.NoteRenseignementPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotePageRoutingModule {}
