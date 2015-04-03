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

const DOUBLE_TAP_HOLD_TIMEOUT = 3000; // milliseconds // XXX: bring this back to 300

var noteMap;

function init() {
  host.getMidiInPort(0).setMidiCallback(onMidi);

  // A mapping from MIDI notes to what we want to do with them
  // TODO: Move this to its own class?
  noteMap = {};
  CLIP_CONTROL_NOTES.forEach(function(noteId, clipId) {
    noteMap[CLIP_CONTROL_NOTES[clipId]] = new NoteManager(
      DOUBLE_TAP_HOLD_TIMEOUT,
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

// TODO: Move these to a different file
const TASK_STOPPED = -1;

var CancelableTask = function(callback, timeout) {
  this.cookie = TASK_STOPPED;
  this.callback = callback;
  this.timeout = timeout;
}

CancelableTask.prototype.start = function(callback, timeout) {
  this.cookie = Math.floor(Math.random() * 2147483648);

  var thisTask = this;
  host.scheduleTask(function(cachedCookie) {
    if (cachedCookie == thisTask.cookie) {
      thisTask.callback();
      thisTask.cookie = TASK_STOPPED;
    }
  }, [this.cookie] /*args*/, this.timeout);
}

CancelableTask.prototype.cancel = function() {
  this.cookie = TASK_STOPPED;
}

CancelableTask.prototype.isActive = function() {
  return (this.cookie != TASK_STOPPED);
}

var NoteManager = function(timeout, singleTapCallback, doubleTapCallback, holdCallback) {
  this.singleTapCallback = singleTapCallback;
  this.doubleTapCallback = doubleTapCallback;
  this.holdCallback = holdCallback;
  this.noteDown = false;

  var thisManager = this;
  this.timer = new CancelableTask(function() {
    if (thisManager.noteDown) {
      thisManager.holdCallback();
    }
  }, timeout);
}

NoteManager.prototype.onNoteEvent = function(eventType) {
  // JavaScript `this` isn't passed to host.scheduleTask callback properly (just
  // like window.setTimeout)
  var thisInstance = this;

  switch(eventType) {
    case MIDI_NOTE_ON:
      this.noteDown = true;
      if (this.timer.isActive()) {
        this.doubleTapCallback();
        this.timer.cancel();
      } else {
        this.singleTapCallback();
        this.timer.start();
      }
      break;
    case MIDI_NOTE_OFF:
      this.noteDown = false;
      break;
    default:
      break;
  }
}

