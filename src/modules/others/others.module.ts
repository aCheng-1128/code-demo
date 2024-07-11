import { Module } from '@nestjs/common';
import { OthersController } from './others.cotroller';

@Module({
  controllers: [OthersController],
})
export class OthersModule {}
