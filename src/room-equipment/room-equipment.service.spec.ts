import { Test, TestingModule } from '@nestjs/testing';
import { RoomEquipmentService } from './room-equipment.service';

describe('RoomEquipmentService', () => {
  let service: RoomEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomEquipmentService],
    }).compile();

    service = module.get<RoomEquipmentService>(RoomEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
