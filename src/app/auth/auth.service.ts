import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AuthService{

  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private  router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private matsnackbar: MatSnackBar
  ){}

  initAuthListener(){
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData){
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
      })
      .catch(error => {
        this.matsnackbar.open(error.message, null, {
          duration: 3000
        });
      });
  }

  login(authData: AuthData){
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
      })
      .catch(error => {
        this.matsnackbar.open(error.message, null, {
          duration: 3000
        });
      });
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.isAuthenticated;
  }
}
