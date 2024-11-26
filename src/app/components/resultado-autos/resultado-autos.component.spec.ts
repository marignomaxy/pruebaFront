import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAutosComponent } from './resultado-autos.component';

describe('ResultadoAutosComponent', () => {
  let component: ResultadoAutosComponent;
  let fixture: ComponentFixture<ResultadoAutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoAutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoAutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
