# Pong on ECSY

A Pong implementation utilizing [ECSY](ecsy.io).

## About

This was made as a little hobbyist project for studying the ECS architecure, Typescript, HTML5 canvas and game development.

I didn't implement an end-game status, so this is pretty much an endless Pong game! 😁

## Playing

[You can play it here, on Github Pages](https://ligabloo.github.io/pong-ecsy/) - just follow the instructions on the site and you're good to go!

## Running the project

This project uses Parcel for bundling. Clone this repository, open the folder on terminal and run `npm start`. Parcel will give you a nice local server that will watch and reload for every change you make!

## Building

To build the project, run the `build` npm script using the command `npm run build`.

**Note**: currently the build has a bug in which the assets paths on `index.html` are prefixed with a trailing `/` - so if you host the project anywhere else that not a root directory (for example: a Github Pages website 🙄), you'll need to remove those slashes yourself. Fixes are welcome!

## Contact the author

If you have any questions about the code, the project, life or anything else, you can contact-me via [e-mail](mailto:matheus.s.ligabue@gmail.com) or [twitter](https://twitter.com/ligabloo).
