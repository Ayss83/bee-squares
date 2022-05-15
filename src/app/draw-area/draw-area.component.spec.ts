import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAreaComponent } from './draw-area.component';

describe('DrawAreaComponent', () => {
  let component: DrawAreaComponent;
  let fixture: ComponentFixture<DrawAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawAreaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('drawMove', () => {
    beforeEach(() => {
      const div = document.createElement('div');
      component.currentSquare = div;
      component.currentSquareOrigin.x = 10;
      component.currentSquareOrigin.y = 50;
      component.isDrawing = true;
    });

    it('should set expected style values (right down quarter from origin)', () => {
      component.drawMove(50, 100, new Event(''));

      expect(component.currentSquare?.style.width).toBe('40px');
      expect(component.currentSquare?.style.height).toBe('50px');
      expect(component.currentSquare?.style.top).toBe('50px');
      expect(component.currentSquare?.style.left).toBe('10px');
    });

    it('should set expected style values (right upper quarter from origin)', () => {
      component.drawMove(60, 10, new Event(''));

      expect(component.currentSquare?.style.width).toBe('50px');
      expect(component.currentSquare?.style.height).toBe('40px');
      expect(component.currentSquare?.style.top).toBe('10px');
      expect(component.currentSquare?.style.left).toBe('10px');
    });

    it('should set expected style values (left down quarter from origin)', () => {
      component.drawMove(5, 90, new Event(''));

      expect(component.currentSquare?.style.width).toBe('5px');
      expect(component.currentSquare?.style.height).toBe('40px');
      expect(component.currentSquare?.style.top).toBe('50px');
      expect(component.currentSquare?.style.left).toBe('5px');
    });

    it('should set expected style values (left upper quarter from origin)', () => {
      component.drawMove(5, 10, new Event(''));

      expect(component.currentSquare?.style.width).toBe('5px');
      expect(component.currentSquare?.style.height).toBe('40px');
      expect(component.currentSquare?.style.top).toBe('10px');
      expect(component.currentSquare?.style.left).toBe('5px');
    });
  });
});
