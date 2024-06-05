// message.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessageComponent {
  message: string | undefined;

  dismiss(): void {
    this.message = undefined;
  }
}
