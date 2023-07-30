import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesStore: CoursesStore
  ) // private coursesService: CoursesService,
  // THE LOADER IS NOT INVOKED BECAUSE THE DATA ARE SAVED IN AN OPTIMISTIC WAY WITHOUT WAITING FOR AN HTTP CALL
  // IF A LOADER WOULD BE NEEDED, IT IS NOW DEFINED IN THE COURSES STORE
  // private loadingService: LoadingService,
  //private messagesService: MessagesService
  {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });

    //this.loadingService.loadingOn();
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    // const saveCourse$ = this.coursesService
    //   .saveCourse(this.course.id, changes)
    //   .pipe(
    //     catchError((err) => {
    //       const message = "Could not save course";
    //       this.messagesService.showErrors(message);
    //       console.log(message, err);
    //       return throwError(err);
    //     })
    //   );
    // THE LOADER IS NOT INVOKED BECAUSE THE DATA ARE SAVED IN AN OPTIMISTIC WAY WITHOUT WAITING FOR AN HTTP CALL
    // this.loadingService
    //   .showLoaderUntilComplete(saveCourse$)
    //   .subscribe((val) => this.dialogRef.close(val));

    this.coursesStore
      .saveCourse(this.course.id, changes)
      // MOVING THE ERROR TO THE STORE BECAUSE THE DIALOG CLOSE IMMEDIATLY AFTER THE CLICK ON THE SAVE BUTTON)
      // .pipe(
      //   catchError((err) => {
      //     const message = "Could not save course";
      //     this.messagesService.showErrors(message);
      //     console.log(message, err);
      //     return throwError(err);
      //   })
      // )
      .subscribe();
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }
}
