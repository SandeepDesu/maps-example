import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MapService {

  constructor(public http:  Http) { }
  
    getRegionsData(){
      return this.http.get('assets/us-states-geojson.json')
                        .map((res:any) => res.json());
    }
    
    getCordinates(name){
      return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+name+'&sensor=true_or_false&key=AIzaSyAfqPbeUkJ_c_luq2uavTgZyyEB8TKdU2s')
      .map((res:any) => res.json());
    }

    getVisableData(){
      return this.http.get('assets/tp_radl.json')
      .map((res:any) => res.json());
    }
  
    getstateNames(){
      return this.http.get('assets/us-state-names.json')
      .map((res:any) => res.json());
    }
}