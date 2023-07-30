import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

let counter = 0;

@Injectable()
export class LoadingService implements OnInit {
  id: number;
  private subject = new BehaviorSubject(false);

  loading$: Observable<boolean> = this.subject.asObservable();

  constructor() {
    counter++;
    this.id = counter;
    console.log("loadingServiceInstance", this.id);
  }
  ngOnInit(): void {}

  showLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.subject.next(true);
  }
  loadingOff() {
    this.subject.next(false);
  }
}
