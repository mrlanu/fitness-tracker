import {Exercise} from './exercise.model';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {UiService} from '../shared/ui.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService{
  private availableExercises: Exercise[] = [];
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExerciseChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService){}

  fetchAvailableExercises(){
    this.uiService.loadingStateChange.next(true);
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docsArray => {
        return docsArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data() as Exercise
          };
        });
      })).subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.uiService.loadingStateChange.next(false);
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.loadingStateChange.next(false);
        this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string){

   // this.db.doc(`availableExercises/${selectedId}`).update({lastSelected: new Date()});

    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise(){
    this.addDataToDatabase({...this.runningExercise,
      date: new Date(),
      state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number){
    this.addDataToDatabase({...this.runningExercise,
      duration: this.runningExercise.duration * (progress/100),
      calories: this.runningExercise.calories * (progress/100),
      date: new Date(),
      state: 'cancelled' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(){
    return {...this.runningExercise};
  }

  fetchCompletedOrCanceledExercises(){
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExerciseChanged.next(exercises);
      }));
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
