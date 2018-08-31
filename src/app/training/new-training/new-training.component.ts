import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter<void>();

  availableExercise: Exercise[] = [];

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.availableExercise = this.trainingService.getAvailableExercises();
  }

  onStartTraining(){
    this.trainingStart.emit();
  }

}
