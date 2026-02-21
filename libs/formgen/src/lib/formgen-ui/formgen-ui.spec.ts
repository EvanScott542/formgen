import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormgenUi } from './formgen-ui';

describe('FormgenUi', () => {
  let component: FormgenUi;
  let fixture: ComponentFixture<FormgenUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormgenUi],
    }).compileComponents();

    fixture = TestBed.createComponent(FormgenUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
