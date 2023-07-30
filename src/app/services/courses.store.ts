import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MessagesService } from "../messages/messages.service";
import { LoadingService } from "../loading/loading.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore implements OnInit {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),

      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilComplete(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>) {
    const courses = this.subject.getValue();
    const courseToChange = courses.findIndex((course) => course.id == courseId);
    const newCourse = {
      ...courses[courseToChange],
      ...changes,
    };

    const newCourses = courses.slice(0);
    newCourses[courseToChange] = newCourse;

    this.subject.next(newCourses);

    return this.http.put("/api/courses/courseId", changes).pipe(
      catchError((err) => {
        const error = "Cannot save the course";
        this.messagesService.showErrors(error);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  selectByCategory(category: string): Observable<Course[]> {
    console.log("call store");
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  ngOnInit() {}
}
