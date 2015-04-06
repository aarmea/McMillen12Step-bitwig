load("CancelableTask.js");

/* NoteManager multiplexes a MIDI note event based on timing so that it can
 * trigger different actions:
 *
 * - doubleTapCallback is called when the note is tapped twice within the
 *   timeout.
 * - holdCallback is called when the note is held longer than the timeout.
 * - singleTapCallback is called whenever the note is tapped, even if it is part
 *   of a sequence that should be considered a double tap or hold. This is
 *   because there is no way to check if a single tap is part of one of these
 *   sequences without delaying the single tap. Make sure your doubleTapCallback
 *   and holdCallback are aware of this.
 */
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
  switch(eventType) {
    case MIDI_NOTE_ON:
      this.noteDown = true;
      if (this.timer.isActive()) {
        this.doubleTapCallback();
        // Prevents the next tap from being detected as a hold too early if it
        // is started before the timer expires. Bare Bitwig API
        // tasks (host.scheduleTask(...)) cannot be canceled.
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
