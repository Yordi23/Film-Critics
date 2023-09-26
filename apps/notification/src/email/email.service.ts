import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';

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
}
