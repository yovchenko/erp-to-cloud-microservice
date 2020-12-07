import { GmailMessage } from "../source/service";
const consoleSpy = jest.spyOn(console, "log").mockImplementation();

let createMessage: GmailMessage;

beforeAll(async () => {
  // Initialize an object of GmailMessage class
  createMessage = new GmailMessage(
    "subject",
    "message",
    "volodymyr.yovchenko@gmail.com"
  );
});

describe("Verify the console.log is called after a message sent", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });
  test("should print status OK", () => {
    createMessage.gmailMessage(createMessage);
    expect(console.log).toHaveBeenLastCalledWith("200");
  });
});
