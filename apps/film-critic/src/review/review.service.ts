import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Equal, Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { FilmService } from '../film/film.service';
import { UserService } from '../user/user.service';
import { InteractionType } from './enum/interaction-type.enum';
import { Context } from 'shared/types/context';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private filmService: FilmService,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = await this.reviewsRepository.findOneBy({
      author: Equal(createReviewDto.author),
      film: Equal(createReviewDto.film),
    });

    if (review) {
      throw new BadRequestException('User already has a review for this film.');
    }

    const film = await this.filmService.findOneById(createReviewDto.film);
    const newReview = this.reviewsRepository.create({
      ...createReviewDto,
      film,
      author: { id: createReviewDto.author },
    });

    return this.reviewsRepository.save(newReview);
  }

  findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: { author: true } });
  }

  async findOneById(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    ctx: Context,
  ): Promise<Review> {
    const review = await this.findOneById(id);

    if (review.author.id !== ctx.user.id) {
      throw new ForbiddenException(
        "User is only able to modify it's own reviews",
      );
    }

    return this._update(review, updateReviewDto);
  }

  private async _update(
    review: Review,
    updateDto: Partial<Review>,
  ): Promise<Review> {
    this.reviewsRepository.merge(review, updateDto);
    return this.reviewsRepository.save(review);
  }

  async like(id: number, userId: number): Promise<Review> {
    return this.likeOrDislike(id, userId, InteractionType.LIKE);
  }

  async dislike(id: number, userId: number): Promise<Review> {
    return this.likeOrDislike(id, userId, InteractionType.DISLIKE);
  }

  private async likeOrDislike(
    id: number,
    userId: number,
    interactionType: InteractionType,
  ) {
    const review = await this.findOneById(id);
    const user = await this.userService.findOneById(userId);

    const isLike = interactionType === InteractionType.LIKE;
    const targetInteractionType = isLike ? 'likes' : 'dislikes';
    const oppositeInteractionType = isLike ? 'dislikes' : 'likes';
    const oppositeReviewType = isLike ? 'dislikedReviews' : 'likedReviews';

    const existsOppositeInteraction = user[oppositeReviewType].some(
      (existingReviewInteraction) => existingReviewInteraction.id === review.id,
    );

    if (interactionType === InteractionType.LIKE) {
      await this.userService.addLikedReview(user, review);
    } else {
      await this.userService.addDislikedReview(user, review);
    }

    const updateDto = {
      [targetInteractionType]: review[targetInteractionType] + 1,
    };

    if (existsOppositeInteraction) {
      updateDto[oppositeInteractionType] = review[oppositeInteractionType] - 1;
    }

    return this._update(review, updateDto);
  }

  async delete(id: number, ctx: Context): Promise<void> {
    const review = await this.findOneById(id);

    if (review.author.id !== ctx.user.id) {
      throw new ForbiddenException(
        "User is only able to modify it's own reviews",
      );
    }
    await this.reviewsRepository.softDelete(id);
  }
}
