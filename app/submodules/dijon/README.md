# Relish Dijon Library
**Framework for HTML5 Game Dev with Phaser**

 **Importing**
 ----------
*Development*: include a `<script src="path/to/build/dijon.js"></script>` somewhere in your index.html page, before the script tag for your game, and after the script tag for Phaser.

*Production*: `build/dijon.js` or `build/dijon.min.js` in your build pipeline, before your game's main js file, and after the phaser.js file.

**Usage**
----------
Usually, you will want to make an extension of [`Application`](./classes/application.html) to bootstrap your game. [Application](./classes/application.html) is a singleton, and can be accessed anywhere in your code using [Application.getInstance()](./classes/application.html#getinstance). It is responsible for creating the Game instance, and sending the game to its boot state.

**Building**
----------
If you want to make changes to the library, you can, but remember, many games use this framework!

To build the framework:
- open a terminal from the framework's root folder
- run `npm install` 
- make changes
- run 'gulp compile' to re-compile the framework
- run 'gulp docs' to re-generate the docs
