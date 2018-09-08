
import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { FileItem, TLineItem, PLineItem, Accuracy, ClassDetails } from 'src/app/models/model';
import { map, switchMap } from 'rxjs/operators';
import { element } from '@angular/core/src/render3/instructions';
import { AppService } from './app.service';

const SERVER = "http://c0c8ba9c.ngrok.io/"

//const SERVER = "http://localhost:8000/"
@Injectable()
export class TrainingService {
    SERVER: string = SERVER;
    constructor(private http: HttpClient, private appSvc: AppService) {
        console.log("TrainingService Constructor")
    }


    server(url): Observable<string> {
        return this.appSvc.discover("8000 (http)").pipe(map((config) => {
            console.log(config)
            return config.public_url + '/' + url;
        }))

        /*.pipe(map((result)=>{
            result.filter((val) => {
                return val.name === "8000 (http)"
            })[0] + "";
        }));*/

    }

    static getUrl(training: boolean = true): string {
        return (training) ? "training/" : "prediction/";
    }

    public getFileNames(training: boolean = true): Observable<Array<FileItem>> {
        const path = "meta/file/" + ((training) ? "1" : "0")

        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.get<Array<FileItem>>(url).pipe(

                    map((x: Array<FileItem>) => {
                        var result = x.filter((element: FileItem) => {
                            return true;
                            //return element.subGrp == 'retirement' 
                        })
                        result.forEach((element: FileItem) => {
                            element.name = element.txtFileName
                            //console.log(element)
                            //    element.setName(element.txtFileName);
                        }
                        );


                        return result
                    }))
            })
        )




    }





    public getFileContent(fileDetails: FileItem, training: boolean = true): Observable<Array<TLineItem>> {

        const path = TrainingService.getUrl(training) + fileDetails.name
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.get<Array<TLineItem>>(url)
            }));
    }

    public getCollation(fileDetails: FileItem): Observable<Array<PLineItem>> {

        const path = "training/" + fileDetails.name + "/compare/"
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.get<Array<PLineItem>>(url)
            }));
    }

    public merge(fileDetails: FileItem): any {
        const path = "training/" + fileDetails.name + "/merge/"
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.post(url, null);
            }));
    }

    public updateLine(line: TLineItem, fileDetail: FileItem, training: boolean = true): any {
        const path = TrainingService.getUrl(training) + fileDetail.name + "/" + line.line_id.toString() + "/" + line.target.toString() + "/"
        const body = { target: line.target }
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.post(url, null);
            }));

    }

    public delete(fileDetails: FileItem, training: boolean = true): any {
        const path = TrainingService.getUrl(training) + fileDetails.name + "/"
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.delete(url);
            }));

    }

    public markFileForTraining(fileItem: FileItem): any {
        const path = "meta/file/" + fileItem.txtFileName + "/" + fileItem.useForTraining  //AppService.getUrl(training)
        const body = null
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.post(url, null);
            }));
    }

    public predict(fileDetail: FileItem, training: boolean = false): any {
        const path = "python/testPython.py/" + fileDetail.name + ((training) ? "/training_features/" : "/predicted_data/")
        return this.server(path).pipe(
            switchMap((url) => {
                return this.http.post(url, null);
            }));
    }

    public accuracyScore(prediction: Array<PLineItem>): Accuracy {
        //predictionCount acutalCount
        var accuracy: Accuracy = new Accuracy(prediction);



        return accuracy;
    }


}