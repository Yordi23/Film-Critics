import { FilmDto } from 'shared/dtos/film.dto';
import { ReviewDto } from 'shared/dtos/review.dto';
import { UserDto } from 'shared/dtos/user.dto';

export class LikedReviewEvent {
  constructor(review: ReviewDto) {
    const film = review.film;
    const author = review.author;

    this.id = review.id;
    this.body = review.body;
    this.film = {
      id: film.id,
      name: film.name,
      picture: film.picture,
      plot: film.plot,
      year: film.year,
    };
    this.likes = review.likes;
    this.rating = review.rating;
    this.author = {
      id: author.id,
      email: author.email,
      name: author.name,
      profilePicture: author.profilePicture,
    };
  }

  readonly id: number;
  readonly body: string;
  readonly likes: number;
  readonly dislikes: number;
  readonly film: FilmDto;
  readonly rating: number;
  readonly author: UserDto;
}
