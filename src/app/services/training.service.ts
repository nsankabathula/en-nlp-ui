
import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { FileItem, TLineItem, PLineItem, Accuracy, ClassDetails } from 'src/app/models/model';
import { map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3/instructions';
import { environment } from 'src/environments/environment';

const SERVER = environment.webservice

@Injectable()
export class TrainingService {

    constructor(private http: HttpClient) {

    }

    static getUrl(training: boolean = true): string {
        return (training) ? "training/" : "prediction/";
    }

    public getFileNames(training: boolean = true): Observable<Array<FileItem>> {
        const url = SERVER + "meta/file/" + ((training) ? "1" : "0") //AppService.getUrl(training)
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
    }





    public getFileContent(fileDetails: FileItem, training: boolean = true): Observable<Array<TLineItem>> {

        const url = SERVER + TrainingService.getUrl(training) + fileDetails.name
        return this.http.get<Array<TLineItem>>(url)
    }

    public getCollation(fileDetails: FileItem): Observable<Array<PLineItem>> {

        const url = SERVER + "training/" + fileDetails.name + "/compare/"
        return this.http.get<Array<PLineItem>>(url)
    }

    public merge(fileDetails: FileItem): any {
        const url = SERVER + "training/" + fileDetails.name + "/merge/"
        return this.http.post(url, null);
    }

    public updateLine(line: TLineItem, fileDetail: FileItem, training: boolean = true): any {
        const url = SERVER + TrainingService.getUrl(training) + fileDetail.name + "/" + line.line_id.toString() + "/" + line.target.toString() + "/"
        const body = { target: line.target }
        return this.http.post(url, null);

    }

    public delete(fileDetails: FileItem, training: boolean = true): any {
        const url = SERVER + TrainingService.getUrl(training) + fileDetails.name + "/"
        return this.http.delete(url);

    }

    public markFileForTraining(fileItem: FileItem): any {
        const url = SERVER + "meta/file/" + fileItem.txtFileName + "/" + fileItem.useForTraining  //AppService.getUrl(training)
        const body = null
        return this.http.post(url, null);
    }

    public predict(fileDetail: FileItem, training: boolean = false): any {
        const url = SERVER + "python/testPython.py/" + fileDetail.name + ((training) ? "/training_features/" : "/predicted_data/")
        return this.http.post(url, null);
    }

    public accuracyScore(prediction: Array<PLineItem>): Accuracy {
        //predictionCount acutalCount
        var accuracy: Accuracy = new Accuracy(prediction);



        return accuracy;
    }


}