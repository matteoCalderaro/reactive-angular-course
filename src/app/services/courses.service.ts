import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {
    console.log("course service instantiates");
  }
  loadAllCourses(): Observable<Course[]> {
    return this.http.get("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }
  saveCourse(courseId: string, changes: Partial<Course>) {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
