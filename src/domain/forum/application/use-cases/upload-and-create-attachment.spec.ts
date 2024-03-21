import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attchments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/faker-uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

describe("Upload and create attachment", () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let fakeUploader: FakeUploader;
  let sut: UploadAndCreateAttachmentUseCase;

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  test("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  test("should not be able to upload and attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
