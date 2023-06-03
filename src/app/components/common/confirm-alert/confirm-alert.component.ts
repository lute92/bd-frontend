import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent {
  @Input() item: any;
  @Input() message: string = "Are you sure?";
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  get isOpen(): boolean {
    return !!this.item;
  }

  closeModal() {
    this.item = null;
    this.close.emit();
  }

  confirmAction() {
    this.confirm.emit();
    this.closeModal();
  }
}
