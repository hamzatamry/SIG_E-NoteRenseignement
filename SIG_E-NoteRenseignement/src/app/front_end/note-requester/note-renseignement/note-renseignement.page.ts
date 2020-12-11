import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-note-renseignement',
  templateUrl: './note-renseignement.page.html',
  styleUrls: ['./note-renseignement.page.scss'],
})
export class NoteRenseignementPage implements OnInit {

  request_id: number;
  informationNote: informationNote = {};

  constructor(private authService: AuthService, private platform: Platform, private file: File,
    private opener: FileOpener, private transfer: FileTransfer,
    private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.route.params.subscribe(param => {

      this.request_id = param['id'];
    });


    const SERVER_URL = SERVER_ADDRESS + `api/informationNote/${this.request_id}`;
    const HEADERS = new HttpHeaders().set('Authorization', "Token " + this.authService.token);

    this.http.get(SERVER_URL, { headers: HEADERS })
    .pipe(map(response => {
      return response['note'];
    }))
    .subscribe(mappedResponse => {
      console.log(mappedResponse);

      this.informationNote = mappedResponse;

    }, error => {
      console.log(error);
    })

  }

  downloadFile() {

    console.log("waiting to download file" + "id = " + this.informationNote.id);

    if (this.platform.is("android") || this.platform.is("ios")) {

      this.downloadFileFromMobile();
    }
    else {
      this.downloadFileFromBrowser();
    }

  }
    
  downloadFileFromMobile() {

    const SERVER_URL = SERVER_ADDRESS + `api/informationNoteFile/${this.informationNote.id}/`;

    let path = null;

    if (this.platform.is("ios")) {
      path = this.file.documentsDirectory;
    }
    else {
      path = this.file.dataDirectory;
    }

    this.file.checkFile(path, this.informationNote.document).then(found => {

      const url = path + this.informationNote.document;

      this.opener.open(url, 'application/pdf').then(() => console.log('File is opened')).catch(e => console.log());

    }).catch(error => {
      
      const transfer = this.transfer.create();

      const options = {
        headers: { 'Authorization': 'Token ' + this.authService.token },
      }

      transfer.download(SERVER_URL, path + this.informationNote.document, true, options)
      .then(entry => {
        
        const url = entry.toURL();

        this.opener.open(url, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => alert('error2'))

      }).catch(error => {
        console.log(error);
        })
      })
  }

  downloadFileFromBrowser() {

    const SERVER_URL = SERVER_ADDRESS + `api/informationNoteFile/${this.informationNote.id}/`;

    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

  
    this.http.get(SERVER_URL, { headers: HEADERS, responseType: 'blob'}).subscribe(response => {
      
      console.log(response);

      const blob = new Blob([response], {type: 'application/pdf'});

      const downloadURL = window.URL.createObjectURL(blob);

      window.open(downloadURL);

    }, error => {
      console.log(error);
    });

  }
}


interface informationNote {
  id?: string;
  document?: string;
  date?: string;
}