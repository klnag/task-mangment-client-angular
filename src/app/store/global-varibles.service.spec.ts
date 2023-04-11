import { TestBed } from '@angular/core/testing';

import { GlobalVariblesService } from './global-varibles.service';

describe('GlobalVariblesService', () => {
  let service: GlobalVariblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalVariblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
