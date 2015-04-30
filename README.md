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
|  |9| |1|  |  |c| |n| |g|  |   |
|  | | |0|  |  | | | | | |  |   |
|  |_| |_|  |  |_| |_| |_|  |   |
| C | C | C | C | C | C | C | C |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|___|___|___|___|___|___|___|___|
```

### Clip control (C1, C2, ...)

Clip control is done using all of the white keys and C# and D#. Each key
corresponds to a clip on the currently selected scene.

* To start recording a clip for the first time, tap its key once. When you're
  finished, single tap to have Bitwig loop your clip or double tap to just stop
  recording.
* To launch a stopped clip, tap its key once. Double tap to stop the clip.
* To re-record a clip, tap and hold its key until recording begins.

### Navigating scenes (Sn)

The selected scene is indicated by a light gray outline around the clips this
script is currently controlling.

* To switch to the next scene down, single tap G#.
* To switch to the previous scene up, double tap G#.

### Scene control (Sc)

* To launch the currently selected scene, single tap F#.
* To stop the currently selected scene, double tap F#.
* To stop all scenes *except* the currently selected scene, tap and hold F#
  until the scenes are stopped.
  * Known issue: This will also launch the currently selected scene because
    there is currently no way to cancel/undo the single tap event.

### Effects control

Effects control is done using the expression pedal:

1. Add an effect to a track.
2. In the device panel, find the effect's presets and macros settings (opened
   with an icon that looks like `<>`).
3. Right click one of the knobs and click "Learn Controller Assignment".
4. Press the expression pedal.
5. Click the button above the knob you just assigned (looks like `*->`) and
   then click the value you want to control.

The pedal range is currently a bit stupid to accommodate my setup. You probably
want to adjust it. Look for a line in 12Step.control.js that looks like
`expressionCc.set(...);`.

### Remote page turn (Pg)

You can optionally navigate sheet music on a separate machine (assuming its
platform is supported by Python 2.x and autopy):

#### Setup

1. On the machine running Bitwig, configure your firewall to allow incoming
   connections to Bitwig on port 32313.
2. On the remote machine, install Python 2.x and
   [autopy](https://github.com/msanders/autopy/#installation).
3. Clone this repository somewhere on the remote machine.
4. Open Bitwig and get the IP address of this machine.
5. On the remote machine, open a shell to `$REPO_ROOT/client` and run `python
   PageTurner.py $BITWIG_MACHINE_IP_ADDRESS`.
6. On the remote machine, open your sheet music, lyrics, notes, etc. in an
   application that handles the page up and page down keys.

#### Usage

* To navigate to the next page, single tap B flat.
* To navigate to the previous page, double tap B flat.
