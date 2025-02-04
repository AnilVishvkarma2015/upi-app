import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(public snackBar: MatSnackBar) { }

    openSnackBar(message: string, action: string, className: string) {
       this.snackBar.open(message, action, {
            duration: 3600,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [className]
        });
    }
}
