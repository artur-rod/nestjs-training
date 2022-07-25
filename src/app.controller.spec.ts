import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a personal message', () => {
      expect(appController.getHello()).toBe(
        'Artur Rodrigues NestJS Training Project, Github repo: https://github.com/artur-rod/nestjs-training.git',
      );
    });
  });
});
