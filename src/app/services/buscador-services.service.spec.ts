import { TestBed } from '@angular/core/testing';

import { BuscadorServicesService } from './buscador-services.service';

describe('BuscadorServicesService', () => {
  let service: BuscadorServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscadorServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
