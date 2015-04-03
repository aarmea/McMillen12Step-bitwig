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
