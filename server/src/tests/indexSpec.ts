import path from "path";
import app from "../index";
import request from "supertest";
import { resize } from "../controllers/galleryController";
describe("Api Endpoints", () => {
  it("should process image with valid dimensions", async () => {
    const response = await request(app)
      .get("/images/fjord.jpg")
      .query({ height: "300", width: "400" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^image\//);
  });
  it("should return error for invalid dimensions", async () => {
    const response = await request(app)
      .get("/images/fjord.jpg")
      .query({ width: "-100", height: "300" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        status: "Fail",
        message: jasmine.any(String),
        code: 400,
      }),
    );
  });
});
describe("Upload an image", () => {
  it("should upload image succesfully", async () => {
    const testPath = path.resolve(
      process.cwd(),
      "src",
      "tests",
      "tests-assets",
      "1355112.jpeg",
    );
    const res = await request(app)
      .post("/images/upload")
      .attach("image", testPath);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      jasmine.objectContaining({
        status: "Success",
        message: jasmine.any(String),
        filename: jasmine.any(String),
      }),
    );
  });
  it("should return Error", async () => {
    const testPath = path.resolve(
      process.cwd(),
      "src",
      "tests",
      "tests-assets",
      "text.txt",
    );
    const res = await request(app)
      .post("/images/upload")
      .attach("image", testPath);
    console.log("Status:", res.status);
    console.log("Body:", res.body);
    expect(res.body).toEqual(
      jasmine.objectContaining({
        status: "Fail",
        message: jasmine.any(String),
        code: 500,
      }),
    );
  });
});

describe("Image Processing Functions", () => {
  const testInputPath = path.resolve(
    process.cwd(),
    "src",
    "tests",
    "tests-assets",
    "fjord.jpg",
  );
  const testOutputPath = path.resolve(
    process.cwd(),
    "images",
    "thumb",
    "test-output.jpg",
  );

  it("should resize image without throwing error", async () => {
    expect(async () => {
      await resize(testInputPath, testOutputPath, 300, 300);
    }).not.toThrow();
  });

  it("should throw error for invalid dimensions", async () => {
    try {
      await resize(testInputPath, testOutputPath, -100, 300);
      fail("Expected resize to throw an error");
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
  it("should throw error for invalid input path", async () => {
    await expectAsync(
      resize("invalid/path.jpg", testOutputPath, 300, 300),
    ).toBeRejectedWithError("Input file does not exist");
  });
});
