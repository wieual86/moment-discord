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

const successRegex = /\*\*(\d+)\*\*/;
const diceRegex = /\((\d+(?:, \d+)*)/;

describe("index", () => {
  evaluate.mockImplementation(item => item);
  randomInt.mockReturnValue(3).mockReturnValueOnce(5).mockReturnValueOnce(4);
  const client = new Discord.Client();
  const messageFunction = client.on.mock.calls.find(item => item[0] === "message")[1];
  const authorId = "testAuthorId";

  beforeEach(() => {
    randomInt.mockClear();
  });

  test("start up", () => {
    expect(config.mock.calls.length).toEqual(1);
    expect(client.login.mock.calls.length).toEqual(1);
    expect(client.on.mock.calls.findIndex(item => item[0] === "ready") > -1).toEqual(true);
  });

  test("basic roll", () => {
    const roll = ".r4";
    const message = { content: roll, author: { id: authorId }, channel: { send: jest.fn() } };

    messageFunction(message);

    const response = message.channel.send.mock.calls[0][0];
    const success = parseInt(response.match(successRegex)[1]);
    const dice = response.match(diceRegex)[1].split(", ");

    expect(success).toEqual(2);
    expect(dice.length).toEqual(4);
  });
});
