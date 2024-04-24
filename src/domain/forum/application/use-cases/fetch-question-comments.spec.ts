import { expect, test, describe, beforeEach } from "vitest";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments ", () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    );

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  test("should be able to fetch question comments", async () => {
    const student = makeStudent({ name: "Romeu soares" });

    studentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment1);

    await inMemoryQuestionCommentsRepository.create(comment2);

    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: "question-1",
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

  test("should be able to fetch paginated questions comments", async () => {
    const student = makeStudent({ name: "Romeu soares" });

    studentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
