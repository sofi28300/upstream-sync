import { removeHtmlTags } from "./parse";

describe("removeHtmlTags", () => {
  it("removes simple HTML tags", () => {
    expect(removeHtmlTags("<p>Test</p>")).toBe("Test");
  });

  it("removes multiple HTML tags", () => {
    expect(removeHtmlTags("<div><p>Test</p><p>String</p></div>")).toBe(
      "Test String"
    );
  });

  it("removes nested HTML tags", () => {
    expect(removeHtmlTags("<div><span>Test</span></div>")).toBe("Test");
  });

  it("handles string without HTML tags", () => {
    expect(removeHtmlTags("No HTML tags")).toBe("No HTML tags");
  });

  it("handles empty string", () => {
    expect(removeHtmlTags("")).toBe("");
  });

  it("removes HTML tags leaving the content intact", () => {
    expect(removeHtmlTags("<h1>Title</h1><p>Description</p>")).toBe(
      "Title Description"
    );
  });
});
