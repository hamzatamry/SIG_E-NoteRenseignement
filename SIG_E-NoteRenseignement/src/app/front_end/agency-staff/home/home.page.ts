import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  getFileName(filePath: string) {
    
    if (filePath) {
      return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }
      
    return "Ajouter un fichier" ;
  }

  publish(publishForm: HTMLFormElement) {

    let formSubmitted = {
      title: publishForm.value.title,
      text: publishForm.value.text,
      file: publishForm.value.file,
      date: new Date().toISOString()
    }



  }

  comment(commentForm: HTMLFormElement) {

    console.log(commentForm.value);
  }

  




}
