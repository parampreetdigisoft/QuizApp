import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTable } from './quiz-table';

describe('QuizTable', () => {
  let component: QuizTable;
  let fixture: ComponentFixture<QuizTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
