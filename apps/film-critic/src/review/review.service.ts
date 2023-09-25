import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { FilmService } from '../film/film.service';
import { UserService } from '../user/user.service';
import { InteractionType } from './enum/interaction-type.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private filmService: FilmService,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const film = await this.filmService.findOneById(createReviewDto.film);

    const newReview = this.reviewsRepository.create({
      ...createReviewDto,
      film,
      author: { id: createReviewDto.author },
    });

    return this.reviewsRepository.save(newReview);
  }

  findAll(): Promise<Review[]> {
    return this.reviewsRepository.find();
  }

  async findOneById(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOneBy({ id });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOneById(id);

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

  async delete(id: number): Promise<void> {
    await this.reviewsRepository.delete(id);
  }
}
