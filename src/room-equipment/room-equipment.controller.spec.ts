import { Test, TestingModule } from '@nestjs/testing';
import { RoomEquipmentController } from './room-equipment.controller';

describe('RoomEquipmentController', () => {
  let controller: RoomEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomEquipmentController],
    }).compile();

    controller = module.get<RoomEquipmentController>(RoomEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
