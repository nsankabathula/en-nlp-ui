import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IFileMeta, IFile, ITargetBlock, IFileSectionMeta, IFileSection } from "src/app/models/file.model"

import { IFindQuery, IFindResult, IViewResult } from 'src/app/models/couchdb.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
const host = "http://localhost:8000/couchdb.v1/"



@Injectable()
export class NlpService {

    constructor(private http: HttpClient) {

    }

    private view<T>(db: string, viewName: string): Observable<IViewResult<T>> {
        return this.http.get<T>(host + db + "/" + viewName).pipe(
            map(
                (result: IViewResult<T>) => {
                    return result;
                }
            )
        );
    }

    private findOne<T>(db: string, viewName: string): Observable<T> {
        return this.view<T>(db, viewName).pipe(map((result: IViewResult<T>) => {
            if (result && result.total_rows > 0)
                return result.rows[0].doc
            else
                throwError(new Error("Result is empty"))
        }));
    }

    private find<T>(db: string, query: IFindQuery, pagination: boolean = true): Observable<IFindResult<T>> {
        return this.http.post(host + db + "/find/", query).pipe(map((result) => {
            return <IFindResult<T>>result
        }), catchError(e => throwError(e)))
            ;
    }


    public master(db: string = "nlp-101"): Observable<IFile> {
        return this.findOne<IFile>(db, "master");
    }

    public target(section: IFileSection, db: string = "nlp-101"): Observable<Array<ITargetBlock>> {

        var query: IFindQuery = {
            limit: 10,
            "sort": [

            ],
            "fields": [
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
                "rank",
                "docCount",
                "targetSents"
            ],
            "selector": {
                "sectionId": {
                    "$eq": -1
                },
                "$and": [
                    {
                        "sectionId": {
                            "$eq": -1
                        }
                    },
                    {
                        "query": {
                            "sectionId": {
                                "$eq": section.title
                            }
                        }
                    }
                ]
            },
            execution_stats: true


            /*
            "selector": {
                "bool": {
                    "must": {
                        "term": { "sectionId": -2 }
                    }
                }
            }*/
        }


        return this.find<ITargetBlock>(db, query).pipe(
            map(
                (result: IFindResult<ITargetBlock>) => {
                    console.log(result)
                    return result.docs
                }
            )
        );

    }



}


