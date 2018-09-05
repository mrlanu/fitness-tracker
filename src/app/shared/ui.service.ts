import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class UiService{

  constructor(private matSnackbar: MatSnackBar){}

  loadingStateChange = new Subject<boolean>();

  showSnackbar(message, action, duration){
    this.matSnackbar.open(message, action, {duration: duration});
  }
}
