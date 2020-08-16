# moment-discord

A discord bot for moment

## usage

The quickest way is to just build and run it with Docker. Alternatively, you can build the application using `yarn install` and either `yarn dev` for dev mode or `yarn build && yarn start` for production mode.

You'll need to acquire your own [bot token](https://www.writebots.com/discord-bot-token/#:~:text=A%20Discord%20Bot%20Token%20is,generate%20a%20Discord%20Bot%20Token.) from Discord and add it to a `.env` file as the `TOKEN` variable for it to work.

## syntax

The bot will respond to use of `.roll [number of dice]` or `.r [number of dice]` in your text and give a moment styled result. You can also follow the number with these commands:

- `burst` or `b` adds the +3 dice from a burst.
- `expertise`, `e`, or `!` adds an extra die for every 6 rolled.
- `initiative [base intiative]` or `i [base intiative]` displays the total initiative result.

You can also use math to define either number and let the bot handle all your modifiers. For example, if your character is resisting an influence that goes against one of their Passions and favors two others and you want to burst, you can write `.r6+3-5b`.

The commands can be added in any order and the bot ignores casing, spacing, and line breaks. So feel free to get creative.
