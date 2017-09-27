import { Component, OnInit } from '@angular/core';
import ol_Map from 'ol/map';
import ol_layer_vector from 'ol/layer/Vector';
import ol_layer_Tile from 'ol/layer/tile';
import ol_source_OSM from 'ol/source/osm';
import ol_source_vector from 'ol/source/vector';
import ol_View from 'ol/view';
import ol_proj from 'ol/proj';
import ol_format_GeoJSON from 'ol/format/GeoJSON'
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
        var vector = new ol_layer_vector({
            source: new ol_source_vector({
             })
          });
          var map = new ol_Map({
            layers: [
            new ol_layer_Tile({
                      source: new ol_source_OSM()
                    }),
                     vector ],
                      view: new ol_View({
                           center: ol_proj.transform([-95.68542201, 50], 'EPSG:4326', 'EPSG:3857'),
                           zoom: 3
                          }),
                      target: 'map'
          });
          
          var format = new ol_format_GeoJSON();
          var myGeoJsonFeatures = format.readFeatures(
          data, 
          {featureProjection: 'EPSG:3857'}
          );
          vector.getSource().addFeatures(myGeoJsonFeatures);
    }



}