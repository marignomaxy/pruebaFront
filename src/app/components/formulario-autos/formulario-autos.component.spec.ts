import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAutosComponent } from './formulario-autos.component';

describe('FormularioAutosComponent', () => {
  let component: FormularioAutosComponent;
  let fixture: ComponentFixture<FormularioAutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioAutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioAutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
