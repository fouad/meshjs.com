var mesh = require("mesh");
var extend = require("xtend/mutable");

module.exports = {

  /**
   */

  initialize: function() {
    if (!this.isNew) {
      this.isNew = function() {
        return !this.data;
      }
    }
  },

  /**
   */

  save: function(onSave) {
    this._run(this.isNew() ? "insert" : "update", onSave);
    return this;
  },

  /**
   */

  load: function(onLoad) {
    this._run("load", onLoad);
    return this;
  },

  /**
   */

  remove: function(onLoad) {
    this._run("remove", onLoad);
    return this;
  },

  /**
   */

  _run: function(operationName, onRun) {
    if (!onRun) onRun = function() { };

    var data = extend({}, this.data);

    this
    .bus(mesh.op(operationName, {
      model: this
    }))
    .once("error", onRun)

    // server just returns junl for now - just merge data
    .on("data", extend.bind(void 0, data))
    .once("end", this.set.bind(this, "data", data))
    .once("end", onRun);
  }
}