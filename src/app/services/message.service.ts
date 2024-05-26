// message.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  constructor(private snackBar: MatSnackBar) {}
  
  showMessage(message: string, duration: number = 10000, messageType: "success" | "error" | "warning"): void {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: `toast-${messageType}`,
      duration,
    });
  }
}
