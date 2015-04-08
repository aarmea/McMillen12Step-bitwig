/* SceneClipStopper should be used similarly to ClipLauncherSlots (as returned
 * by host.createMainTrackBank(...).getTrack(...).getClipLauncherSlots();) -
 * instances correspond to tracks.
 *
 * Usage: [SceneClipStopper instance].stop(sceneIndex)
 * Stops the clip at sceneIndex relative to the trackBank's window (as opposed
 * to [ClipLauncherSlots instance].stop(), which stops the *entire track*).
 */
var SceneClipStopper;

(function() {
  var ClipStatus = function() {
    this.isPlaying = false;
    this.isPlaybackQueued = false;
    this.isRecording = false;
    this.isRecordingQueued = false;
  }

  ClipStatus.prototype.isActive = function() {
    return (this.isPlaying || this.isPlaybackQueued || this.isRecording
      || this.isRecordingQueued);
  }

  SceneClipStopper = function(trackBank, trackClipLauncherSlots) {
    this.trackClipStatuses = [];
    this.sceneScrollPosition = 0;

    var thisStopper = this;
    this.trackClipLauncher = trackClipLauncherSlots;
    this.trackClipLauncher.addIsPlayingObserver(function(clipIndex, isPlaying) {
      thisStopper.getClipStatus(clipIndex).isPlaying = isPlaying;
    });
    this.trackClipLauncher.addIsPlaybackQueuedObserver(function(clipIndex, isPlaybackQueued) {
      thisStopper.getClipStatus(clipIndex).isPlaybackQueued = isPlaybackQueued;
    });
    this.trackClipLauncher.addIsRecordingObserver(function(clipIndex, isRecording) {
      thisStopper.getClipStatus(clipIndex).isRecording = isRecording;
    });
    this.trackClipLauncher.addIsRecordingQueuedObserver(function(clipIndex, isRecordingQueued) {
      thisStopper.getClipStatus(clipIndex).isRecordingQueued = isRecordingQueued;
    });

    trackBank.addSceneScrollPositionObserver(function(sceneScrollPosition) {
      this.sceneScrollPosition = sceneScrollPosition;
    }, 0 /*valueWhenUnassigned*/);
  }

  SceneClipStopper.prototype.getClipStatus = function(sceneIndex) {
    if (!(sceneIndex in this.trackClipStatuses)) {
      this.trackClipStatuses[sceneIndex] = new ClipStatus();
    }
    return this.trackClipStatuses[sceneIndex];
  }

  SceneClipStopper.prototype.stop = function(sceneIndex) {
    if (this.getClipStatus(this.sceneScrollPosition + sceneIndex).isActive()) {
      this.trackClipLauncher.stop();
    }
  }

  SceneClipStopper.prototype.stopAllExcept = function(sceneIndex) {
    if (!this.getClipStatus(this.sceneScrollPosition + sceneIndex).isActive()) {
      this.trackClipLauncher.stop();
    }
  }
})();
