import { expect, test, describe, beforeEach } from "vitest";
import { AnswerQuestionUseCase } from "./answer-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answers-attachment-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  test("should be able to create an answer", async () => {
    const user = makeStudent();

    const result = await sut.execute({
      questionId: "1",
      content: "Nova resposta",
      attachmentsIds: ["id1", "id2"],
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("id1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("id2") }),
      ],
    );
  });
});
