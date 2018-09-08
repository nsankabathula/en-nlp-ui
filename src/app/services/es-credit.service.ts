import { Injectable } from '@angular/core';
import { CoreEsService } from 'src/app/services/es.service';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IESSearchResult, IHit, IAgreementSent, IESAggResult, IAggResult, IBucket, ISortModel, IFileMeta, IFile, IStat, ISentSimilarity, IDocSentSimilarityStats } from 'src/app/models/es.model';
import { reserveSlots } from '@angular/core/src/render3/instructions';
import { send } from 'q';
const query_all_docs = {
    "from": 0,
    "size": 100000000,
    "query": {
        "match_all": {}
    }
};

const sort = function (a, b, key) {

    const keyA = a[key],
        keyB = b[key];
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
}
const compare = function (key, order = "asc") {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'desc') ? (comparison * -1) : comparison
        );
    };
}
@Injectable()
export class CreditEsService {
    private METADATA_INDEX: string = "files"
    private index: string = "credit"
    private docType: string = "agreement"

    constructor(private esService: CoreEsService) {

    }

    agg<T>(body, filter): Observable<IAggResult> {
        return this.esService.agg<IESAggResult>(this.index, this.docType, body, filter)
        /*.pipe(
            map(
                (result: IESAggResult) => {
                    console.log("agg", result)
                    return result.aggregations as IAggResult
                }
            )
        );
        */
    }
    getDocWithCount(sortKeys: Array<ISortModel> = []): any {

        var query_counts =
            {
                "size": 0,
                "aggregations": {
                    "names": {
                        "terms": {
                            "field": "name.keyword",
                            "size": 50
                        },

                        "aggregations": {
                            "sections": {
                                "significant_terms": {
                                    "field": "sectionId",
                                    "size": 50
                                }
                            }
                        }
                    }
                }
            }

        return this.agg<Array<any>>(query_counts, null).pipe(
            map((res: IAggResult) => {
                if (res.names && sortKeys && sortKeys.length > 0)
                    res.names.buckets.sort(compare(sortKeys[0].field, sortKeys[0].order))

                if (res.names && sortKeys && sortKeys.length > 1)
                    res.names.buckets.forEach((nameBucket: IBucket) => {
                        if (nameBucket.sections) {

                            nameBucket.sections.buckets.sort(compare(sortKeys[1].field, sortKeys[1].order))
                        }

                    })

                return res
            }
            ));
    }

    getFileMetadata(): Observable<Array<IFileMeta>> {
        var query =
            {
                "from": 0,
                "size": 10000,
                "sort": [
                    {
                        "name.keyword": {
                            "order": "asc"
                        }
                    }
                ],
                "_source": [
                    "name",
                    "sectionCount",
                    "sentCount",
                    "filePath",
                    "sections.sectionId",
                    "sections.sentCount",
                    "sections.text"
                ]
            };
        return this.esService.find<IFileMeta>(this.METADATA_INDEX, null, query, null)
    }

    getDoc(meta: IFileMeta): Observable<IFile> {
        var query = {
            "sort": [
                {
                    "name.keyword": {
                        "order": "asc"
                    }
                }
            ],
            "_source": [
                "name",
                "sections.*",
                "sents.*",
                "text",
                "ents.*"
            ],
            "query": {
                "term": {
                    "name.keyword": meta.name
                }
            }
        }

        return this.esService.findOne<IFile>(this.METADATA_INDEX, null, query, null)

    }

    getSimilarityStats(field: string = "similarity"): Observable<IStat> {

        var query = {
            "from": 0,
            "size": 10000,
            "aggs": {
                "similarity": {
                    "stats": {
                        "field": field
                    }
                }
            }

        }
        return this.agg<IStat>(query, null).pipe(
            map((aggResult: IAggResult) => {
                //console.log("getSimilarityStats", aggResult)
                return <IStat>aggResult[field];
            }
            ));

    }

