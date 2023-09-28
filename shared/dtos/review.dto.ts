import { FilmDto } from './film.dto';
import { UserDto } from './user.dto';

export class ReviewDto {
  id: number;
  body: string;
  author: UserDto;
  film: FilmDto;
  rating: number;
  likes: number;
  dislikes: number;
}
