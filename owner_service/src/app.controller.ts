import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    const response = this.appService.getHello();
    return { response, message: 'Welcome to Distinct AI Owner Service' };
  }
}
