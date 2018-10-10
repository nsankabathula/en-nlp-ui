import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { IFindQuery, IFindResult, IViewResult } from 'src/app/models/couchdb.model';


const CONNECTION_CONFIG = {
    host: environment.couchdb,
    log: 'info'
};


@Injectable()
export class CouchDbService {

    client = CONNECTION_CONFIG

    constructor(private http: HttpClient) {

    }

    public view<T>(db: string, viewName: string): Observable<IViewResult<T>> {
        return this.http.get<T>(this.client.host + db + "/" + viewName).pipe(
            map(
                (result: IViewResult<T>) => {
                    return result;
                }
            )
        );
    }

    public findOne<T>(db: string, viewName: string): Observable<T> {
        return this.view<T>(db, viewName).pipe(map((result: IViewResult<T>) => {
            if (result && result.total_rows > 0)
                return result.rows[0].doc
            else
                throwError(new Error("Result is empty"))
        }));
    }

    public findAll<T>(db: string, viewName: string): Observable<T> {
        return this.view<Array<T>>(db, viewName).pipe(map((result: IViewResult<T>) => {
            if (result && result.rows)
                return result.rows
            else
                throwError(new Error("Result is empty"))
        }));
    }

    public find<T>(db: string, query: IFindQuery, pagination: boolean = true): Observable<IFindResult<T>> {
        return this.http.post(this.client.host + db + "/find/", query).pipe(map((result) => {
            return <IFindResult<T>>result
        }), catchError(e => throwError(e)))
            ;
    }




}