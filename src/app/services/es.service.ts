import * as elasticsearch from 'elasticsearch-browser';

import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IEsService, ISearch } from 'src/app/services/es-iterfaces.service';
import { IESError, IAgreementSent, IESSearchResult, IESAggResult, IHit, ESError, Hit, IAggResult } from 'src/app/models/es.model';


const SERVER = "http://3a9f8c68.ngrok.io/"
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




    agg<T>(index, docType, body, filter): Observable<IAggResult> {
        return this._search<IESAggResult>(index, docType, body, filter).pipe(
            map(
                (result: IESAggResult) => {
                    console.log("agg", result)
                    return result.aggregations as IAggResult
                }
            )
        );
    }

    public _search<T>(index, docType, body, filterPath): Observable<IESSearchResult<T>> {
        body = (body) ? body : query_all_docs;

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

    public find<T>(index, docType, body, filter): Observable<Array<T>> {
        return this._search<IESSearchResult<T>>(index, docType, body, filter).pipe(
            map(
                (result: IESSearchResult<T>) => {
                    return result.hits.hits.map((hit: IHit<T>) => {
                        return hit._source
                    })
                }
            )
        );
    }

    public findOne<T>(index, docType, body, filter): Observable<T> {
        return this._search<IESSearchResult<T>>(index, docType, body, filter).pipe(
            map(
                (result: IESSearchResult<T>) => {
                    return result.hits.hits.map((hit: IHit<T>) => {
                        return hit._source
                    })
                }
            )
        ).pipe(map((result: Array<T>) => {
            if (result && result.length > 0)
                return result[0]
            else
                throwError(new ESError("Result is empty"))
        }));
    }

}