load("CancelableTask.js");

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
