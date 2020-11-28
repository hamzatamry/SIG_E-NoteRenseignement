import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, Form } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { SERVER_ADDRESS } from 'src/environments/environment.prod';


@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})

export class NotePage implements OnInit {

  @ViewChild('slides') slides: HTMLIonSlidesElement;
  requestForm: FormGroup;
  selectedFiles: any[] = [null, null, null, null];
  noteInformationRequests: RequestInformationNote[] = [];

  constructor(private http: HttpClient, private authService: AuthService, 
    private platform: Platform, private file: File, 
    private opener: FileOpener, private transfer: FileTransfer) { 
    
  }

  ngOnInit() {

    this.setRequestForm();

    const SERVER_URL = SERVER_ADDRESS + `api/noteRequestInformation/`;
    const HEADERS = new HttpHeaders().set('Authorization', 'Token ' + this.authService.token);

    this.http.get<RequestInformationNote[]>(SERVER_URL, { headers: HEADERS}).subscribe(response => {
      console.log(response);

      this.noteInformationRequests = response;

    }, error => {
      console.log(error);
    })

  }

  ionViewWillEnter() {

    this.slides.lockSwipes(true);

  }

  setRequestForm() {
    this.requestForm = new FormGroup({
      "requesterForm": new FormGroup({
        "firstName": new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]),
        "lastName": new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]),
        "nationalIdCard": new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.pattern("[a-zA-Z0-9]+")]),
        "profession": new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.pattern("[a-zA-Z]+")]),
        "email": new FormControl(null, [Validators.required, Validators.maxLength(60), Validators.pattern("[a-zA-Z][a-zA-Z_0-9@.]*")]),
        "phoneNumber": new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]+")]),
        "address": new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(60), Validators.pattern("[a-zA-Z][a-zA-Z0-9\s]*")])
      }),
      "fieldForm": new FormGroup({
        "groundInformationSector": new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        "municipality": new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        "field": new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        "landTitleNumber": new FormControl(null, [Validators.maxLength(50)]),
        "requisitionNumber": new FormControl(null, [Validators.maxLength(50)]),
        "calledProperty": new FormControl(null, [Validators.maxLength(50)])
      }),
      "documentForm": new FormGroup({
        "RequestInformationNote": new FormControl(null, [Validators.required]),
        "ownershipCertificate": new FormControl(null, [Validators.required]),
        "cadatralMap": new FormControl(null, [Validators.required]),
        "nationalIdCard": new FormControl(null, [Validators.required])
      }),
      "capacityCalculationForm": new FormArray([
        new FormGroup({
          "x": new FormControl(null, [Validators.required, Validators.maxLength(7)]),
          "y": new FormControl(null, [Validators.required, Validators.maxLength(7)]),
          "bound": new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.pattern("[a-zA-Z][0-9]+")]),
          "reference": new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("[a-zA-Z][0-9]+")])
        })
      ])
    });
  }

  trapTabKey(event) {

    if (event.keyCode == '9') {
      event.preventDefault();
    }

    
  }


  slideNextOrPrevious(param: boolean) {
    
    this.slides.lockSwipes(false);

    param ? this.slides.slideNext(): this.slides.slidePrev();
    
    this.slides.lockSwipes(true);

  }

  addLineToTable(){

    const capacityCalculationtuple = new FormGroup({
      "x": new FormControl(null, [Validators.required, Validators.maxLength(7)]),
      "y": new FormControl(null, [Validators.required, Validators.maxLength(7)]),
      "bound": new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.pattern("[A-Z][0-9]+")]),
      "reference": new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("[A-Z][0-9]+")])
    });

    const formArray: FormArray = (<FormArray>this.requestForm.get('capacityCalculationForm'));
    
    if (formArray.length < 10) {

      formArray.push(capacityCalculationtuple);
    }
  }

  deleteLineFromTable() {

    const formArray: FormArray = (<FormArray>this.requestForm.get('capacityCalculationForm'));

    if (formArray.length >= 2) {
      formArray.removeAt(formArray.length - 1); // removing the last element
    } 
  }

  getFileName(filePath: string) {
    
    if (filePath) {
      return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }
      
    return "Ajouter un fichier" ;
  }

  onFileSelected(event, index) {

    this.selectedFiles[index] = event.target.files[0];

    console.log(this.selectedFiles);
  }

  upload() {

    console.log("Token " + this.authService.token)
    console.log(this.requestForm.value);

    if (!this.requestForm.valid) {
      return;
    }

    const fileNames = ["requestInformationNote", "ownershipCertificate", "cadatralMap", "nationalIdCard"];
    
    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append(fileNames[i], this.selectedFiles[i], this.selectedFiles[i].name);
    }

    if ("documentForm" in this.requestForm.value) {
      delete this.requestForm.value.documentForm;
    }

  
    formData.append('data', JSON.stringify(this.requestForm.value));

    const SERVER_URL = "http://192.168.1.103:8000/api/noteRequestInformation/";
    
    const headers = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    }

    this.http.post(SERVER_URL, formData, headers)
    .subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
    

  }

  downloadFile(file_id: number, file_name: string) {

    console.log("waiting to download file" + "id = " + file_id);

    if (this.platform.is("android") || this.platform.is("ios")) {

      this.downloadFileFromMobile(file_id, file_name);
    }
    else {
      this.downloadFileFromBrowser(file_id);
    }

  }
    
  downloadFileFromMobile(file_id: number, file_name: string) {

    const SERVER_URL = `http://192.168.1.103:8000/api/informationNote/${file_id}/`;

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

  downloadFileFromBrowser(file_id: number) {

    const SERVER_URL = `http://192.168.1.103:8000/api/informationNote/${file_id}/`;

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


interface RequestInformationNote {
  id?: number;
  state?: string;
  sendingDate?: string;
}