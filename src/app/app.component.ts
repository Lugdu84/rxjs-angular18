import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';

export type CallBackAvecString = (message: string) => void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  observable$!: Observable<string>;
  private subscription = new Subscription();
  ngOnInit() {
    const callBack: CallBackAvecString = (message: string) =>
      console.info(message.toUpperCase());
    console.info('-------------------------');
    // setTimeout(() => {
    //   console.info('0. Async setTimeout');
    // }, 1500);

    //EAGER
    const promise = new Promise<string>((resolve, reject) => {
      console.info('1. Async Promise');

      resolve(' P => Promise resolved');
    }).then(callBack);

    // LAZY
    this.observable$ = new Observable<string>((observer) => {
      console.info('2. Async Observable');
      observer.next('O1 => Observable next');
      setTimeout(() => {
        observer.next('O2 => Observable next');
        observer.complete();
      }, 1500);
    });
    let sub = this.observable$.pipe(takeUntilDestroyed()).subscribe({
      next: callBack,
      complete: () => console.info('O => Observable complete'),
    });

    this.subscription.add(sub);

    console.info('*************************');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
