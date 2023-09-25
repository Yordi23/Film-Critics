import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreatedUserEvent } from 'apps/shared/events/created-user.event';
import { UpdatedUserEvent } from 'apps/shared/events/updated-user.event';
import { Review } from '../review/review.entity';
import { InteractionType } from '../review/enum/interaction-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        likedReviews: true,
        dislikedReviews: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  create(createdUserEvent: CreatedUserEvent): Promise<User> {
    const newUser = this.usersRepository.create(createdUserEvent);

    return this.usersRepository.save(newUser);
  }

  async update(updatedUserEvent: UpdatedUserEvent): Promise<User> {
    return this.usersRepository.save(updatedUserEvent);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async addLikedReview(user: User, review: Review): Promise<User> {
    return this.addLikeOrDislikedReview(user, review, InteractionType.LIKE);
  }

  async addDislikedReview(user: User, review: Review): Promise<User> {
    return this.addLikeOrDislikedReview(user, review, InteractionType.DISLIKE);
  }

  private async addLikeOrDislikedReview(
    user: User,
    review: Review,
    interactionType: InteractionType,
  ) {
    const isLike = interactionType === InteractionType.LIKE;
    const targetReviewType = isLike ? 'likedReviews' : 'dislikedReviews';
    const oppositeReviewType = isLike ? 'dislikedReviews' : 'likedReviews';

    const existsInteraction = user[targetReviewType].some(
      (existingReview) => existingReview.id === review.id,
    );

    if (existsInteraction) {
      throw new BadRequestException(
        `User already ${interactionType}d this review.`,
      );
    }

    user[targetReviewType] = [...user[targetReviewType], review];

    user[oppositeReviewType] = user[oppositeReviewType].filter(
      (existingReview) => existingReview.id !== review.id,
    );

    return this.usersRepository.save(user);
  }
}
