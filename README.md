# Linkage Editor
This is a UI for making N-bar linkage systems with one degree of freedom and any number of rotary inputs.

To try it out, first install [npm](https://www.npmjs.com/), clone this repository, then run:

```
$ sudo npm install
$ npm run-script build
```

Then open `index.html` with a browser (I've only tested in the lastest versions of Chrome). You should see something like this linkage: 

![Image of basic linkage](http://i1077.photobucket.com/albums/w463/rjnevels/Screen%20Shot%202015-02-16%20at%201.25.01%20PM_zpsesx9hhaj.png)

Here are the controls so far:
* Press `space` to toggle pause
* When paused:
  * Click and drag a ground point to move it around 
  * Hover over any bar*, and press `w` or `s` to change its length
  * To add an additional ground point, click twice at different places on the background, then click on a joint on the linkage
  * To add additional bars, click on a bar, or on two points on the linkage, then click once on the background
* When unpaused:
  * Press `w` or `s` to increase or decrease the speed of the rotary input
  * Press `t` to reverse the direction of the rotary input

\* any bar except ones that are used as references for rotary inputs

The rotary input will automatically reverse if it's about to put the linakge into an impossible configuration.

This is based from my [boilerplate](https://github.com/robz/boilerplate) repository.
