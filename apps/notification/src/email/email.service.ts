import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';
import { LikedReviewDto } from './dtos/liked-review.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendWelcomeEmail(welcomeEmailDto: WelcomeEmailDto) {
    await this.mailerService.sendMail({
      to: welcomeEmailDto.email,
      subject: 'Welcome to Film Critics!',
      template: './welcome',
      context: {
        name: welcomeEmailDto.name,
        profilePicture: welcomeEmailDto.profilePicture,
      },
    });
  }

  public async sendLikedReviewEmail(likedReviewDto: LikedReviewDto) {
    await this.mailerService.sendMail({
      to: likedReviewDto.email,
      subject: 'Review Liked - Film Critics',
      template: './liked-review',
      context: {
        name: likedReviewDto.name,
        profilePicture: likedReviewDto.profilePicture,
        reviewBody: likedReviewDto.reviewBody,
        likes: likedReviewDto.likes,
        filmName: likedReviewDto.filmName,
      },
    });
  }
}
