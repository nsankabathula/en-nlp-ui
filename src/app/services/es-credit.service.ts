declare var require: any;

import { Injectable } from '@angular/core';
import { CoreEsService } from 'src/app/services/es.service';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IESSearchResult, IHit, IAgreementSent, IESAggResult, IAggResult, IBucket, ISortModel, IStat, ISimilarityDocBucket, } from 'src/app/models/es.model';

import { IFile, ITargetBlock, IDocSentSimilarityStats } from "src/app/models/file.model"
import { IFileSentMeta, IFileSent, IFileSection, IFileSectionMeta, IFileMeta } from "src/app/models/file.model"

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
export const compare = function (key, order = "asc") {
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

//const ES_QUERIES = require("../queries/es-credit.json");

@Injectable()
export class CreditEsService {
    private METADATA_INDEX: string = "demo.meta"
    private index: string = "credit"
    private docType: string = "agreement"

    constructor(private esService: CoreEsService) {

    }

    agg<T>(body, filter, index = this.index): Observable<IAggResult<T>> {
        return this.esService.agg<T>(index, this.docType, body, filter)
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
            map((res: IAggResult<any>) => {
                if (res.names && sortKeys && sortKeys.length > 0)
                    res.names.buckets.sort(compare(sortKeys[0].field, sortKeys[0].order))

                if (res.names && sortKeys && sortKeys.length > 1)
                    res.names.buckets.forEach((nameBucket: IBucket<any>) => {
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
                    "sections.text",
                    "sections.index"
                ]
            };
        return this.esService.find<IFileMeta>(this.METADATA_INDEX, null, query, null).pipe(map((res: Array<IFileMeta>) => {
            console.log("getFileMetadata", res);
            return res;
        }))
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

        return this.esService.findOne<IFile>(this.METADATA_INDEX, null, query, null).pipe(map((res: IFile) => {
            res.sections.forEach((sec) => {
                sec.index = res.name.toLowerCase() + "_" + sec.sectionId.toString()
            })
            return res
        }))

    }

    getSimilarityStats(index = this.index, field: string = "similarity"): Observable<IStat> {

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
        return this.agg<IStat>(query, null, index).pipe(
            map((aggResult: IAggResult<IStat>) => {
                console.log("getSimilarityStats", aggResult)
                return <IStat>aggResult[field];
            }
            ));

    }

    getSentenceStats(index: string, startIndex: number, endIndex: number): Observable<IDocSentSimilarityStats> {

        var query = {
            "from": 0,
            "size": 10000,
            "sort": [
                {
                    "index": {
                        "order": "asc"
                    }
                }
            ],
            "aggs": {
                "similarity": {
                    "stats": {
                        "field": "sentSimilarity"
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
                "sentSimilarity",
                "sectionId",
                "words"
            ],
            "query": {
                "range": {
                    "index": {
                        "gte": startIndex,
                        "lte": endIndex
                    }
                }
            }

        }
        return this.esService._search<IDocSentSimilarityStats>(index, this.docType, query, null).pipe(
            map((result: IESSearchResult<any>) => {
                return <IDocSentSimilarityStats>{
                    stats: result.aggregations["similarity"],
                    docSents: <Array<IFileSent>>result.hits.hits.map((hit: IHit<IFileSent>) => {
                        return <IFileSent>Object.assign({}, hit._source)
                    })
                }
            }
            ));

    }

    getDocSimilarities(index = this.index, minSimilarity: number = 0.6, maxSimilarity: number = 0.9): Observable<Array<ITargetBlock>> {
        var query = {
            "from": 0,
            "size": 50,
            "sort": [
                {
                    "name.keyword": {
                        "order": "asc"
                    }
                }
            ],
            "_source": [
                "sentId",
                "sentText",
                "startChar",
                "endChar",
                "name",
                "sentSimilarity",
                "sectionId",
                "sectionText",
                "query",
                "words",
                "_id",
                "rank",
                "docCount"
            ],
            "query": {
                "bool": {
                    "must": {
                        "term": { "sectionId": -2 }
                    }
                }
            }
        }


        return this.esService.find<ITargetBlock>(index, null, query, null);
    }

    updateTarget(sent: ITargetBlock, index: string = this.index): Observable<any> {
        const id = sent.name + "_" + sent.sectionId + "_" + sent.sentId;
        console.log("updateScore", id);
        return this.esService.update(index, this.docType, id, { target: sent.target })
            .pipe(
            map((result: any) => {
                console.log("Result", result);
                return result;
            }
            ));
    }

    getSentences(index: string, startIndex, endIndex): Observable<Array<IFileSent>> {
        const query =
            {
                "query": {
                    "range": {
                        "index": {
                            "gte": startIndex,
                            "lte": endIndex
                        }
                    }
                },
                "_source": [
                    "sentId",
                    "sectionId",
                    "sentText",
                    "sentSimilarity",
                    "name",
                    "words"
                ],
                "sort": [
                    {
                        "sentSimilarity": {
                            "order": "desc"
                        }
                    }
                ]
            }

        return this.esService.find(index, null, query, null).pipe(map((res: Array<IFileSent>) => {
            return res;
        }));


    }

    getDocSimilarity(name: string, index: string = this.index): Observable<Array<ITargetBlock>> {
        var query = {
            "from": 0,
            "size": 100,
            "sort": [
                {
                    "sentSimilarity": {
                        "order": "desc"
                    },
                    "sectionSimilarity": {
                        "order": "desc"
                    },

                }
            ],
            "_source": [
                "sentId",
                "sentText",
                "startChar",
                "endChar",
                "name",
                "similarity",
                "sentSimilarity",
                "sectionSimilarity",
                "sectionId",
                "sectionText",
                "query",
                "target"
            ],
            "query": {
                "term": {
                    "name.keyword": name
                }
            }
        }


        return this.esService.find<ITargetBlock>(index, this.docType, query, null).pipe(map((res) => {
            res.forEach((value) => {
                value.query.index = value.query.name.toLowerCase() + "_" + value.query.sectionId
            })
            return res;
        }));
    }


}


