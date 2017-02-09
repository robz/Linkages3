# Linkage Editor
This is a UI for making N-bar linkage systems with one degree of freedom and any number of rotary inputs. Here's an example making Theo Jasen's Strandbeest Linkage:

[![Theo Jasen's Strandbeest Linkage](https://img.youtube.com/vi/3yT5vveeN2A/0.jpg)](https://www.youtube.com/watch?v=3yT5vveeN2A)

Play around with this example here: http://tinyurl.com/gwcuhhr

To run locally, first install [npm](https://www.npmjs.com/), clone this repository, then run:

```
$ npm install
$ npm run-script build
```

Then open `index.html` with a browser (I've only tested in the lastest versions of Chrome). You should see a single, loney rotary input that looks like this:

![Image of basic linkage](http://i1077.photobucket.com/albums/w463/rjnevels/Screen%20Shot%202015-02-22%20at%208.53.07%20PM_zpskplyty5t.png)

Here are the controls so far:
* Press `space` to toggle pause
* When paused:
  * Click and drag a ground vertex to move it around
  * Some ground verticies are used as references for rotary inputs, so dragging them will change the phase the input
  * Hover over any bar*, then press `w` or `s` to change its length
  * To add an additional ground vertex connected to the linkage, click on two different places on the background, then click on a vertex on the linkage
  * To add additional bars, click a bar, or on any two verticies of the linkage, then click once on the background
  * To add a new rotary input, hold down `r` and then click somewhere on the background
  * To delete parts of the linkage, click on a vertex, then press `d`. Note that this only works if other parts of the linkage don't depend on the bars connected to the vertex.
  * To see the path that a vertex traces, click on a vertex, then press `space` to unpause
  * To automatically optimize the linkage to follow a path, click a vertex, then press `o`, then draw the desired path for that vertex. Press `space` to stop the optimization.
  * To select a rotary input, click the vertex that a bar is rotating around
* When unpaused:
  * Press `w` or `s` to increase or decrease the speed of a selected rotary input, or `t` to reverse its direction. If no rotary input is selected, these changes in speed will apply to all of them.

\* any bar except one between a rotary input and its reference vertex

Rotary inputs will automatically reverse if they're about to put the linakge into an impossible configuration.
