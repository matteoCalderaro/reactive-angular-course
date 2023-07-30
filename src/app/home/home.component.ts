import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore
  ) // private coursesService: CoursesService,
  // private loadingService: LoadingService,
  // private messagesService: MessagesService
  {
    // console.log("loading service home component", this.loadingService.id);
  }

  ngOnInit() {
    this.reloadCourses();
    console.log("rerender home component");
  }
  reloadCourses() {
    // REPLACED BY THE OBSERVABLE WITH LOADING CAPABILITIES
    //this.loadingService.loadingOn();

    // const courses$ = this.coursesService.loadAllCourses().pipe(
    //   map((courses) => courses.sort(sortCoursesBySeqNo)),
    //   finalize(() => this.loadingService.loadingOff())
    // );

    // OBSERVABLE WITH LOADING CAPABILITIES
    // const loadCourses$ = this.coursesService.loadAllCourses().pipe(
    //   map((courses) => courses.sort(sortCoursesBySeqNo)),
    //   catchError((err) => {
    //     const message = "Could not load courses";
    //     this.messagesService.showErrors(message);
    //     console.log(message, err);
    //     return throwError(err);
    //   })
    // );

    // const courses$ = this.loadingService.showLoaderUntilComplete(loadCourses$);

    this.beginnerCourses$ = this.coursesStore.selectByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStore.selectByCategory("ADVANCED");
  }
}
