loadAPI(1);

load("NoteManager.js");
load("SceneClipStopper.js");

host.defineController("Keith McMillen", "12 Step", "0.1.0", "22f76bfc-789d-43ef-8468-71ab2f645b12", "Albert Armea");
host.defineMidiPorts(1, 0);
host.addDeviceNameBasedDiscoveryPair(["12Step"], []); // Windows
host.addDeviceNameBasedDiscoveryPair(["12Step Port 1"], []); // Mac

const MIDI_NOTE_OFF = 0x80;
const MIDI_NOTE_ON = 0x90;

// All notes in [C4, C5] except F#, G#, and A#
const TRACK_CONTROL_NOTES = [48, 49, 50, 51, 52, 53, 55, 57, 59, 60];
const STOP_ALL_NOTE = 54; // F# 4
const SCENE_SWITCH_NOTE = 56; // G# 4
const PAGE_TURN_NOTE = 58; //  A# 4

const DOUBLE_TAP_HOLD_TIMEOUT = 500; // milliseconds

var noteMap; // A mapping from MIDI note values to their handlers

function init() {
  host.getMidiInPort(0).setMidiCallback(onMidi);

  var trackBank = host.createMainTrackBank(
      TRACK_CONTROL_NOTES.length, 0 /*numSends*/, 1 /*numScenes*/);
  var trackClipStoppers = [];

  noteMap = {};
  TRACK_CONTROL_NOTES.forEach(function(noteId, trackId) {
    var clipLauncher = trackBank.getTrack(trackId).getClipLauncherSlots();
    var clipStopper = new SceneClipStopper(trackBank, clipLauncher);
    trackClipStoppers[trackId] = clipStopper;
    clipLauncher.setIndication(true);

    noteMap[TRACK_CONTROL_NOTES[trackId]] = new NoteManager(
        DOUBLE_TAP_HOLD_TIMEOUT,
        function() { // singleTapCallback
          host.println("Launch clip " + trackId);
          clipLauncher.launch(0 /*scene*/);
        },
        function() { // doubleTapCallback
          host.println("Stop clip " + trackId);
          clipStopper.stop(0 /*scene*/);
        },
        function() { // holdCallback
          host.println("Re-record clip " + trackId);
          clipLauncher.record(0 /*scene*/);
        }
    );
  });

  noteMap[STOP_ALL_NOTE] = new NoteManager(
      DOUBLE_TAP_HOLD_TIMEOUT,
      function() { // singleTapCallback
        host.println("Stop scene");
        // I'd use `trackBank.getClipLauncherScenes().stop();`, but that stops
        // *tracks* that are used in this scene, regardless of whether the clip
        // from the track that's playing is the one we actually want to stop.
        trackClipStoppers.forEach(function(clipStopper) {
          clipStopper.stop(0 /*scene*/);
        });

      },
      function() { // doubleTapCallback
        host.println("Stop globally"); // TODO
      },
      function() {} // holdCallback
  );

  noteMap[SCENE_SWITCH_NOTE] = new NoteManager(
      DOUBLE_TAP_HOLD_TIMEOUT,
      function() { // singleTapCallback
        host.println("Move down a scene");
        trackBank.scrollScenesPageDown();
      },
      function() { // doubleTapCallback
        host.println("Move up a scene");
        // Double taps also fire a single tap, so we need to do this twice
        trackBank.scrollScenesPageUp();
        trackBank.scrollScenesPageUp();
      },
      function() {} // holdCallback
  );

  // TODO: PAGE_TURN_NOTE
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
