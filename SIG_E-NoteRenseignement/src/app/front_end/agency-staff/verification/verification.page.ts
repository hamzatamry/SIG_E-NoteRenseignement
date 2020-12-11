import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NgForm } from '@angular/forms';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  requestDetail: RequestInformationNoteDetail = {};
  request: { id?: number; state?: string; } = {};
  informationNote: any;

  docDefinition: any = {
    content: [
      { text: "Vous n'étes pas authorisé à imprimer le contenu de la note", style: 'header' },
      { text: "Veuillez valider la note premièrement", style: 'subheader'},
    ]
  };

  pdfObj = null;

  constructor(private authService: AuthService, private route: ActivatedRoute,
    private http: HttpClient, private platform: Platform, 
    private file: File, private transfer: FileTransfer, 
    private opener: FileOpener) { 

    }

  ngOnInit() {

    this.route.params.subscribe(observer => {
      
      this.request.id = observer['note_id'];

      const SERVER_URL = SERVER_ADDRESS + `api/noteRequestInformationDetail/${this.request.id}`;
      
      const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

      this.http.get(SERVER_URL, { headers: HEADERS }).subscribe(response => {
        
        console.log(response);

        this.requestDetail = response;

        this.route.queryParams.subscribe(observer => {
        
          this.request.state = observer['state'];

        }, error => {
          console.log(error);
        })

      }, error => {
        console.log(error);
      })

    });
  }


  downloadFile(index: number, file_name?: string) {

    let queryParamValue = null;

    switch (index) {
      case 0: queryParamValue = 'rin'; break;
      case 1: queryParamValue = 'oc'; break;
      case 2: queryParamValue = 'cm'; break;
      case 3: queryParamValue = 'nid'; break;
      default: break;
    }

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.downloadFileFromMobile(queryParamValue, file_name);
    }
    else {
      this.downloadFileFromBrowser(queryParamValue);
    }

  }

  downloadFileFromBrowser(queryParamValue: string) {

    const SERVER_URL =  SERVER_ADDRESS + `api/requestFile/${this.request.id}/`;

    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token)
    const HTTPPARAMS = new HttpParams().set('file_type', queryParamValue);
  
    this.http.get(SERVER_URL, { headers: HEADERS, responseType: 'blob', params: HTTPPARAMS}).subscribe(response => {
      
      console.log(response);

      const blob = new Blob([response], {type: 'application/pdf'});

      const downloadURL = window.URL.createObjectURL(blob);

      window.open(downloadURL);

    }, error => {
      console.log(error);
    });

  }

  downloadFileFromMobile(queryParamValue: string, file_name: string) {

    const SERVER_URL = SERVER_ADDRESS + `api/requestFile/${this.request.id}/?file_type=${queryParamValue}`;

    let path = null;

    if (this.platform.is("ios")) {
      path = this.file.documentsDirectory;
    }
    else {
      path = this.file.dataDirectory;
    }

    this.file.checkFile(path, file_name).then(found => {

      const url = path + file_name;

      this.opener.open(url, 'application/pdf').then(() => console.log('File is opened')).catch(e => console.log());

    }).catch(error => {
      
      const transfer = this.transfer.create();

      const options = {
        headers: { 'Authorization': 'Token ' + this.authService.token },
      }

      transfer.download(SERVER_URL, path + file_name, true, options)
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

  getFileName(filePath: string) {
    
    if (filePath) {
      return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }
      
    return "Ajouter un fichier" ;
  }

  onFileSelected(event) {

    this.informationNote = event.target.files[0];

    console.log(this.informationNote);
  }

  createPdf() { 
    this.pdfObj = pdfMake.createPdf(this.docDefinition);
  }

  printPdf(verificationForm: NgForm) {

    console.log(verificationForm.value);

    if (!verificationForm.valid) {
      return ;
    }

    const SERVER_URL = SERVER_ADDRESS + `api/informationNote/${this.request.id}/`;

    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

    this.http.put(SERVER_URL, { state: this.request.state, validation_key: verificationForm.value.validation_key}, { headers: HEADERS})
    .subscribe((response: { message: string; state: string }) => {

      console.log(response);

      this.docDefinition = {
        
      }

      this.createPdf();

      if (this.platform.is('android') || this.platform.is('ios') ) {
        this.pdfObj.getBuffer((buffer) => {

          var ut8 = new Uint8Array(buffer);
          var binaryArray = ut8.buffer;

          var blob = new Blob([binaryArray], { type: 'application/pdf' });
  
          // Save the PDF to the data Directory of our App
          this.file.writeFile(this.file.dataDirectory, 'NoteRenseignement.pdf', blob, { replace: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.opener.open(this.file.dataDirectory + 'NoteRenseignement.pdf', 'application/pdf');
          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }

        }, error => {
          console.log(error);
      });

    
  }

  save(verificationForm: NgForm) {

    console.log(verificationForm.value);

    if (!verificationForm.valid) {
      return ;
    }

    const SERVER_URL = SERVER_ADDRESS + `api/requestNoteVerification/${this.request.id}/`;

    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

    this.http.put(SERVER_URL, verificationForm.value, { headers: HEADERS})
    .subscribe((response: { message: string; state: string }) => {
      console.log(response);
      }, error => {
        console.log(error);
    })

    
  }

  sendInformationNote(informationNoteForm: NgForm) {

    console.log(informationNoteForm.value);
    
    if (!informationNoteForm.valid) {
      return;
    }

    const SERVER_URL = SERVER_ADDRESS + "api/informationNote/";
    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

    console.log(this.informationNote);

    let formData = new FormData();
    
    formData.append('noteInformationRequester', this.requestDetail.requesterInformationNote.id);
    formData.append('document', this.informationNote);
    formData.append('upload_key', JSON.stringify(informationNoteForm.value.upload_key));
  
  
    
    this.http.post(SERVER_URL, formData, { headers: HEADERS})
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });
    

  }




}


interface RequesterInformationNote {
  id?: string;
  nationalIdCard?: string;
  lastName?: string;
  firstName?: string;
  profession?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

interface RequestInformationNoteDetail {
  requesterInformationNote?: RequesterInformationNote;
  groundInformationSector?: string;
  municipality?: string;
  landTitleNumber?: number;
  requisitionNumber?: number;
  calledProperty?: string;
  requestInformationNote?: string;
  ownershipCertificate?: string;
  cadatralMap?: string;
  nationalIdCard?: string;
}