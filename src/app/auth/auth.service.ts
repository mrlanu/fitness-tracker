import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthService{

  private user: User;
  authChange = new Subject<boolean>();

  constructor(private  router: Router, private afAuth: AngularFireAuth){}

  registerUser(authData: AuthData){
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.authSuccesfully();
      })
      .catch(error => {
        console.log(error)
      });
  }

  login(authData: AuthData){
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.authSuccesfully();
      })
      .catch(error => {
        console.log(error)
      });
  }

  logout(){
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser(){
    return {...this.user};
  }

  isAuth(){
    return this.user != null;
  }

  private authSuccesfully(){
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
