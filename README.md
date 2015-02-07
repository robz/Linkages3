# Linkage Editor
This is a UI for making N-bar linkage systems with one degree of freedom and any number of rotary inputs.

To try it out, get [npm](https://www.npmjs.com/), clone this repository, then run:

```
$ sudo npm install
$ npm run-script build
```

Then open `index.html` with a broswer (I've only tested in the lastest versions of Chrome). Here are the controls so far:
* Press space to pause
* When paused, click and drag a ground point to move it around
* When paused, hover over any bar*, and press `w` or `s` to change its length
* When not paused, press `w` or `s` to increase or decrease the speed of the rotary input

\* any bar except ones that are derived from extenders

This is based from my [boilerplate](https://github.com/robz/boilerplate) repository.
