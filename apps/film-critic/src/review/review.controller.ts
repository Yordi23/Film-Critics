import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Review } from '../review/review.entity';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AuthGuard } from 'apps/auth/src/auth/guards/auth.guard';
import { CurrentUser } from 'apps/auth/src/auth/decorators/current-user.decorator';
import { JwtPayloadDto } from 'apps/auth/src/auth/dtos/jwt-payload.dto';

@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<Review> {
    return this.reviewService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: JwtPayloadDto,
  ): Promise<Review> {
    createReviewDto.author = user.id;

    return this.reviewService.create(createReviewDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.reviewService.delete(id);
  }
}
