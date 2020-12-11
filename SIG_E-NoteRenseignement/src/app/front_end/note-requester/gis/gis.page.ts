import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from "esri-loader";

@Component({
  selector: 'app-gis',
  templateUrl: './gis.page.html',
  styleUrls: ['./gis.page.scss'],
})
export class GisPage implements OnInit {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  
  static view: any;
  
  static map: any;

  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }


  async initializeMap() {

    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, Locate, ScaleBar] = await loadModules([
        "esri/Map", 
        "esri/views/MapView", 
        "esri/widgets/Locate",
        "esri/widgets/ScaleBar"
      ]);

      // Configure the Map
      const mapProperties = {
        basemap: "streets-navigation-vector"
      };

      GisPage.map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-7.616700, 33],
        zoom: 13,
        map: GisPage.map
      };

      GisPage.view = new MapView(mapViewProperties);

      await GisPage.view.when(); // wait for map to load

      let locate = new Locate({
        view: GisPage.view,
        useHeadingEnabled: false,
        goToOverride: function (view, options) {
          options.target.scale = 1500; // Override the default map scale
          return view.goTo(options.target);
        }
      });
      
      GisPage.view.ui.add(locate, "top-left");

      let scaleBar = new ScaleBar({
        view: GisPage.view
      });
      // Add widget to the bottom left corner of the view
      GisPage.view.ui.add(scaleBar, {
        position: "bottom-right"
      });
    
      return GisPage.view;
    } 
    catch (error) {
      console.error("EsriLoader: ", error);
    }
  
  }
  
  async changeScale() {



    
  }

  async search() {

    const [Search] = await loadModules(["esri/widgets/Search"])

    let search = new Search({
      view: GisPage.view
    });
      
    GisPage.view.ui.add(search, "top-right");
  }

  remove() {

    console.log(GisPage.view);
    
  }

  async drawPoint() {
    
  }

  async print() {
    const [Print] = await loadModules(["esri/widgets/Print"]);

    let print = new Print({
      view: GisPage.view,
      // specify your own print service
      printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });

    // Add widget to the top right corner of the view
    GisPage.view.ui.add(print, "top-right");
  };



  ngOnDestroy() {

    if (GisPage.view) {
      // destroy the map view
      GisPage.view.container = null;
    }
  }

}
