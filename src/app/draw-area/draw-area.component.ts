import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { buffer, debounceTime, delay, filter, fromEvent, map, tap } from 'rxjs';
import { Queue } from '../classes/queue';

@Component({
  selector: 'app-draw-area',
  templateUrl: './draw-area.component.html',
  styleUrls: ['./draw-area.component.css'],
})
export class DrawAreaComponent implements OnInit {
  @ViewChild('playground') playground!: ElementRef;

  deletionQueue = new Queue();

  isDrawing = false;
  currentSquare?: HTMLDivElement;
  currentSquareOrigin = {
    x: 0,
    y: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  drawStart(event: MouseEvent | TouchEvent) {
    const drawingInPlayground = event.target === this.playground.nativeElement;

    console.warn(event.target)
    if (drawingInPlayground) {
      this.isDrawing = true;

      this.squareCreationHandler(event);
      this.setSquareDeletionOnDoubleClick();
      this.playground.nativeElement.appendChild(this.currentSquare);
    }
  }

  private squareCreationHandler(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      this.createNewSquare(event.x, event.y);
    } else {
      this.createNewSquare(event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  private createNewSquare(x: number, y: number) {
    this.currentSquareOrigin.x = x;
    this.currentSquareOrigin.y = y;
    this.currentSquare = document.createElement('div');
    this.currentSquare.style.top = `${y}px`;
    this.currentSquare.style.left = `${x}px`;
    this.currentSquare.style.backgroundColor = this.getRandomColor();
    this.currentSquare.style.position = 'absolute';
  }

  private getRandomColor() {
    return `rgb(${Math.trunc(Math.random() * 256)},${Math.trunc(
      Math.random() * 256
    )},${Math.trunc(Math.random() * 256)})`;
  }

  private setSquareDeletionOnDoubleClick() {
    const oneSecond = 1000;
    const clicks$ = fromEvent(this.currentSquare!, 'click');

    clicks$
      .pipe(
        buffer(clicks$.pipe(debounceTime(250))),
        filter((clickArray: any) => clickArray.length > 1),
        map((clickArray: any) => clickArray.pop()),
        tap((event: Event) => {
          this.rotateSquare(event.target as HTMLDivElement);
          this.deletionQueue.enqueue(event.target as HTMLDivElement);
        }),
        delay(oneSecond),
        tap(this.squareDeletion)
      )
      .subscribe();
  }

  private rotateSquare(target: HTMLDivElement) {
    target.style.transform = 'rotate(360deg)';
    target.style.transitionDuration = '1s';
  }

  private squareDeletion = (event: Event) => {
    if (this.deletionQueue.getQueueLength() === 0) {
      const notYetDeleted = Array.from(
        this.playground.nativeElement.childNodes
      ).includes(event.target);

      if (notYetDeleted) {
        this.playground.nativeElement.removeChild(
          event.target as HTMLDivElement
        );
      }
    } else {
      setTimeout(() => {
        this.squareDeletion(event);
      }, 10);
    }
  };

  drawMove(x: number, y: number, event: Event) {
    event.preventDefault();
    if (this.isDrawing) {
      const widthValue = x - this.currentSquareOrigin.x;
      const heightValue = y - this.currentSquareOrigin.y;

      if (widthValue >= 0) {
        this.positiveWidthHandler(widthValue);
      } else {
        this.negativeWidthHandler(widthValue);
      }

      if (heightValue >= 0) {
        this.positiveHeightHandler(heightValue);
      } else {
        this.negativeHeightHandler(heightValue);
      }
    }
  }

  private positiveWidthHandler(widthValue: number) {
    this.currentSquare!.style.left = `${this.currentSquareOrigin.x}px`;
    this.currentSquare!.style.width = `${widthValue}px`;
  }

  private negativeWidthHandler(widthValue: number) {
    this.currentSquare!.style.left = `${
      this.currentSquareOrigin.x - Math.abs(widthValue)
    }px`;
    this.currentSquare!.style.width = `${Math.abs(widthValue)}px`;
  }

  private positiveHeightHandler(heightValue: number) {
    this.currentSquare!.style.top = `${this.currentSquareOrigin.y}px`;
    this.currentSquare!.style.height = `${heightValue}px`;
  }

  private negativeHeightHandler(heightValue: number) {
    this.currentSquare!.style.top = `${
      this.currentSquareOrigin.y - Math.abs(heightValue)
    }px`;
    this.currentSquare!.style.height = `${Math.abs(heightValue)}px`;
  }

  drawEnd() {
    this.isDrawing = false;
    this.currentSquare = undefined;
  }
}
