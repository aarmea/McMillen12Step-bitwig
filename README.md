McMillen Instruments 12 Step for Bitwig Studio
==============================================

An __unofficial__ script to trigger clips in Bitwig Studio using the [McMillen
Instruments 12 Step](http://www.keithmcmillen.com/products/12-step/).

Setup
-----

0. Connect your 12 Step and install the drivers.

1. Put your 12 Step in the default chromatic mode. (This is normally the one
   that is active when you first plug it in.)

2. Clone this repository into the Bitwig Controller Scripts directory:

  * Windows: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts`
  * Mac: `~/Documents/Bitwig Studio/Controller Scripts`
  * Linux: `~/Bitwig Studio/Controller Scripts`

3. Open Bitwig Studio.

4. In [Bitwig preferences]/Controllers, click "Detect available controllers".
   Your 12 step should be automatically added.

5. Change Bitwig to Mix mode, add up to 10 tracks, and record enable these
   tracks.

Usage
-----

The basic idea behind this controller script is to combine Bitwig Studio and
MIDI foot pedals into a powerful alternative to a standalone looper pedal by
mapping the Bitwig equivalents of common looper pedal controls to the pedals.

The 12 Step's default chromatic mode is a simple one octave keyboard starting at
C4 (MIDI note 48):

```
 _______________________________
|  |C| |C|  |  |S| |S| |P|  |   |
|  |9| |1|  |  |T| |C| |G|  |   |
|  | | |0|  |  | | | | | |  |   |
|  |_| |_|  |  |_| |_| |_|  |   |
| C | C | C | C | C | C | C | C |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|___|___|___|___|___|___|___|___|
```

### Clip control

Clip control is done using all of the white keys and C# and D#. Each key
corresponds to a clip on the currently selected scene (as mapped above with Cx,
where x is the track the clip is on).

* To start recording a clip for the first time, tap its key once. When you're
  finished, single tap to have Bitwig loop your clip or double tap to just stop
  recording.

* To launch a stopped clip, tap its key once. Double tap to stop the clip.

* To re-record a clip, press and hold its key until recording begins.

### Navigating scenes

The selected scene is indicated by a light gray outline around the clips this
script is currently controlling.

* To switch to the next scene down, single tap G#.

* To switch to the previous scene up, double tap G#.

* To stop the currently selected scene, single tap F#.

### Effects control

Not implemented (will use the expression pedal input)

### Navigating sheet music

Not implemented (will use B flat to turn pages)
