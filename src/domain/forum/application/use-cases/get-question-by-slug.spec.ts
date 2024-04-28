import { expect, test, describe, beforeEach } from "vitest";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attchments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  test("should be able to get a question by slug", async () => {
    const student = makeStudent({ name: "Romeu soares" });

    inMemoryStudentsRepository.items.push(student);

    const attachment = makeAttachment({
      title: "Some attachment",
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("title-slug-test"),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: "title-slug-test",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: "Romeu soares",
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    });
    // expect(result.value).toMatchObject({
    //   question: expect.objectContaining({
    //     id: newQuestion.id,
    //   }),
    // });
  });
});
