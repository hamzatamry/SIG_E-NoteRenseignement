import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from "esri-loader";

@Component({
  selector: 'app-gis',
  templateUrl: './gis.page.html',
  styleUrls: ['./gis.page.scss'],
})
export class GisPage implements OnInit {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  
  view: any;
  
  map;


  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }

  async initializeMap() {
    try 
    {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView] = await loadModules(["esri/Map", "esri/views/MapView"]);

      // Configure the Map
      const mapProperties = {
        basemap: "topo-vector"
      };

     this.map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-7.616700, 33],
        zoom: 13,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);
  
      await this.view.when(); // wait for map to load

      return this.view;
    } 
    catch (error) 
    {
      console.error("EsriLoader: ", error);
    }

    
  }

}
