import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqforumComponent } from './faqforum.component';

describe('FaqforumComponent', () => {
  let component: FaqforumComponent;
  let fixture: ComponentFixture<FaqforumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqforumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqforumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
