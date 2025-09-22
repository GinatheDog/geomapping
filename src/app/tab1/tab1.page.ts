import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';



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
  

  constructor() {}

  // used to select map area, set location, and zoom level
  loadMapArea(){
    this.mapArea = [
      { name: "Calgary", zoom: 5, lat: 50.9, lng: -114.05 },
      { name: "Red Deer", zoom: 9, lat: 52.2, lng: -113.8 },
      { name: "Edmonton", zoom: 7, lat: 53.5, lng: -113.4 }
    ];
  }

  async setUpMap( data: { lat: number; lng: number; }, zoom: any ) { // id="map"
    const apiKey = 'YOUR_API_KEY_HERE'; // should be moved to secure location in production
    this.newMap = await GoogleMap.create({
      id: 'view-map', // Unique identifier for this map instance
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: apiKey, // Your Google Maps API Key
      config: {
        center: data,
        zoom: zoom,
      }, 
    });
  }

    async setMarkerOnMap(data: any) { 
    const marker: Marker =  { coordinate: data.coordinate };
    await this.newMap.addMarker(marker);
  }

  

}
