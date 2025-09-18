import { Test, TestingModule } from '@nestjs/testing';
import { BookingHandlerService } from './booking.service';

describe('BookingService', () => {
  let service: BookingHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingHandlerService],
    }).compile();

    service = module.get<BookingHandlerService>(BookingHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
