import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Artur Rodrigues NestJS Training Project, Github repo: https://github.com/artur-rod/nestjs-training.git';
  }
}
