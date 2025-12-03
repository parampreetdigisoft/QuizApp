import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStart } from './quiz-start';

describe('QuizStart', () => {
  let component: QuizStart;
  let fixture: ComponentFixture<QuizStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizStart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
