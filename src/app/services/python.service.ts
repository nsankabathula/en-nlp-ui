import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

const SERVER = "http://c0c8ba9c.ngrok.io/";
const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
const options = { headers: headers };
@Injectable()
export class PyService {

    constructor(private http: HttpClient) {

    }

    private test(pyScript: string, body?: any, args?: Array<any>, ): any {

        const url = SERVER + "python/test/" + pyScript + "/" + ((args && args.length > 0) ? args.join("/") : "");
        console.log("python test service url", url);
        return this.http.post(url, (body) ? body : { "b": 2 }, options);
    }

    private call(pyScript: string, body?: any, args?: Array<any>, ): any {
        const url = SERVER + "python/" + pyScript + "/" + ((args && args.length > 0) ? args.join("/") : "");
        console.log("python service url", url);
        return this.http.post(url, (body) ? body : {}, options);
    }

    callDoc2Vec(text: string = "You may be liable for certain unauthorized use of your Card if it occurs before you notify us"): any {
        return this.call("doc2VecTesting.py", { "args": [text] })
    }


}