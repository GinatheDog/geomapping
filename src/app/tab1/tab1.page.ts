// Angular
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, Marker, MapType } from '@capacitor/google-maps';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  @ViewChild('map')
  newMap!: GoogleMap;
  mapRef!: ElementRef<HTMLElement>;
  mapArea: any;
  
  constructor( private httpClient: HttpClient ) {}

  // used to select map area, set location, and zoom level
  loadMapArea(){
    this.mapArea = [
      { name: "Calgary", zoom: 5, lat: 50.9, lng: -114.05 },
      { name: "Red Deer", zoom: 9, lat: 52.2, lng: -113.8 },
      { name: "Edmonton", zoom: 7, lat: 53.5, lng: -113.4 }
    ];
  }
  // set map after loadMapArea() is selected
  async setUpMap( data: { lat: number; lng: number; }, zoom: any ) { // id="map"
    const apiKey = 'YOUR_API_KEY_HERE'; // should be moved to secure location in production
    this.newMap.setMapType(MapType.Hybrid);
    /* Optional */
    this.newMap.enableTrafficLayer(true );
    this.newMap.enableCurrentLocation(true);
    this.newMap.enableAccessibilityElements(true); // does not work on web pages 
    this.newMap.enableIndoorMaps( true ); // does not work on web pages
    this.listenMapClick();
    const polygons = [
      {  
        paths: [
          { lat: 51.01076960345936, lng: -114.12650891002833 }, //NE
          { lat: 51.01084201203395, lng: -114.12598392402546 }, 
          { lat: 51.01026383418049, lng: -114.12569158172244 }, 
          { lat: 51.0101484700815, lng: -114.1262440982999} //SW
        ],
        customPolygonId: 'unique_polygon_123',
        strokeColor: '#009900',
        strokeWeight: 2,
        fillColor: '#00ff00',
        fillOpacity: 0.10,
        geodesic: true,
        draggable: true,
        id : 123,
        tag: 'Info tags on polygon are passed to event when clicked  You can also add function(s) on these tags'
      },
      {  
        paths: [
          { lat: 51.010787165732005, lng: -114.12397763168232 }, //NE
          { lat: 51.01087491961919, lng: -114.12348410522358 }, 
          { lat: 51.0102808900637, lng: -114.12315151130574 }, 
          { lat: 51.010213386223725, lng: -114.12364503776448 } //SW
        ],
        customPolygonId: 'unique_polygon_145',
        strokeColor: '#041054ff',
        strokeWeight: 2,
        fillColor: '#1362b2ff',
        fillOpacity: 0.25,
        geodesic: true,
        draggable: true,
        id : 124,
        tag: 'Info tags on polygon are passed to event when clicked  You can also add function(s) on these tags'
     }
    ];
    await this.newMap.addPolygons(polygons);
  }

  async listenMapClick() {
    this.newMap.setOnMapClickListener( async (event: any) => { console.log("event",event)});
    this.newMap.setOnMarkerClickListener( async (event: any) => { console.log("event marker", event) }); 
    this.newMap.setOnPolygonClickListener( async (event: any) => { console.log("event Polygon", event) });
    this.newMap.setOnPolylineClickListener( async (event: any) => { console.log("event Polyline", event) });
  }

  // Add a marker to the map
  async setMarkerOnMap(data: any) { 
    const marker: Marker =  { coordinate: data.coordinate };
    await this.newMap.addMarker(marker);
  }

  // Move the map programmatically
  async goToNewMapLocation() {
    await this.newMap.setCamera({
      coordinate: {
        lat: 33.6,
        lng: -117.9
      }
    });
  }

  // Enable marker clustering
  async addMarkerCulster() {
    await this.newMap.enableClustering();
  }

  // Handle marker click
  async clickOnMarker(event: any) {
    await this.newMap.setOnMarkerClickListener((event) => {});
  }

  // Clean up map reference
  async cleanMap() {
    await this.newMap.destroy();
  }

  getLocationFromAddress() {
    const mapkey = "AIzaSyAJrxacXXXXXXXXXXXX" // Your map key here
    let address = "4838 Richard Rd SW Calgary, AB"
    let apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",&key="+mapkey
    this.httpClient.get( apiUrl ).subscribe({
      next: (result: any ) => { console.log("result", result) },
      error: (error) => { console.log("error",error) },
    });
  // Alternative Address form Lat Long  https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
  }

  determineGeoFenceDistance() {
    /*
      Haversine:  a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
      formula:
      c = 2 ⋅ atan2( √a, √(1−a) )
      d = R ⋅ c
      where:	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
      note that angles need to be in radians to pass to trig functions!
    */
    let lat1 = 51.010787165732005, lon1 = -114.12397763168232;
    let lat2 = 51.01087491961919, lon2 = -114.12348410522358;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // in metres
    console.log("distance in metres",d) // 35.879888590465484 metres
  }
}









