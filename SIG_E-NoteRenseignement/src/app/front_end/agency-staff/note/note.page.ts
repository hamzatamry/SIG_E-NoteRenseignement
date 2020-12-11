import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';
import { DataManagerService } from '../data-manager.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  requestInformationNotes: RequestInformationVerification[];


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

    
    const SERVER_URL = SERVER_ADDRESS + `api/requestNoteVerification/${this.requestInformationNotes.length}`;

    const HEADERS = new HttpHeaders().set("Authorization", "Token " + this.authService.token);


    this.http.get<RequestInformationVerification[]>(SERVER_URL, { headers: HEADERS })
    .pipe(
      map(response => {

      console.log(response);

      return response['verifications'];

    }))
    .subscribe(mappedResponse => {
      
      this.requestInformationNotes = this.requestInformationNotes.concat(mappedResponse);

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


interface AgencyStaff {
  id?: string;
  lastName?: string;
  firstName?: string;
  department?: string;
}

interface RequestInformationVerification {
  requestInformationNote?: string;
  state?: string;
  verification_date?: string;
  rejection_message?: string;
  agencyStaff?: AgencyStaff;
  
}