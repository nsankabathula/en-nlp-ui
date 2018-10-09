declare var require: any;

import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable, of } from 'rxjs';
import { FileItem, TLineItem, PLineItem, Accuracy, ClassDetails } from 'src/app/models/model';
import { map, } from 'rxjs/operators';
import { element } from '@angular/core/src/render3/instructions';
import { TrainingService } from 'src/app/services/training.service';
import { filter } from 'rxjs/internal/operators/filter';
import { FileSection, ISection } from 'src/app/models/file.model';


//const SERVER = "http://eef23428.ngrok.io/"

const SERVER = "http://localhost:8000/"
@Injectable()
export class CompareService {



    constructor(private http: HttpClient, private trainingSvc: TrainingService) {

    }

    public getFiles(): Observable<Array<FileItem>> {
        return this.trainingSvc.getFileNames(true);
    }

    public getMasterFiles(limit: number = 20): Observable<Array<FileItem>> {
        return this.getFiles().pipe(map((x: Array<FileItem>) => {
            var counter = 0;
            var result = x.filter((element: FileItem) => {

                return counter++ < limit && element.name.startsWith("creditcardagreement");
                //return element.subGrp == 'retirement' 
            })
            return result;
        }
        ));
    }

    public getFileSections(fileItem: FileItem): Observable<ISection[]> {
        //require('@imdb-chat-module/chat.data.json');
        const fileSections: Array<FileSection> = require('src/app/data/file-sections.json');
        return of(fileSections);
    }




}