import { expect, test, describe, beforeEach } from "vitest";
import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Create Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakerHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher);
  });

  test("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "romeu soares",
      email: "romeusoares@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  test("should hash student password open registration", async () => {
    const result = await sut.execute({
      name: "romeu soares",
      email: "romeusoares@gmail.com",
      password: "123456",
    });

    const hashedPassword = await fakerHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
