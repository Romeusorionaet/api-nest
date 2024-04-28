import { expect, test, describe, beforeEach } from "vitest";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attchments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Get Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  test("should be able to fetch recent questions", async () => {
    const question1 = makeQuestion({
      createdAt: new Date(2024, 0, 23),
    });

    const question2 = makeQuestion({
      createdAt: new Date(2024, 0, 20),
    });

    const question3 = makeQuestion({
      createdAt: new Date(2024, 0, 18),
    });

    await inMemoryQuestionsRepository.create(question1);
    await inMemoryQuestionsRepository.create(question2);
    await inMemoryQuestionsRepository.create(question3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: question1.createdAt }),
      expect.objectContaining({ createdAt: question2.createdAt }),
      expect.objectContaining({ createdAt: question3.createdAt }),
    ]);
  });

  test("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion({}));
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
