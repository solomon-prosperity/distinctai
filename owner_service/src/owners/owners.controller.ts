import {
  Controller,
  Get,
  // Post,
  Body,
  Put,
  // Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  // ApiQuery,
  ApiBody,
  // ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OwnersService } from './owners.service';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { AuthGuard } from '@nestjs/passport';
import { Owner } from './interfaces/owner.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Owners')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard())
@Controller('/v1/owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @ApiOperation({ summary: 'Get an owner' })
  @Get('me')
  async getOwner(@CurrentUser() currentUser: Owner) {
    const response = await this.ownersService.getOwner(currentUser.id);
    return {
      response: response,
      message: 'Owner retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update an owner profile' })
  @ApiBody({ type: UpdateOwnerDto })
  @Put('me')
  async updateProfile(
    @CurrentUser() currentUser: Owner,
    @Body() payload: UpdateOwnerDto,
  ) {
    const response = await this.ownersService.updateProfile(
      currentUser.id,
      payload,
    );
    return {
      response: response,
      message: 'Owner updated successfully!',
    };
  }
}
