import { Component, OnInit } from '@angular/core';
import { MapService } from './../../services/mapservice.services';
import ol_Map from 'ol/Map';
import ol_View from 'ol/View';
import ol_proj from 'ol/proj';
import ol_Feature from 'ol/Feature';
import ol_geom_Point from 'ol/geom/Point';
import ol_source_Vector from 'ol/source/Vector';
import ol_source_OSM from 'ol/source/OSM';
import ol_layer_Vector from 'ol/layer/Vector';
import ol_layer_Tile from 'ol/layer/Tile';
import ol_style_Style from 'ol/style/style';
import ol_style_Icon from 'ol/style/icon';
import ol_style_Text from 'ol/style/text';
import ol_style_Fill from 'ol/style/fill';
import ol_style_Stroke from 'ol/style/stroke';

import _ from 'lodash';
@Component({
  selector: 'map-pointer',
  templateUrl: './pointer.component.html',
  styleUrls: ['./pointer.component.css']
})

export class MapPointer implements OnInit {
  constructor(public mapService: MapService) {

  }
  statesJson: any;
  sourceData: any;
  regionData: any;
  merge = [];
  ngOnInit() {
    this.mapService.getVisableData().subscribe(data => {
      this.sourceData = data;
      this.mapService.getstateNames().subscribe(state => {
        this.statesJson = state;
        this.mapService.getRegionsData().subscribe(regions => {
          this.regionData = regions;
          this.mergeData();
        }, errr => {
          console.log(errr);
        })
      }, errr => {
        console.log(errr);
      })
    }, errr => {
      console.log(errr);
    })
  }

  mergeData() {
    _.forEach(this.sourceData, (value, key) => {
      _.forEach(this.statesJson, (v, k) => {
        if (key === v[0]) {
          _.forEach(this.regionData.features, (a, b) => {
            if (v[1] === a.properties.name) {
              var axis = [];
              if (a.geometry.coordinates[0][0].length > 2) {
                axis = a.geometry.coordinates[0][0][a.geometry.coordinates[0].length - 1];
              } else {
                axis = a.geometry.coordinates[0][a.geometry.coordinates.length - 1];
              }
              var iconFeature = new ol_Feature({
                geometry: new ol_geom_Point(ol_proj.fromLonLat([axis[0], axis[1]]))
              });
              var a = value.tpAccRat;
              iconFeature.setStyle(new ol_style_Style({
                image: new ol_style_Icon(/** @type {olx.style.IconOptions} */({
                  color: '#8959A8',
                  crossOrigin: 'anonymous',
                  src: 'https://openlayers.org/en/v4.3.4/examples/data/dot.png' //https://openlayers.org/en/v3.12.1/examples/data/icon.png
                })),
                // text: new ol_style_Text({
                //   font: '12px Calibri,sans-serif',
                //   fill: new ol_style_Fill({ color: '#000' }),
                //   stroke: new ol_style_Stroke({
                //     color: '#fff', width: 2
                //   }),
                //   text: a.toString()
                // })
              }));

              this.merge.push(iconFeature);
            }
          });
        }
      });
    });





    var vectorSource = new ol_source_Vector({
      features: this.merge
    });

    var vectorLayer = new ol_layer_Vector({
      source: vectorSource
    });

    var map = new ol_Map({
      layers: [
        new ol_layer_Tile({
          source: new ol_source_OSM()
        }), vectorLayer
      ],
      target: 'map-one',

      view: new ol_View({
        center: ol_proj.transform([-95.68542201, 40], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });
    
  }



}