window.ENV = (function() {
    "use strict";

    var first = true;
    var counter = 0;
    var data;
    var _base;
    (_base = String.prototype).lpad || (_base.lpad = function(padding, toLength) {
      return padding.repeat((toLength - this.length) / padding.length).concat(this);
    });

    function formatElapsed(value) {
      var str = parseFloat(value).toFixed(2);
      if (value > 60) {
        minutes = Math.floor(value / 60);
        comps = (value % 60).toFixed(2).split('.');
        seconds = comps[0].lpad('0', 2);
        ms = comps[1];
        str = minutes + ":" + seconds + "." + ms;
      }
      return str;
    }

    function getElapsedClassName(elapsed) {
      var className = 'Query elapsed';
      if (elapsed >= 10.0) {
        className += ' warn_long';
      }
      else if (elapsed >= 1.0) {
        className += ' warn';
      }
      else {
        className += ' short';
      }
      return className;
    }

    function countClassName(queries) {
      var countClassName = "label";
      if (queries >= 20) {
        countClassName += " label-important";
      }
      else if (queries >= 10) {
        countClassName += " label-warning";
      }
      else {
        countClassName += " label-success";
      }
      return countClassName;
    }

    function updateQuery(object) {
      if (!object) {
        object = {};
      }
      var elapsed = Math.random() * 15;
      object.elapsed = elapsed;
      object.formatElapsed = formatElapsed(elapsed);
      object.elapsedClassName = getElapsedClassName(elapsed);
      object.query = "SELECT blah FROM something";
      object.waiting = Math.random() < 0.5;
      if (Math.random() < 0.2) {
        object.query = "<IDLE> in transaction";
      }
      if (Math.random() < 0.1) {
        object.query = "vacuum";
      }
      return object;
    }

    function cleanQuery(value) {
      if (value) {
        value.formatElapsed = "";
        value.elapsedClassName = "";
        value.query = "";
        delete value.elapsed;
        delete value.waiting;
      } else {
        return {
          query: "***",
          formatElapsed: "",
          elapsedClassName: ""
        };
      }
    }

    function generateRow(object, keepIdentity, counter) {
      var nbQueries = Math.floor((Math.random() * 10) + 1);
      if (!object) {
        object = {};
      }
      object.lastMutationId = counter;
      object.nbQueries = nbQueries;
      if (!object.lastSample) {
        object.lastSample = {};
      }
      if (!object.lastSample.topFiveQueries) {
        object.lastSample.topFiveQueries = [];
      }
      if (keepIdentity) {
        // for Angular optimization
        if (!object.lastSample.queries) {
          object.lastSample.queries = [];
          for (var l = 0; l < 12; l++) {
            object.lastSample.queries[l] = cleanQuery();
          }
        }
        for (var j in object.lastSample.queries) {
          var value = object.lastSample.queries[j];
          if (j <= nbQueries) {
            updateQuery(value);
          } else {
            cleanQuery(value);
          }
        }
      } else {
        object.lastSample.queries = [];
        for (var j = 0; j < 12; j++) {
          if (j < nbQueries) {
            var value = updateQuery(cleanQuery());
            object.lastSample.queries.push(value);
          } else {
            object.lastSample.queries.push(cleanQuery());
          }
        }
      }
      for (var i = 0; i < 5; i++) {
        var source = object.lastSample.queries[i];
        object.lastSample.topFiveQueries[i] = source;
      }
      object.lastSample.nbQueries = nbQueries;
      object.lastSample.countClassName = countClassName(nbQueries);
      return object;
    }

    function getData(keepIdentity) {
      var oldData = data;
      if (!keepIdentity) { // reset for each tick when !keepIdentity
        data = [];
        for (var i = 1; i <= ENV.rows; i++) {
          data.push({ dbname: 'cluster' + i, query: "", formatElapsed: "", elapsedClassName: "" });
          data.push({ dbname: 'cluster' + i + ' slave', query: "", formatElapsed: "", elapsedClassName: "" });
        }
      }
      if (!data) { // first init when keepIdentity
        data = [];
        for (var i = 1; i <= ENV.rows; i++) {
          data.push({ dbname: 'cluster' + i });
          data.push({ dbname: 'cluster' + i + ' slave' });
        }
        oldData = data;
      }
      for (var i in data) {
        var row = data[i];
        if (!keepIdentity && oldData && oldData[i]) {
          row.lastSample = oldData[i].lastSample;
        }
        if (!row.lastSample || Math.random() < ENV.mutations()) {
          counter = counter + 1;
          if (!keepIdentity) {
            delete row.lastSample;
          }
          generateRow(row, keepIdentity, counter);
        } else {
          data[i] = oldData[i];
        }
      }
      first = false;
      return {
        toArray: function() {
          return data;
        }
      };
    }

    var mutationsValue = 0.5;

    function mutations(value) {
      if (value) {
        mutationsValue = value;
        return mutationsValue;
      } else {
        return mutationsValue;
      }
    }

    var body = document.querySelector('body');
    var theFirstChild = body.firstChild;

    var sliderContainer = document.createElement( 'div' );
    sliderContainer.style.cssText = "display: flex";
    var slider = document.createElement('input');
    var text = document.createElement('label');
    text.innerHTML = 'mutations : ' + (mutationsValue * 100).toFixed(0) + '%';
    text.id = "ratioval";
    slider.setAttribute("type", "range");
    slider.style.cssText = 'margin-bottom: 10px; margin-top: 5px';
    slider.addEventListener('change', function(e) {
      ENV.mutations(e.target.value / 100);
      document.querySelector('#ratioval').innerHTML = 'mutations : ' + (ENV.mutations() * 100).toFixed(0) + '%';
    });
    sliderContainer.appendChild( text );
    sliderContainer.appendChild( slider );
    body.insertBefore( sliderContainer, theFirstChild );

    return  {
      generateData: getData,
      rows: 50,
      timeout: 0,
      mutations: mutations
    };
  })();




    var babelHelpers = {};

    babelHelpers.classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    babelHelpers.createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    babelHelpers;

    var MONITOR_GRAPH_HEIGHT = 30;
    var MONITOR_GRAPH_WIDTH = 100;
    var container = null;
    var initialized = false;
    var frameTasks = [];
    var rafId = -1;
    /**
     * Initialize Performance Monitor
     */
    function initPerfMonitor(options) {
        if (!initialized) {
            if (options.container) {
                container = options.container;
            }
            initialized = true;
        }
    }
    /**
     * Check that everything is properly initialized
     */
    function checkInit() {
        if (!container) {
            container = document.createElement("div");
            container.style.cssText = "position: fixed;" + "opacity: 0.9;" + "right: 0;" + "bottom: 0";
            document.body.appendChild(container);
        }
        initialized = true;
    }
    /**
     * Schedule new task that will be executed on the next frame
     */
    function scheduleTask(task) {
        frameTasks.push(task);
        if (rafId === -1) {
            requestAnimationFrame(function (t) {
                rafId = -1;
                var tasks = frameTasks;
                frameTasks = [];
                for (var i = 0; i < tasks.length; i++) {
                    tasks[i]();
                }
            });
        }
    }

    var Result = function Result(min, max, mean, now) {
        babelHelpers.classCallCheck(this, Result);

        this.min = min;
        this.max = max;
        this.mean = mean;
        this.now = now;
    };
    /**
     * Data object contains all data samples
     */


    var Data = function () {
        function Data() {
            babelHelpers.classCallCheck(this, Data);

            this.samples = [];
            this.maxSamples = MONITOR_GRAPH_WIDTH;
        }

        babelHelpers.createClass(Data, [{
            key: "addSample",
            value: function addSample(v) {
                if (this.samples.length === this.maxSamples) {
                    this.samples.shift();
                }
                this.samples.push(v);
            }
        }, {
            key: "calc",
            value: function calc() {
                var min = this.samples[0];
                var max = this.samples[0];
                var sum = 0;
                for (var i = 0; i < this.samples.length; i++) {
                    var k = this.samples[i];
                    if (k < min) {
                        min = k;
                    }
                    if (k > max) {
                        max = k;
                    }
                    sum += k;
                }
                var now = this.samples[this.samples.length - 1];
                var mean = sum / this.samples.length;
                return new Result(min, max, mean, now);
            }
        }]);
        return Data;
    }();

    var MonitorWidget = function () {
        function MonitorWidget(name, unitName) {
            var _this = this;

            var flags = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            babelHelpers.classCallCheck(this, MonitorWidget);

            this._syncView = function () {
                var result = _this.results[_this.results.length - 1];
                var scale = MONITOR_GRAPH_HEIGHT / (result.max * 1.2);
                var min = (_this.flags & 32 /* RoundValues */) === 0 ? result.min.toFixed(2) : "" + Math.round(result.min);
                var max = (_this.flags & 32 /* RoundValues */) === 0 ? result.max.toFixed(2) : "" + Math.round(result.max);
                var mean = (_this.flags & 32 /* RoundValues */) === 0 ? result.mean.toFixed(2) : "" + Math.round(result.mean);
                var now = (_this.flags & 32 /* RoundValues */) === 0 ? result.now.toFixed(2) : "" + Math.round(result.now);
                _this.text.innerHTML = "" + ((_this.flags & 1 /* HideMin */) === 0 ? "<div>min: &nbsp;" + min + _this.unitName + "</div>" : "") + ((_this.flags & 2 /* HideMax */) === 0 ? "<div>max: &nbsp;" + max + _this.unitName + "</div>" : "") + ((_this.flags & 4 /* HideMean */) === 0 ? "<div>mean: " + mean + _this.unitName + "</div>" : "") + ((_this.flags & 8 /* HideNow */) === 0 ? "<div>now: &nbsp;" + now + _this.unitName + "</div>" : "");
                if ((_this.flags & 16 /* HideGraph */) === 0) {
                    _this.ctx.fillStyle = "#010";
                    _this.ctx.fillRect(0, 0, MONITOR_GRAPH_WIDTH, MONITOR_GRAPH_HEIGHT);
                    _this.ctx.fillStyle = "#0f0";
                    for (var i = 0; i < _this.results.length; i++) {
                        _this.ctx.fillRect(i, MONITOR_GRAPH_HEIGHT, 1, -(_this.results[i].now * scale));
                    }
                }
                _this._dirty = false;
            };
            this.name = name;
            this.unitName = unitName;
            this.flags = flags;
            this.results = [];
            this.element = document.createElement("div");
            this.element.style.cssText = "padding: 2px;" + "background-color: #020;" + "font-family: monospace;" + "font-size: 12px;" + "color: #0f0";
            this.label = document.createElement("div");
            this.label.style.cssText = "text-align: center";
            this.label.textContent = this.name;
            this.text = document.createElement("div");
            this.element.appendChild(this.label);
            this.element.appendChild(this.text);
            if ((flags & 16 /* HideGraph */) === 0) {
                this.canvas = document.createElement("canvas");
                this.canvas.style.cssText = "display: block; padding: 0; margin: 0";
                this.canvas.width = MONITOR_GRAPH_WIDTH;
                this.canvas.height = MONITOR_GRAPH_HEIGHT;
                this.ctx = this.canvas.getContext("2d");
                this.element.appendChild(this.canvas);
            } else {
                this.canvas = null;
                this.ctx = null;
            }
            this._dirty = false;
        }

        babelHelpers.createClass(MonitorWidget, [{
            key: "addResult",
            value: function addResult(result) {
                if (this.results.length === MONITOR_GRAPH_WIDTH) {
                    this.results.shift();
                }
                this.results.push(result);
                this.invalidate();
            }
        }, {
            key: "invalidate",
            value: function invalidate() {
                if (!this._dirty) {
                    this._dirty = true;
                    scheduleTask(this._syncView);
                }
            }
        }]);
        return MonitorWidget;
    }();
    /**
     * Start FPS monitor
     */


    function startFPSMonitor() {
        checkInit();
        var data = new Data();
        var w = new MonitorWidget("FPS", "", 2 /* HideMax */ | 1 /* HideMin */ | 4 /* HideMean */ | 32 /* RoundValues */);
        container.appendChild(w.element);
        var samples = [];
        var last = 0;
        function update(now) {
            var elapsed = (now - (last === 0 ? now : last)) / 1000;
            var fps = 1 / elapsed;
            if (fps !== Infinity) {
                if (samples.length === 64) {
                    samples.shift();
                }
                samples.push(fps);
                var sum = 0;
                for (var i = 0; i < samples.length; i++) {
                    sum += samples[i];
                }
                var mean = sum / samples.length;
                data.addSample(mean);
                w.addResult(data.calc());
            }
            last = now;
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    /**
     * Start Memory Monitor
     */
    function startMemMonitor() {
        checkInit();
        if (performance.memory !== void 0) {
            (function () {
                var update = function update() {
                    data.addSample(Math.round(mem.usedJSHeapSize / (1024 * 1024)));
                    w.addResult(data.calc());
                    setTimeout(update, 30);
                };

                var data = new Data();
                var w = new MonitorWidget("Memory", "MB", 1 /* HideMin */ | 4 /* HideMean */);
                container.appendChild(w.element);
                var mem = performance.memory;

                update();
            })();
        }
    }

    var Profiler = function Profiler(name, unitName) {
        babelHelpers.classCallCheck(this, Profiler);

        this.data = new Data();
        this.widget = new MonitorWidget(name, unitName);
        this.startTime = 0;
    };

    var profilerInstances = {};
    function startProfile(name) {
        var profiler = profilerInstances[name];
        if (profiler !== void 0) {
            profiler.startTime = performance.now();
        }
    }
    function endProfile(name) {
        var now = performance.now();
        var profiler = profilerInstances[name];
        if (profiler !== void 0) {
            profiler.data.addSample(now - profiler.startTime);
            profiler.widget.addResult(profiler.data.calc());
        }
    }
    /**
     * Initialize profiler and insert into container
     */
    function initProfiler(name) {
        checkInit();
        var profiler = profilerInstances[name];
        if (profiler === void 0) {
            profilerInstances[name] = profiler = new Profiler(name, "ms");
            container.appendChild(profiler.widget.element);
        }
    }

exports.initPerfMonitor = initPerfMonitor;
exports.startFPSMonitor = startFPSMonitor;
exports.startMemMonitor = startMemMonitor;
exports.startProfile = startProfile;
exports.endProfile = endProfile;
exports.initProfiler = initProfiler;
