import { NgbModal, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap/';
import { Component, Input, OnChanges, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IEntity } from 'src/app/models/file.model';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
interface ICheckedLabel {
    label: string
    checked: boolean;
    count?: number
}

interface ITextEntity {
    text: string;
    label: string;
    clazz: string;
    checked: boolean
}

@Component({
    selector: 'ngbd-entity-content',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.sass', './entity.component.scss']
})
export class EntityModalContent implements OnChanges, OnInit {

    @Input() text: string;
    @Input() ents: Array<IEntity>;

    entMap: Map<string, Array<IEntity>> = new Map();
    entityLabels: Array<ICheckedLabel> = [];
    textEntities: Array<ITextEntity> = [];

    constructor(public activeModal: NgbActiveModal, private ref: ChangeDetectorRef) {
        //console.log(this.activeModal);
    }

    ngOnInit() {
        console.log("ngOnInit");
        setTimeout(
            (() => {

                var that = this;
                that.entityLabels = [];
                that.entMap = new Map();
                /*
                that.ents.forEach((ent: IEntity) => {
                    //console.log(ent);
                    if (!that.entMap.has(ent.label)) {
                        that.entMap.set(ent.label, []);
                    }
                    that.entMap.set(ent.label, [ent].concat(that.entMap.get(ent.label)));
                })
*/

                var prevStart, prevEnd = 0;
                that.textEntities = [];
                that.ents = that.ents.filter((ent: IEntity) => {
                    return ent.endChar - ent.startChar > 1 && ent.text.trim().length > 0
                })

                that.ents.forEach((ent: IEntity) => {
                    //console.log(ent)

                    if (ent.label !== "ORGx" && ent.label !== "GPEx" && ent.label !== "PERSONx") {
                        if (!that.entMap.has(ent.label)) {
                            that.entMap.set(ent.label, []);
                        }
                        that.entMap.set(ent.label, [ent].concat(that.entMap.get(ent.label)));
                    }
                    else {
                        ent.label = "text"
                    }

                    that.textEntities.push(
                        {
                            text: that.text.substring(prevStart, ent.startChar),
                            checked: false,
                            label: 'text',
                            clazz: 'none'

                        }
                    )
                    prevStart = ent.startChar

                    that.textEntities.push(
                        {
                            text: that.text.substring(prevStart, ent.endChar),
                            checked: false,
                            label: ent.label,
                            clazz: ent.label.toLocaleLowerCase()

                        }
                    )
                    prevStart = ent.endChar


                });

                if (that.textEntities.length <= 0 && that.text.length > 0) {
                    that.textEntities.push(
                        {
                            text: that.text,
                            checked: false,
                            label: 'text',
                            clazz: 'none'
                        }
                    )
                }
                if (prevStart != that.text.length) {
                    that.textEntities.push(
                        {
                            text: that.text.substring(prevStart),
                            checked: false,
                            label: 'text',
                            clazz: 'none'
                        }
                    )
                }

                that.entMap.forEach((value: Array<IEntity>, key: string) => {
                    that.entityLabels.push({
                        label: key,
                        checked: false,
                        count: value.length
                    })
                })

                //console.log(that.textEntities)

                this.ref.detectChanges();
            }), 1000
        );


    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            if (propName === "text") {
                let changedProp = changes[propName];

                this.text = changedProp.currentValue;
            }
            if (propName === "ents") {
                let changedProp = changes[propName];

                this.ents = [].concat(changedProp.currentValue);
                //console.log(this.ents)
            }
        }

    }

    toggleEntity(checkLabel: ICheckedLabel) {
        //console.log(checkLabel)
        checkLabel.checked = !checkLabel.checked;
        this.textEntities.forEach((ent: ITextEntity) => {
            if (ent.label === checkLabel.label) {
                //console.log(ent)
                ent.checked = checkLabel.checked
            }
        })
        this.ref.detectChanges()


    }
}

import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { IEntities } from 'src/app/models/file.model';

@Directive({
    selector: '[data-entity]'
})
export class EntityStyleDirective implements AfterViewInit {
    @Input('data-entity') dataEntity: string;
    constructor(private elRef: ElementRef) {
    }
    ngAfterViewInit(): void {
        this.elRef.nativeElement.class = this.dataEntity;
    }
} 