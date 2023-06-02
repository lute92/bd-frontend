// delete-confirmation.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent {
  @Input() message: string = 'Are you sure you want to delete?';
  @Output() deleteConfirmed: EventEmitter<void> = new EventEmitter<void>();

  confirmDelete() {
    this.deleteConfirmed.emit();
  }
}
