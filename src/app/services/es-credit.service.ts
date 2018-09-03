import { Injectable } from '@angular/core';
import { CoreEsService } from 'src/app/services/es.service';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IESSearchResult, IHit, IAgreement, IESAggResult } from 'src/app/models/es.model';
const query_all_docs = {
    "from": 0,
    "size": 100000000,
    "query": {
        "match_all": {}
    }
};
@Injectable()
export class CreditEsService {
    private index: string = "credit"
    private docType: string = "agreement"

    constructor(private esService: CoreEsService) {

    }

    get<T>(body, filter): Observable<Array<IHit<T>>> {
        return this.esService.search<IESSearchResult<T>>(this.index, this.docType, body, filter).pipe(
            map(
                (result: IESSearchResult<T>) => {
                    return <Array<IHit<T>>>result.hits.hits
                }
            )
        );
    }

    getAll(): Observable<Array<IHit<IAgreement>>> {
        return this.get(null, null)
        /*
        return this.esService.search<IESResult<IAgreement>>(this.index, this.docType, null, null).pipe(
            map(
                (result: IESResult<any>) => {
                    return <Array<IHit<IAgreement>>>result.hits.hits
                }
            )
        );
        */
    }

    agg<T>(body, filter): Observable<IESAggResult<T>> {
        return this.esService.search<IESAggResult<T>>(this.index, this.docType, body, filter).pipe(
            map(
                (result: IESAggResult<T>) => {
                    return <IESAggResult<T>>result.aggregations
                }
            )
        );
    }
    getDocWithCount(): any {

        var query_counts =
            {
                "size": 0,
                "aggs": {
                    "names": {
                        "terms": {
                            "field": "name.keyword",
                            "size": 50
                        },
                        "aggregations": {
                            "sections": {
                                "significant_terms": {
                                    "field": "sectionId"
                                }
                            }
                        }
                    }
                }
            }

        /*{
            "size": 0,
            "aggregations": {
                "names": {
                    "terms": { "field": "name.keyword", "size": 50 }
                }
            }
        }
        */
        return this.agg<Array<any>>(query_counts, null)
    }





}