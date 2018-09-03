import * as elasticsearch from 'elasticsearch-browser';

import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IEsService, ISearch } from 'src/app/services/es-iterfaces.service';
import { ESError, IAgreement, IESSearchResult, IESAggResult } from 'src/app/models/es.model';

//const SERVER = "http://eef23428.ngrok.io/"

const SERVER = "http://268736ef.ngrok.io/"
const ES_CONFIG = {
    host: SERVER,
    log: 'info'
};
const query_all_docs = {
    "from": 0,
    "size": 100000000,
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

    public agg<T>(index, docType, body, filterPath): Observable<IESAggResult<T>> {
        body = (body) ? body : query_all_docs;

        return (from(this.client.search(
            {
                index: index,
                type: docType,
                body: body,
                filterPath: filterPath,
            }
        )).pipe(map((result) => {
            console.log("search result", result);

            return <IESAggResult<T>>result
        }), catchError(e => throwError(<ESError>e.toJSON())))
            /*
                .then(response => { result = response },
                error => { result = error }
                ).then(() => {
                    console.log(result);
                })
                */
        );


    }

    public search<T>(index, docType, body, filterPath): Observable<IESSearchResult<T>> {
        body = (body) ? body : query_all_docs;

        return (from(this.client.search(
            {
                index: index,
                type: docType,
                body: body,
                filterPath: filterPath,
            }
        )).pipe(map((result) => {
            console.log("search result", result);

            return <IESSearchResult<T>>result
        }), catchError(e => throwError(<ESError>e.toJSON())))
            /*
                .then(response => { result = response },
                error => { result = error }
                ).then(() => {
                    console.log(result);
                })
                */
        );


    }

}