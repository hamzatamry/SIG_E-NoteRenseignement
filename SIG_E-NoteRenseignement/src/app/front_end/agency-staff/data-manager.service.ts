import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  private _data: any;

  constructor() { }

  get data() {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }

}
