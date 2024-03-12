import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachment-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachment-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
