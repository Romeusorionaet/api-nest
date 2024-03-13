import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return questionAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { answerId },
    });
  }
}