    getDocSimilarityStats(name: string, field: string = "similarity", defaultVal: any = { isCollapsed: true }): Observable<IDocSentSimilarityStats> {

        var query = {
            "from": 0,
            "size": 10000,
            "sort": [
                {
                    "similarity": {
                        "order": "desc"
                    }
                }
            ],
            "aggs": {
                "similarity": {
                    "stats": {
                        "field": field
                    }
                }
            }
            ,
            "_source": [
                "sentId",
                "sentText",
                "startChar",
                "endChar",
                "name",
                "similarity",
                "sectionId"
            ],
            "query": {
                "term": {
                    "name.keyword": name
                }
            }

        }
        return this.esService._search<IDocSentSimilarityStats>(this.index, this.docType, query, null).pipe(
            map((result: IESSearchResult<any>) => {
                return <IDocSentSimilarityStats>{
                    stats: result.aggregations[field],
                    docSents: <Array<ISentSimilarity>>result.hits.hits.map((hit: IHit<ISentSimilarity>) => {
                        return <ISentSimilarity>Object.assign(defaultVal, hit._source)
                    })
                }
            }
            ));

    }

    getDocSimilarities(minSimilarity: number = 0.6, maxSimilarity: number = 0.9): Observable<Array<ISentSimilarity>> {
        var query = {
            "from": 0,
            "size": 50,
            "sort": [
                {
                    "similarity": {
                        "order": "desc"
                    }
                }
            ],
            "_source": [
                "sentId",
                "sentText",
                "startChar",
                "endChar",
                "name",
                "similarity",
                "sectionId",
                "sectionText",
                "query"
            ],
            "query": {
                "bool": {
                    "must": { "match_all": {} },
                    "filter": {
                        "range": {
                            "similarity": {
                                "gte": minSimilarity,
                                "lte": maxSimilarity
                            }
                        }
                    }
                }
            }
        }


        return this.esService.find<ISentSimilarity>(this.index, this.docType, query, null);
    }

    updateScore(sent: ISentSimilarity): Observable<any> {
        const id = sent.name + "_" + sent.sectionId + "_" + sent.sentId;
        console.log("updateScore", id);
        return this.esService.update(this.index, this.docType, id, { score: sent.score })
            .pipe(
            map((result: any) => {
                console.log("Result", result);
                return result;
            }
            ));
    }

    getDocSimilarity(name: string): Observable<Array<ISentSimilarity>> {
        var query = {
            "from": 0,
            "size": 100,
            "sort": [
                {
                    "similarity": {
                        "order": "desc"
                    }
                }
            ],
            "_source": [
                "sentId",
                "sentText",
                "startChar",
                "endChar",
                "name",
                "similarity",
                "sectionId",
                "sectionText",
                "query",
                "score"
            ],
            "query": {
                "term": {
                    "name.keyword": name
                }
            }
        }


        return this.esService.find<ISentSimilarity>(this.index, this.docType, query, null);
    }


}


/*
        var query = {
            "aggs": {
                "similarity": {
                    "histogram": {
                        "field": "similarity",
                        "interval": 0.0002,
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "sent": {
                            "top_hits": {
                                "_source": "sentText",
                                "size": 20,
                                "sort": [
                                    {
                                        "name": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sectionId": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sentId": {
                                            "order": "asc"
                                        }
                                    }
                                ]
                            }
                        },
                        "section": {
                            "top_hits": {
                                "_source": "sectionText",
                                "size": 1,
                                "sort": [
                                    {
                                        "name": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sectionId": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sentId": {
                                            "order": "asc"
                                        }
                                    }
                                ]
                            }
                        },
                        "name": {
                            "top_hits": {
                                "_source": "name",
                                "size": 1,
                                "sort": [
                                    {
                                        "name": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sectionId": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "sentId": {
                                            "order": "asc"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            "size": 0,
            "version": true,
            "_source": {
                "excludes": []
            },
            "stored_fields": [
                "*"
            ],
            "script_fields": {},
            "docvalue_fields": [],
            "query": {
                "bool": {
                    "must": [
                        {
                            "match_all": {}
                        }
                    ],
                    "filter": [],
                    "should": [],
                    "must_not": []
                }
            }
        }
        */