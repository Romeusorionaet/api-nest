import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStudentsUseCase } from "./authenticate-student";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentsUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakerHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentsUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakeEncrypter,
    );
  });

  test("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "romeu@gmail.com",
      password: await fakerHasher.hash("123456"),
    });

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: "romeu@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
