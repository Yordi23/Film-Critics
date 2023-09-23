import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { FilmService } from '../film/film.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private filmService: FilmService,
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

    this.reviewsRepository.merge(review, updateReviewDto);

    return this.reviewsRepository.save(review);
  }

  async delete(id: number): Promise<void> {
    await this.reviewsRepository.delete(id);
  }
}
