import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'side-menu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabBarPage,
    children: [
      {
        path: 'side-menu',
        loadChildren: () => import('../side-menu/side-menu.module').then(m => m.SideMenuPageModule)
      },
      {
        path: 'note',
        loadChildren: () => import('../note/note.module').then(m => m.NotePageModule)
      },
      {
        path: 'action-menu',
        loadChildren: () => import('../action-menu/action-menu.module').then(m => m.ActionMenuPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}
