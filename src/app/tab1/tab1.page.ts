// Angular
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
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

  // Add a marker to the map
  async setMarkerOnMap(data: any) { 
    const marker: Marker =  { coordinate: data.coordinate };
    await this.newMap.addMarker(marker);
  }

  // Move the map programmatically
  // setCamera(config: CameraConfig) => Promise<void>
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
}


// getMapType() => Promise<MapType>
// setMapType(mapType: MapType) => Promise<void>

/* 

Javascript

<capacitor-google-map id="map"></capacitor-google-map>
<button onclick="createMap()">Create Map</button>

<style>
  capacitor-google-map {
    display: inline-block;
    width: 275px;
    height: 400px;
  }
</style>

<script>
  import { GoogleMap } from '@capacitor/google-maps';

  const createMap = async () => {
    const mapRef = document.getElementById('map');

    const newMap = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: mapRef, // reference to the capacitor-google-map element
      apiKey: 'YOUR_API_KEY_HERE', // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8, // The initial zoom level to be rendered by the map
      },
    });
  };
</script>

React

import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';

const MyMap: React.FC = () => {
  const mapRef = useRef<HTMLElement>();
  let newMap: GoogleMap;

  async function createMap() {
    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: process.env.REACT_APP_YOUR_API_KEY_HERE,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8
      }
    })
  }

  return (
    <div className="component-wrapper">
      <capacitor-google-map ref={mapRef} style={{
        display: 'inline-block',
        width: 275,
        height: 400
      }}></capacitor-google-map>

      <button onClick={createMap}>Create Map</button>
    </div>
  )
}

export default MyMap;

Vue

<script lang="ts" setup>
import { ref, shallowRef, useTemplateRef } from 'vue'
import { GoogleMap } from '@capacitor/google-maps'

const mapRef = useTemplateRef<HTMLElement>('mapRef')
const newMap = shallowRef<GoogleMap>()

async function createMap() {
  if (!mapRef.value) return

  newMap.value = await GoogleMap.create({
    id: 'my-cool-map',
    element: mapRef.value,
    apiKey: import.meta.env.VITE_YOUR_API_KEY_HERE,
    config: {
      center: {
        lat: 33.6,
        lng: -117.9,
      },
      zoom: 8,
    },
  })
}
</script>

<template>
  <capacitor-google-map
    ref="mapRef"
    style="display: inline-block; width: 275px; height: 400px"
  ></capacitor-google-map>
  <button @click="createMap()">Create Map</button>
</template>
*/
