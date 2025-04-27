import path from "path";
import app from "../index";
import request from "supertest";
describe("Return image with speciefic path", () => {
  it("should return img with name jford", async () => {
    const response = await request(app).get("/images/fjord.jpg");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^image\//);
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
