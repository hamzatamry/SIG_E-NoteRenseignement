import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { MenuController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  selectedFiles: File[] = [];
  publications: Publication[] = [];

  constructor(private authService: AuthService, 
    private http: HttpClient, private menuController: MenuController) { }

  ngOnInit() {
  
  }

  ionViewWillEnter() {

    this.menuController.enable(true, 'profile');

    const SERVER_URL = "http://127.0.0.1:8000/api/publication/";

    const HEADERS = {
      headers: {
        Authorization: "Token " + this.authService.token
      }
    };

    this.http.get<Publication[]>(SERVER_URL, HEADERS).subscribe(response => {
      console.log(response);

      this.publications = response;

      console.log(this.publications);
    }, error => {
      console.log(error);
    });

  }

  getFileName(filePath: string) {
    
    if (filePath) {
      return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }
      
    return "Ajouter un fichier" ;
  }

  onFileSelected(event) {

    this.selectedFiles.push(event.target.files[0]);

  }

  publish(publishForm: NgForm) {

    console.log(this.authService.token);

    if (!publishForm.valid) {
      return;
    }

    const PUBLICATION = {
      title: publishForm.value.title,
      description: publishForm.value.text,
      date: new Date().toISOString()
    }

    const SERVER_URL = "http://127.0.0.1:8000/api/publication/";


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

    this.http.post(SERVER_URL, formData, HEADERS).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });

    
    console.log(PUBLICATION);
    console.log(this.selectedFiles);
  }

  comment(commentForm: NgForm, publication_id: number) {

    if (!commentForm.valid) {
      return;
    }

    const SERVER_URL = "http://127.0.0.1:8000/api/comment/";

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

    this.http.post(SERVER_URL, BODY, HEADERS).subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error);
    });

    console.log(this.authService.token);
  }

}

interface Publication {
  id?: number;
  title?: string;
  date?: string;
  description?: string;
  agencyStaff: {
    id?: number;
    nationalIdCard?: string;
    lastName?: string;
    firstName?: string;
  };
}
