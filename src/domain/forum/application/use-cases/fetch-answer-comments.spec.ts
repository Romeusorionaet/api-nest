import { expect, test, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comment-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments ", () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  test("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "Romeu soares" });

    studentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(comment1);

    await inMemoryAnswerCommentsRepository.create(comment2);

    await inMemoryAnswerCommentsRepository.create(comment3);

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: "Romeu soares",
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: "Romeu soares",
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: "Romeu soares",
          commentId: comment3.id,
        }),
      ]),
    );
  });

  test("should be able to fetch paginated answers comments", async () => {
    const student = makeStudent({ name: "Romeu soares" });

    studentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
