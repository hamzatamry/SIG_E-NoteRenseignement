import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { MenuController, Platform } from '@ionic/angular';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ActivatedRoute, Event } from '@angular/router';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  selectedFiles: any[] = [];
  publications: Publication[] = [];

  addPublication: boolean = false;

  constructor(private authService: AuthService, 
    private http: HttpClient, 
    private menuController: MenuController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private opener: FileOpener,
    public dataManager: DataManagerService) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {

    this.menuController.enable(true, 'profile');

    this.loadPublications();

  }

  loadPublications(event?) {

    const SERVER_URL = `http://192.168.1.103:8000/api/publication/${this.publications.length}`;

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    };

    this.http.get<Publication[]>(SERVER_URL, HEADERS).subscribe(response => {

      console.log(response);
      
      this.publications = this.publications.concat(response);

      console.log(this.publications);

      if (event) {
        event.target.complete();
      }

    }, error => {
      console.log(error);
    });
  }

  loadMore(event) {

    this.loadPublications(event);

  }

  getFileName(filePath: string) {
    
    if (filePath) {
      return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }
      
    return "Ajouter un fichier" ;
  }

  onFileSelected(event) {

    console.log(event);

    if (event.target.files[0]) {
      this.selectedFiles.push(event.target.files[0]);
      console.log(this.selectedFiles);
    }
    
  }

  deleteSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
    console.log(this.selectedFiles);
  }

  publish(publishForm: NgForm) {

    console.log(this.authService.token);

    if (!publishForm.valid) {
      return;
    }

    const PUBLICATION = {
      title: publishForm.value.title,
      date: new Date().toISOString(),
      description: publishForm.value.text,
    }

    const SERVER_URL = "http://192.168.1.103:8000/api/publication/";


    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    };

    let formData = new FormData();

    for (let index in this.selectedFiles) {
      formData.append("file" + index, this.selectedFiles[index]);
    }

    formData.append("publication", JSON.stringify(PUBLICATION));

    this.http.post<Publication>(SERVER_URL, formData, HEADERS).subscribe(response => {
      
      console.log(response);
    
      this.publications.unshift(response); // add the new publication to the begining of the array

    }, error => {
      console.log(error);
    });

    this.selectedFiles = [];
    publishForm.reset();  
  
  }

  comment(event, commentForm: NgForm, publication_id: number) {

    console.log(commentForm.valid);

    if (!commentForm.valid) {
      //commentForm.reset();
      return;
    }

    console.log(this.authService.token);

    if (event.keyCode == '13') {
      const SERVER_URL = "http://192.168.1.103:8000/api/comment/";

      const HEADERS = {
        headers: {
          Authorization: "Token " + this.authService.token
        }
      };

      const BODY = {
        id: publication_id,
        message: commentForm.value.message
      };

      console.log(BODY);

      this.http.post<Comment>(SERVER_URL, BODY, HEADERS).subscribe(response => {
        
        console.log(response);

        const publication_index = this.publications.findIndex(element => element.id == publication_id); // retrieve the publication index 

        this.publications[publication_index].comments.push(response); // add the new comment at the back ot the comments

        commentForm.reset();

      }, error => {
        console.log(error);
      });

    }

    
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

    const SERVER_URL = `http://192.168.1.103:8000/api/publishedFile/${file_id}/`;

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

    const SERVER_URL = `http://192.168.1.103:8000/api/publishedFile/${file_id}/`;

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

  openSideMenu() {
    this.menuController.open("profile");
  }



}

interface AgencyStaff {
  id?: number;
  lastName?: string;
  firstName?: string;
  department?: string;
}

interface Comment {
  id?: number;
  date?: string;
  message?: string;
  agencyStaff?: AgencyStaff
}


interface Publication {
  id?: number;
  title?: string;
  date?: string;
  description?: string;
  agencyStaff?: AgencyStaff
  comments?: Comment[];
  files: { id: number; file: string; }[]
}
