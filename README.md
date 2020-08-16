# moment-discord

A discord bot for moment

## usage

The quickest way is to just build and run it with docker. Alternatively, you can build the application using `yarn install` and either `yarn dev` for dev mode or `yarn build && yarn start` for production mode.

## syntax

The bot will respond to use of `.roll [number of dice]` or `.r [number of dice]` in your text and give a moment system styled result. You can also follow the number with these commands:

- `burst` or `b` adds the +3 dice from a burst.
- `expertise`, `e`, or `!` adds an extra die for every 6 rolled.
- `initiative [base intiative]` or `i [base intiative]` displays the total initiative result.

The bot ignores casing, spacing, and line breaks, so feel free to get creative.
