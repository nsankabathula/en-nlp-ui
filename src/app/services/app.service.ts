
import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of, from, throwError } from 'rxjs';

import { map, filter, concatMap } from 'rxjs/operators';

const SERVER = "http://7df15a12.ngrok.io/"

//const SERVER = "http://localhost:8000/"
@Injectable()
export class AppService {

    constructor(private http: HttpClient) {



    }


    _discover(): Observable<Array<any>> {

        return this.http.get(SERVER + "discover").pipe(map((value: any) => {

            return value.tunnels;
        }));
    }

    discover(name: string): Observable<any> {

        return this._discover().pipe(
            map((val) => { return val }),
            concatMap(arr => from(arr)),
            filter(val => val.name == name)
        );
    }




}