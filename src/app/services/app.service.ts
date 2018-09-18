

import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { FileItem, TLineItem, PLineItem, Accuracy, ClassDetails } from 'src/app/models/model';
import { map } from 'rxjs/operators';


//const SERVER = "http://eef23428.ngrok.io/"

const SERVER = "http://localhost:8000/"
@Injectable()
export class AppService {

    constructor(private http: HttpClient) {

    }






}