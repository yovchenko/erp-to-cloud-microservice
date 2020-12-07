import { GmailMessage } from "../source/service";
const consoleErr = jest.spyOn(console, "log").mockImplementation();

let createMessage: GmailMessage;

beforeAll(async () => {
  // Initialize an object of GmailMessage class
  createMessage = new GmailMessage(
    "subject",
    "message",
    "volodymyr.yovchenko@gmail.com"
  );
});

describe("verify the console.log is called after a message sent", () => {
  beforeEach(() => {
    consoleErr.mockClear();
  });
  test("should print status OK", () => {
    createMessage.gmailMessage(createMessage);
    expect(console.log).toHaveBeenLastCalledWith("200");
  });
});
