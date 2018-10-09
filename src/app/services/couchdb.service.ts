import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { IAllDocs, IFindResult, IFindQuery } from 'src/app/models/couchdb.model';


const SERVER = environment.couchdb//ConfigService.getServer("9200")//"http://3e18eae8.ngrok.io/"
const CONNECTION_CONFIG = {
    host: SERVER,
    log: 'info'
};


@Injectable()
export class CouchDbService {

    client = CONNECTION_CONFIG

    constructor(private http: HttpClient) {

    }

    public allDocs(db: string): Observable<any> {

        return this.http.get(this.client.host + db + "/_all_docs").pipe(
            switchMap(
                (result: IAllDocs) => {
                    console.log("allDocs", result)
                    const body =
                        {
                            docs: result.rows.map((value) => {
                                return { id: value.id, rev: value.value.rev }
                            })
                        }
                    //return docs

                    return this.bulkGet(db, body)
                }
            )
        );

    }

    public bulkGet(db: string, body: any): Observable<any> {
        return this.http.post(this.client.host + db + "/_bulk_get", body).pipe(
            map(
                (result: any) => {
                    console.log("bulkGet", result)

                    return result;
                }
            )
        );
    }

    public search<T>(db: string, query: IFindQuery): Observable<IFindResult<T>> {
        return this.http.post(this.client.host + db + "/_find", query).pipe(map((result) => {

            return <IFindResult<T>>result
        }), catchError(e => throwError(e)))
            ;
    }

    public find<T>(db: string, query: IFindQuery, pagination: boolean = true): Observable<Array<T>> {
        return this.search<T>(db, query).pipe(
            map(
                (result: IFindResult<T>) => {
                    console.log(result)
                    return result.docs
                }
            )
        );
    }

    public findOne<T>(db: string, query: IFindQuery): Observable<T> {
        return this.find<T>(db, query).pipe(map((result: Array<T>) => {
            if (result && result.length > 0)
                return result[0]
            else
                throwError(new Error("Result is empty"))
        }));
    }

    public pagination<T>(db: string, query: IFindQuery): Observable<IFindResult<T>> {
        return this.http.post("http://localhost:8000/couchdb.v1/nlp-101/find/", query).pipe(map((result) => {

            return <IFindResult<T>>result
        }), catchError(e => throwError(e)))
            ;
    }




}