import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  constructor(private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.scanQrCode();
  }

  scanQrCode() {

    let options: BarcodeScannerOptions = {
      preferFrontCamera: true
    };


    this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data' + barcodeData.text);
     }).catch(err => {
         alert('Error' + err);
     });
  }

}
