loadAPI(1);

host.defineController("Keith McMillen", "12 Step", "0.1.0", "22f76bfc-789d-43ef-8468-71ab2f645b12", "Albert Armea");
host.defineMidiPorts(1, 0);
host.addDeviceNameBasedDiscoveryPair(["12Step"], []);

const MIDI_NOTE_OFF = 0x80;
const MIDI_NOTE_ON = 0x90;

// All notes in [C4, C5] except F#, G#, and A#
const CLIP_CONTROL_NOTES = [48, 49, 50, 51, 52, 53, 55, 57, 59, 60];
const STOP_ALL_NOTE = 54; // F# 4
const SCENE_SWITCH_NOTE = 56; // G# 4
const PAGE_TURN_NOTE = 58; //  A# 4

var noteMap;

function init() {
  host.getMidiInPort(0).setMidiCallback(onMidi);

  // A mapping from MIDI notes to what we want to do with them
  // TODO: Move this to its own class?
  noteMap = {};
  CLIP_CONTROL_NOTES.forEach(function(noteId, clipId) {
    noteMap[CLIP_CONTROL_NOTES[clipId]] = new NoteManager(
        function() { // singleTapCallback
          host.println("Single tap clip " + clipId);
          // TODO: Trigger clip clipId at the currently selected scene
        },
        function() { // doubleTapCallback
          host.println("Double tap clip " + clipId);
          // TODO: Stop clip clipId at the currently selected scene
        },
        function() { // holdCallback
          host.println("Hold clip " + clipId);
          // TODO: Delete clip clipId at the currently selected scene
        }
    );
  });
  // TODO: STOP_ALL_NOTE, SCENE_SWITCH_NOTE, PAGE_TURN_NOTE
}

function exit() {
  noteMap = undefined;
}

function onMidi(midiStatus, data1, data2)
{
  var channel = midiStatus & 0x0F;
  var eventType = midiStatus & 0xF0;

  if (channel != 0)
    return;
  if (eventType != MIDI_NOTE_OFF && eventType != MIDI_NOTE_ON)
    return;

  // For note on and note off, data1 is the note number and data2 is the
  // velocity
  if (data1 in noteMap)
    noteMap[data1].onNoteEvent(eventType);
}

// TODO: Move this to a different file
const DOUBLE_TAP_HOLD_TIMEOUT = 3000; // milliseconds // XXX: bring this back to 300

var NoteManager = function(singleTapCallback, doubleTapCallback, holdCallback) {
  this.singleTapCallback = singleTapCallback;
  this.doubleTapCallback = doubleTapCallback;
  this.holdCallback = holdCallback;
  this.timerActive = false
  this.noteDown = false;
}

NoteManager.prototype.onNoteEvent = function(eventType) {
  // JavaScript `this` isn't passed to host.scheduleTask callback properly (just
  // like window.setTimeout)
  var thisInstance = this;

  switch(eventType) {
    case MIDI_NOTE_ON:
      this.noteDown = true;
      if (this.timerActive) {
        this.doubleTapCallback();
        this.timerActive = false;
        // TODO: Cancel the timer here (the API provides no way to do this...)
        // This is causing a bug where if you short tap (triggering a
        // singleTapCallback and starting the timer), short tap again shortly
        // after (triggering doubleTapCallback and setting timerActive = false),
        // and tap and hold before the timer expires, the holdCallback is
        // triggered much sooner than expected.
      } else {
        this.singleTapCallback();
        host.scheduleTask(function() {
          if (thisInstance.timerActive && thisInstance.noteDown)
            thisInstance.holdCallback();
          thisInstance.timerActive = false;
        }, null /*args*/, DOUBLE_TAP_HOLD_TIMEOUT);
        this.timerActive = true;
      }
      break;
    case MIDI_NOTE_OFF:
      this.noteDown = false;
      break;
    default:
      break;
  }
}

