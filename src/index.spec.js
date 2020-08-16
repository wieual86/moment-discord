import "./index";

jest.mock("dotenv", () => ({ config: jest.fn() }));
const { config } = require("dotenv");

jest.mock("discord.js", () => {
  const Client = {
    login: jest.fn(),
    on: jest.fn(),
    user: { tag: "testTag" }
  };
  return {
    Client: function () {
      return Client;
    }
  };
});
const Discord = require("discord.js");

jest.mock("mathjs", () => ({ evaluate: jest.fn(), randomInt: jest.fn() }));
const { evaluate, randomInt } = require("mathjs");

global.console = { info: jest.fn() };

describe("index", () => {
  const client = new Discord.Client();
  const messageFunction = client.on.mock.calls.find(item => item[0] === "message")[1];
  const authorId = "testAuthorId";
  const rollCount = 4;
  const successRegex = /\*\*(\d+)\*\*/;
  const diceRegex = /\((\d+(?:, \d+)*)/;

  const createMessage = (roll, dm) => ({
    content: roll,
    author: { id: authorId, send: jest.fn() },
    channel: { type: dm ? "dm" : "other", send: jest.fn() }
  });

  beforeEach(() => {
    randomInt.mockReset();
    randomInt.mockReturnValue(3).mockReturnValueOnce(5).mockReturnValueOnce(4);
    evaluate.mockImplementation(item => item);
  });

  test("start up", () => {
    const readyFunction = client.on.mock.calls.find(item => item[0] === "ready")[1];

    readyFunction();

    expect(config.mock.calls.length).toEqual(1);
    expect(client.login.mock.calls.length).toEqual(1);
    expect(global.console.info.mock.calls[0][0].includes(client.user.tag)).toEqual(true);
  });

  test("basic roll", () => {
    const message = createMessage(`.r${rollCount}`);

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2);
    expect(dice.length).toEqual(rollCount);
  });

  test("burst roll", () => {
    const message = createMessage(`.r${rollCount}b`);

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2);
    expect(dice.length).toEqual(rollCount + 3);
  });

  test("expertise roll", () => {
    const message = createMessage(`.r${rollCount}!`);

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2);
    expect(dice.length).toEqual(rollCount + 1);
  });

  test("initiative roll", () => {
    const baseInitiative = 3;
    const message = createMessage(`.r${rollCount}i${baseInitiative}`);

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2 + baseInitiative);
    expect(dice.length).toEqual(rollCount);
    expect(response.includes("initiative")).toEqual(true);
    expect(response.includes(`${baseInitiative} base`)).toEqual(true);
  });

  test("dm roll", () => {
    const message = createMessage(`.r${rollCount}`, true);

    messageFunction(message);

    const response = message.author.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2);
    expect(dice.length).toEqual(rollCount);
    expect(response.includes(authorId)).toEqual(true);
  });

  test("no roll", () => {
    const message = createMessage("Wrong");

    messageFunction(message);

    expect(message.channel.send.mock.calls.length).toEqual(0);
  });

  test("too few dice", () => {
    const message = createMessage(".r0");

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];

    expect(response.includes("fail")).toEqual(true);
  });

  test("too many dice", () => {
    const message = createMessage(".r10000");

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];

    expect(response.includes("exceed")).toEqual(true);
  });

  test("error", () => {
    const message = createMessage(`.r${rollCount}`);
    evaluate.mockImplementation(() => {
      throw new Error("test error");
    });

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];

    expect(response.includes("expression")).toEqual(true);
  });
});
