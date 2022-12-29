import { TestBed } from '@angular/core/testing';

import { CoordinatesChangesService } from './coordinates-changes.service';

describe('CoordinatesChangesService', () => {
  let service: CoordinatesChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordinatesChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
