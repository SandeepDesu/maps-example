import { Component, OnInit } from '@angular/core';
import ol from 'openlayers';

import { MapService } from './../../services/mapservice.services';
@Component({
    selector: 'map-root',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})

export class MapComponent implements OnInit {
    constructor(public mapService: MapService) {

    }

    ngOnInit() {
        this.mapService.getRegionsData()
            .subscribe(
            data => {
                this.successHandler(data);
            },
            error => {
                console.log(error)
            }
            );
    }
    successHandler(data) {
        var vector = new ol.layer.vector({
            source: new ol.source.vector({
             })
          });
          var map = new ol.Map({
            layers: [
            new ol.layer.Tile({
                      source: new ol.source.OSM()
                    }),
                     vector ],
                      view: new ol.View({
                           center: ol.proj.transform([-95.68542201, 50], 'EPSG:4326', 'EPSG:3857'),
                           zoom: 3
                          }),
                      target: 'map'
          });
          
          var format = new ol.format.GeoJSON();
          var myGeoJsonFeatures = format.readFeatures(
          data, 
          {featureProjection: 'EPSG:3857'}
          );
          vector.getSource().addFeatures(myGeoJsonFeatures);
    }



}