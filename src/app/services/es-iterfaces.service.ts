import * as elasticsearch from 'elasticsearch-browser';
import { Observable } from 'rxjs';
const ES_CONNECT = function (SERVER) {
    return new elasticsearch.Client({
        host: SERVER,
        log: 'trace'
    })
}

export interface IEsService {
    connect(esConfig): elasticsearch.Client;
    //new(esConfig: any);
}

export interface ISearch {
    _search(index, docType, body, filter): Observable<any>;

}

