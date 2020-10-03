import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActionMenuPage } from './action-menu.page';

describe('ActionMenuPage', () => {
  let component: ActionMenuPage;
  let fixture: ComponentFixture<ActionMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
