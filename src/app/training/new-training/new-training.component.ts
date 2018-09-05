import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Exercise} from '../exercise.model';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  availableExercise: Exercise[];
  exerciseSubscription: Subscription;
  isLoadingAvailableExercises = true;
  isLoadingAvailableExercisesChanged: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UiService) { }

  ngOnInit() {
    this.isLoadingAvailableExercisesChanged = this.uiService.loadingStateChange.subscribe(changed => {
      this.isLoadingAvailableExercises = changed;
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.availableExercise = exercises);
    this.fetchExercises();
  }

  ngOnDestroy(){
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.isLoadingAvailableExercisesChanged) {
      this.isLoadingAvailableExercisesChanged.unsubscribe();
    }
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

}
