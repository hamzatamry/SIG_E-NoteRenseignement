import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, Form } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  @ViewChild('slides') slides: HTMLIonSlidesElement;
  requestForm: FormGroup;
  selectedFiles: File[] = [null, null, null, null];

  constructor(private http: HttpClient, private authService: AuthService) { 
    
  }

  ngOnInit() {

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

  ionViewWillEnter() {

    this.slides.lockSwipes(true);

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

    const SERVER_URL = "http://127.0.0.1:8000/api/noteRequestInformation/";
    
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

}
