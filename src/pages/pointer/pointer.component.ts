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
import ol_Overlay from 'ol/overlay';
import _ from 'lodash';

@Component({
  selector: 'map-pointer',
  templateUrl: './pointer.component.html',
  styleUrls: ['./pointer.component.css']
})

export class MapPointer implements OnInit {
  constructor(public mapService: MapService) {}
  statesJson: any;
  sourceData: any;
  regionData: any;
  merge = [];
  ngOnInit() {
    this.mapService.getVisableData().subscribe(data => {
      this.sourceData = data;
      this.mapService.getstateNames().subscribe(state => {
        this.statesJson = state;
        this.mergeData();
      }, errr => {
        console.log(errr);
      })
    }, errr => {
      console.log(errr);
    })
  }

  mergeData() {
    let size = _.size(this.sourceData);
    _.forEach(this.sourceData, (value, key) => {
      _.forEach(this.statesJson, (v, k) => {
        if (key === v[0]) {
          this.mapService.getCordinates(v[1]).subscribe(coordinates => {
            var iconFeature = new ol_Feature({
              geometry: new ol_geom_Point(ol_proj.fromLonLat([coordinates.results[0].geometry.location.lng, coordinates.results[0].geometry.location.lat])),
              city: v[1],
              value: value.tpAccRat
            });
            iconFeature.setStyle(new ol_style_Style({
              image: new ol_style_Icon(/** @type {olx.style.IconOptions} */({
                color: '#8959A8',
                crossOrigin: 'anonymous',
                src: 'https://openlayers.org/en/v4.3.4/examples/data/dot.png' //https://openlayers.org/en/v3.12.1/examples/data/icon.png
              }))
            }));
            this.merge.push(iconFeature);
            if (this.merge.length === size - 1) {
              this.dispalyMap();
            }
          }, errr => {
            console.log(errr);
          })
        }
      });
    });

  }


  dispalyMap() {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    var overlay = new ol_Overlay(/** @type {olx.OverlayOptions} */({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));
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
      overlays: [overlay],
      controls: [],
      view: new ol_View({
        center: ol_proj.transform([-90.68542201, 38], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4.5
      })
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      var source = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return { city: feature.get('city'), value: feature.get('value') };
      });
      if (source.city) {
        content.innerHTML = '<div><p>City : ' + source.city + '</p></div><div><p>TpAccRat : ' + source.value + '</p></div>';
        overlay.setPosition(coordinate);
      }
    });
  }

}


