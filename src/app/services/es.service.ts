import * as elasticsearch from 'elasticsearch-browser';

import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IEsService, ISearch } from 'src/app/services/es-iterfaces.service';
import { IESError, IAgreementSent, IESSearchResult, IESAggResult, IHit, ESError, Hit, IAggResult } from 'src/app/models/es.model';
import { ConfigService } from 'src/app/services/config.service';


const SERVER = ConfigService.getServer("9200")//"http://3e18eae8.ngrok.io/"
const ES_CONFIG = {
    host: SERVER,
    log: 'info'
};
const query_all_docs = {
    "from": 0,
    "size": 10000,
    "query": {
        "match_all": {}
    }
};
@Injectable()
export class CoreEsService implements IEsService, ISearch {

    client: elasticsearch.Client;

    constructor() {
        if (!this.client) {
            this.client = this.connect(ES_CONFIG);
            this.client.ping({
                requestTimeout: Infinity,
                body: 'Ping test: ' + Date.now().toString()
            });
        }
    }

    connect(esConfig): elasticsearch.Client {
        return new elasticsearch.Client(esConfig)
    }




    agg<T>(index, docType, body, filter, useTemplate: boolean = false): Observable<IAggResult<T>> {
        return this._search<IESAggResult<T>>(index, docType, body, filter, useTemplate).pipe(
            map(
                (result: IESAggResult<T>) => {
                    console.log("agg", result)
                    return result.aggregations as IAggResult<T>
                }
            )
        );
    }


    public _search<T>(index, docType, body, filterPath, useTemplate: boolean = false): Observable<IESSearchResult<T>> {
        body = (body) ? body : query_all_docs;
        if (!useTemplate) {
            return (from(this.client.search(
                {
                    index: index,
                    type: docType,
                    body: body,
                    filterPath: filterPath,
                }
            )).pipe(map((result) => {

                return <IESSearchResult<T>>result
            }), catchError(e => throwError(<IESError>e.toJSON())))
            );
        }
        else {
            return (from(this.client.searchTemplate(
                {
                    index: index,
                    type: docType,
                    body: body,
                    filterPath: filterPath,
                }
            )).pipe(map((result) => {

                return <IESSearchResult<T>>result
            }), catchError(e => throwError(<IESError>e.toJSON())))
            );

        }


    }

    public find<T>(index, docType, body, filter, useTemplate: boolean = false): Observable<Array<T>> {
        return this._search<IESSearchResult<T>>(index, docType, body, filter, useTemplate).pipe(
            map(
                (result: IESSearchResult<T>) => {
                    return result.hits.hits.map((hit: IHit<T>) => {
                        return hit._source
                    })
                }
            )
        );
    }

    public findOne<T>(index, docType, body, filter, useTemplate: boolean = false): Observable<T> {
        return this.find<T>(index, docType, body, filter, useTemplate).pipe(map((result: Array<T>) => {
            if (result && result.length > 0)
                return result[0]
            else
                throwError(new ESError("Result is empty"))
        }));
    }

    public update(index: string, docType: string, id: any, doc: any): Observable<any> {
        console.log("update doc", id, doc)

        return this._update(index, docType, id, { doc: doc })

    }

    public _update(index: string, docType: string, id: any, body: any): Observable<any> {
        console.log("_update ", id, body)

        return from(this.client.update({
            index: index,
            type: docType,
            id: id,
            body: body
        })
        ).pipe(map((result) => {
            console.log("_update", result);
            return <IESSearchResult<any>>result
        }),
            catchError(e => throwError(<IESError>e.toJSON())));


    }

}