import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  requestInformationNotes: RequestInformationNote[];


  constructor(private authService: AuthService,
    private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private dataExchanger: DataManagerService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.requestInformationNotes = [];
    this.loadMoreNoteRequests();
  }


  loadMoreNoteRequests(event?) {

    const SERVER_URL = `http://192.168.1.103:8000/api/noteRequestInformation/${this.requestInformationNotes.length}`;

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    }

    this.http.get<RequestInformationNote[]>(SERVER_URL, HEADERS).subscribe(response => {
      console.log(response);

      this.requestInformationNotes = this.requestInformationNotes.concat(response);

      if (event) {
        event.target.complete();
      }

    }, error => {
      console.log(error);
    });

    

  }

  navigateToRequestNote(request_id: number, request_state: string) {

    this.dataExchanger.data = request_state;

    this.router.navigate(['verification', request_id], { relativeTo: this.route})
      .then().catch(error => {
        this.dataExchanger = null;
      });
  }



}


interface RequesterInformationNote {
  nationalIdCard?: string;
  lastName?: string;
  firstName?: string;
  profession?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}


interface RequestInformationNote {
  id?: number;
  state?: string;
  sendingDate?: string;
  requesterInformationNote?: RequesterInformationNote;
}