const TASK_STOPPED = -1;

var CancelableTask = function(callback, timeout) {
  this.taskId = TASK_STOPPED;
  this.callback = callback;
  this.timeout = timeout;
}

CancelableTask.prototype.start = function(callback, timeout) {
  this.taskId = Math.floor(Math.random() * 2147483648);

  var thisTask = this;
  host.scheduleTask(function(cachedId) {
    if (cachedId == thisTask.taskId) {
      thisTask.callback();
      thisTask.taskId = TASK_STOPPED;
    }
  }, [this.taskId] /*args*/, this.timeout);
}

CancelableTask.prototype.cancel = function() {
  this.taskId = TASK_STOPPED;
}

CancelableTask.prototype.isActive = function() {
  return (this.taskId != TASK_STOPPED);
}
