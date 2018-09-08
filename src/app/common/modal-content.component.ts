import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'ngbd-modal-content',
  template: `
  <ng-template #defaultModalBody>    
    <p>{{text}}!</p>    
  </ng-template>
            <div class="modal-header">
              <h4 class="modal-title">{{name}}</h4>
              <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">             
              <ng-container *ngTemplateOutlet="modalBody ? modalBody: defaultModalBody">    
              </ng-container>
              </div>
              <div class="modal-footer">
              <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
            </div>  
  `,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class ModalContent {
  @Input() name;
  @Input() text;
  @Input()
  modalBody: TemplateRef<any>;

  constructor(public activeModal: NgbActiveModal) {

  }
}