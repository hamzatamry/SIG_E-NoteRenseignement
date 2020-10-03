import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionMenuPage } from './action-menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'gis'
  },
  {
    path: '',
    component: ActionMenuPage,
    children: [
      {
        path: 'gis',
        loadChildren: () => import('../gis/gis.module').then(m => m.GisPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionMenuPageRoutingModule {}
