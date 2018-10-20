import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IFileMeta, IFile, ITargetBlock, IFileSectionMeta, IFileSection, IAttachment, IEntity, } from "src/app/models/file.model"

import { IFindQuery, IFindResult, IViewResult } from 'src/app/models/couchdb.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IMap } from "src/app/models/model"


import { environment } from '../../environments/environment';
import { CouchDbService } from 'src/app/services/couchdb.service';

const couchdbHost = environment.couchdb
const defaultDb = environment.db


@Injectable()
export class NlpService {

    constructor(private couchDb: CouchDbService) {

    }


    public master(db: string = defaultDb): Observable<IFile> {
        return this.couchDb.findOne<IFile>(db, "master").pipe(map((master) => {
            master.sections = master.sections.map((value: IFileSection) => {
                value.ents = [].concat(master.ents.filter((ent: IEntity) => {
                    return value.sectionId === ent.sectionId
                }))

                value.isCollapsed = true;
                return value;
            })

            return master;
        }));
    }

    public attachments(db: string = defaultDb): Observable<IMap<IAttachment>> {
        return this.couchDb.findAll<IMap<IAttachment>>(db, "attachments").pipe(map((result: Array<IAttachment>) => {
            let attachmentMap: IMap<IAttachment> = {};
            result.forEach((attachment: IAttachment) => {
                attachmentMap[attachment.name.toLocaleUpperCase()] = attachment;
            })

            return attachmentMap;
        }));
    }

    public target(section: IFileSection, db: string = defaultDb): Observable<Array<ITargetBlock>> {

        var query: IFindQuery = {
            limit: 40,
            "sort": [
                "name"
            ],
            "fields": [
                "id",
                "name",
                "sectionText",
                "query",
                "rank",
                "docCount",
                "targetSents",
                "sents",
                "targetBlocks"
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


        return this.couchDb.find<ITargetBlock>(db, query).pipe(
            map(
                (result: IFindResult<ITargetBlock>) => {
                    console.log(result)
                    return result.docs
                }
            )
        );

    }

    public targetFilter(section: IFileSection, term: string, db: string = defaultDb): Observable<Array<ITargetBlock>> {

        var query: IFindQuery = {
            limit: 40,
            "sort": [
                "name"
            ],
            "fields": [
                "id",
                "name",
                "sectionText",
                "query",
                "rank",
                "docCount",
                "targetSents",
                "sents",
                "targetBlocks"
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
                        "name": {
                            "$regex": "(?i)^.*" + term + ".*$"
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


        return this.couchDb.find<ITargetBlock>(db, query).pipe(
            map(
                (result: IFindResult<ITargetBlock>) => {
                    console.log(result)
                    return result.docs
                }
            )
        );

    }

    public search(term: string, db: string = defaultDb): Observable<Array<string>> {
        if (term === '') {
            return of([]);
        }
        var query: IFindQuery = {
            limit: 40,
            sort: [
            ],
            fields: [
                "name"
            ],
            selector: {
                "type": {
                    "$eq": "meta"
                },
                "$and": [
                    {
                        "name": {
                            "$regex": "(?i)^.*" + term + ".*$"
                        }
                    }
                ]
            },
            execution_stats: true

        }


        return this.couchDb.find<string>(db, query).pipe(
            map(
                (result: IFindResult<string>) => {
                    console.log(result)
                    return result.docs
                }
            )
        );
    }


}


