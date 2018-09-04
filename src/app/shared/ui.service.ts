import {Subject} from 'rxjs';

export class UiService{
  loadingStateChange = new Subject<boolean>();
}
