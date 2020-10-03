import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GisPage } from './gis.page';

describe('GisPage', () => {
  let component: GisPage;
  let fixture: ComponentFixture<GisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
