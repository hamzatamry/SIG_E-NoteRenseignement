import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoteRenseignementPage } from './note-renseignement.page';

describe('NoteRenseignementPage', () => {
  let component: NoteRenseignementPage;
  let fixture: ComponentFixture<NoteRenseignementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteRenseignementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteRenseignementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
