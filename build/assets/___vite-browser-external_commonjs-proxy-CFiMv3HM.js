var Ht = Object.defineProperty;
var Bt = Object.getOwnPropertySymbols;
var qt = Object.prototype.hasOwnProperty,
  Vt = Object.prototype.propertyIsEnumerable;
var Pt = (c, t, e) =>
    t in c
      ? Ht(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (c[t] = e),
  wt = (c, t) => {
    for (var e in t || (t = {})) qt.call(t, e) && Pt(c, e, t[e]);
    if (Bt) for (var e of Bt(t)) Vt.call(t, e) && Pt(c, e, t[e]);
    return c;
  };
import { c as Ot, a as Gt, g as Kt } from "./_commonjsHelpers-Chg3vePA.js";
class Ut {
  constructor() {
    this.core = { listeners: [] };
  }
  listen(t, e) {
    document.addEventListener(t, e, !1),
      this.core.listeners.push({ name: t, task: e });
  }
  destroy() {
    this.core.listeners.forEach((t) => {
      document.removeEventListener(t.name, t.task);
    });
  }
}
class jt extends Ut {
  bind(t, e = {}) {}
  isEnabled() {
    return this.enabled === !0;
  }
  disable() {
    this.enabled = !1;
  }
  enable() {
    this.enabled = !0;
  }
  toggle() {
    this.enabled ? this.disable() : this.enable();
  }
}
function $t(c) {
  var t;
  return c && window.debug && window.debug.publish
    ? window.debug.publish.includes
      ? window.debug.publish.includes.includes(c)
      : window.debug.publish.excludes
      ? !window.debug.publish.excludes.includes(c)
      : (t = window.debug.publish.log) != null
      ? t
      : !1
    : !1;
}
function Jt(c, t = {}) {
  const e = this.core.subscribers[c];
  $t(c) && window.debug.publish.trace,
    Array.isArray(e) &&
      Array.from(e).forEach((a) => {
        a.callback(t);
      });
}
function Qt(c, t, e) {
  if (mt.isComponent(c) && c.hasFeature("publisher-subscriber")) {
    const a = {
      subscription_id: `${this._id}#${c._id}#${this.core.nbSubscriptions}`,
      callback: e,
    };
    return (
      (a.unsubscribe = xt.unsubscribeFactory(this, a, t, c)),
      xt.addSubscription(this, t, a, c),
      xt.addSubscriber(this, t, a, c),
      a
    );
  } else return null;
}
function te(c = {}) {
  typeof c.message == "string" && (c.message = [c.message]),
    Array.isArray(c.message) &&
      c.message.forEach((t) => {
        const e = this.core.subscriptions[t];
        Array.isArray(e) &&
          e
            .map((a) => a.unsubscribe)
            .forEach((a) => {
              a();
            });
      });
}
class xt extends jt {
  constructor(t = {}) {
    super(t);
  }
  init(t) {
    (t.core.subscribers = {}),
      (t.core.subscriptions = {}),
      (t.core.nbSubscriptions = 0),
      (t.core.nbSubscribers = 0),
      (t.publish = Jt.bind(t)),
      (t.subscribe = Qt.bind(t)),
      (t.unsubscribe = te.bind(t)),
      (this.destroy = xt.destroy.bind(this, t));
  }
  static addSubscription(t, e, a, h) {
    Array.isArray(t.core.subscriptions[e]) !== !0 &&
      (t.core.subscriptions[e] = []),
      t.core.subscriptions[e].push(wt({ component_id: h._id }, a)),
      t.core.nbSubscriptions++;
  }
  static unsubscribeFactory(t, e, a, h) {
    return () => {
      const i = h.core.subscribers[a];
      if (Array.isArray(i)) {
        const s = i.findIndex((f) => f.subscription_id === e.subscription_id);
        if (s >= 0) {
          const f = i.splice(s, 1);
          delete f.callback,
            h.core.nbSubscribers--,
            h.core.subscribers[a].length === 0 && delete h.core.subscribers[a];
        }
      }
      const o = t.core.subscriptions[a];
      if (Array.isArray(o)) {
        const s = o.findIndex((f) => f.subscription_id === e.subscription_id);
        if (s >= 0) {
          const f = o.splice(s, 1);
          delete f.unsubscribe,
            t.core.subscriptions[a].length === 0 &&
              delete t.core.subscriptions[a],
            t.core.nbSubscriptions--;
        }
      }
    };
  }
  static addSubscriber(t, e, a, h) {
    Array.isArray(h.core.subscribers[e]) !== !0 && (h.core.subscribers[e] = []),
      h.core.subscribers[e].push(wt({ component_id: t._id }, a)),
      h.core.nbSubscribers++;
  }
  static destroy(t) {
    Object.values(t.core.subscriptions).forEach((e) => {
      e.forEach((a) => a.unsubscribe());
    }),
      Object.values(t.core.subscribers).forEach((e) => {
        e.forEach((a) => a.unsubscribe());
      });
  }
}
function ee(c, t = {}) {
  const e = new xt(t);
  return e.init(c, t), e;
}
function re() {}
let ie = 0;
class mt extends Ut {
  constructor(t = {}) {
    super(t),
      typeof t.component > "u" && (t.component = {}),
      Object.defineProperties(this.core, {
        instancied_at: { value: Date.now(), writable: !1, configurable: !1 },
        _id: { value: "component_" + ie++, writable: !1, configurable: !1 },
        isSmartComponent: { value: !0, writable: !1, configurable: !1 },
      }),
      (this._id = t._id || this.core._id),
      (this.features = {
        "publisher-subscriber": { bindFeature: ee, priority: -1 },
      }),
      (this.quietEvents = {}),
      this.setup(t);
  }
  static isComponent(t) {
    return (
      typeof t == "object" &&
      typeof t.core == "object" &&
      t.core.isSmartComponent === !0
    );
  }
  featureIsEnabled(t) {
    const e = this.features[t];
    return typeof e != "object" || typeof e.isEnabled != "function"
      ? !1
      : e.isEnabled() || !1;
  }
  is(t = null) {
    return t !== null && this._id === t._id;
  }
  store(t, e) {
    this.data[t] = e;
  }
  get(t) {
    return typeof this.data[t] < "u" ? this.data[t] : null;
  }
  setBehavior(t, e) {
    this.behaviours[t] = e;
  }
  hasFeature(t) {
    return typeof this.features[t] < "u";
  }
  getBehavior(t) {
    return this.behaviours[t];
  }
  clearBehavior(t) {
    delete this.behaviours[t];
  }
  behave(t, e) {
    const a = this.getBehavior(t);
    if (typeof a == "function") return a(e);
  }
  hide(t) {
    t.classList.add("im-hidden");
  }
  show(t) {
    t.classList.remove("im-hidden");
  }
  doAsync(t) {
    new Promise((e) => {
      t(), e();
    }).then(re);
  }
  setup(t = {}) {
    typeof t.component.name < "u"
      ? (this.name = t.component.name)
      : typeof t.name < "u"
      ? (this.name = t.name)
      : (this.name = this._id),
      (this.ui = {}),
      (this.label = {}),
      (this.data = {}),
      (this.behaviours = {}),
      this.onSetup(t),
      this.injectFeatures(
        Object.assign({}, t.component.features, t.features, this.features)
      );
  }
  onSetup(t) {}
  setId(t) {
    this._id = t;
  }
  checkInjectionRulesBindTo(t, e) {
    if (typeof e.bindTo > "u") return !0;
    if (Array.isArray(e.bindTo)) {
      if (e.bindTo.has(this.name) === !1) return !1;
    } else {
      if (typeof e.bindTo == "function") return e.bindTo(this, e);
      if (this.name !== e.bindTo) return !1;
    }
    return !0;
  }
  checkInjectionBindMethod(t, e) {
    return typeof e == "function"
      ? !0
      : (typeof e.bind > "u" &&
          typeof e.bindFeature != "function" &&
          (e.bindFeature = defaultSettings.featuresRecorded[t]),
        typeof e.bindFeature > "u"
          ? (this.notifyError(
              `Unable to find '${t}' in built-in viewer features`
            ),
            !1)
          : !0);
  }
  checkInjectionRules(t, e) {
    return (this.injectionRules.bindTo !== !0 && typeof e.bindTo < "u") ||
      (this.injectionRules.bindTo === !0 &&
        this.checkInjectionRulesBindTo(t, e) !== !0)
      ? !1
      : this.checkInjectionBindMethod(t, e) === !0;
  }
  injectFeatures(t = {}) {
    Object.keys(t)
      .map((e) => {
        const a = { name: e },
          h = t[e];
        return (
          typeof h == "function"
            ? (a.bindFeature = h)
            : (a.bindFeature = h.bindFeature),
          Number.isFinite(h.priority)
            ? (a.priority = h.priority)
            : (a.priority = Number.POSITIVE_INFINITY),
          a
        );
      })
      .sort((e, a) => e.priority - a.priority)
      .forEach((e) => {
        this.injectFeature(e.name, e.bindFeature);
      });
  }
  injectFeature(t, e = {}) {
    if (e === !1 || e.enabled === !1) return;
    let a;
    try {
      typeof e.bindFeature == "function"
        ? (a = e.bindFeature(this, e))
        : typeof e == "function" && (a = e(this, e)),
        typeof a < "u" ? (this.features[t] = a) : (this.features[t] = e),
        this.publish && this.publish("feature-added", { name: t, data: e });
    } catch (h) {
      this.notifyError(
        `Unable to bind feature "${t}" to component "${this.name}"`
      );
    }
    return !0;
  }
  quiet(t, e = !0) {
    e === !0 ? (this.quietEvents[t] = !0) : delete this.quietEvents[t];
  }
  resetQuietEvents() {
    Object.keys(this.quietEvents).forEach((t) => {
      delete this.quietEvents[t];
    });
  }
  isQuiet(t) {
    return this.quietEvents[t] === !0;
  }
  emit(t, e = {}) {
    this.isQuiet(t) !== !0 &&
      (e.target || document).dispatchEvent(
        this.createCustomEvent(t, Object.assign({ emitter: this }, e))
      );
  }
  destroy() {
    super.destroy(),
      this.publish("destroy", this),
      Object.values(this.features).forEach((t) => {
        typeof t.destroy == "function" && t.destroy();
      });
  }
  createCustomEvent(t, e) {
    if (typeof window < "u") {
      if (typeof window.CustomEvent == "function") return new CustomEvent(t, e);
      {
        const a = e || { bubbles: !1, cancelable: !1, detail: void 0 },
          h = document.createEvent("CustomEvent");
        return h.initCustomEvent(t, a.bubbles, a.cancelable, a.detail), h;
      }
    }
  }
  notifyWarning(t) {
    mt.verboseMode;
  }
  notifyError(t, e = !1) {
    if (
      (mt.verboseMode,
      typeof window < "u" && window.newrelic && window.newrelic.noticeError(t),
      e === !0)
    )
      throw new Error(t);
  }
  notifyLog(t) {}
}
mt.verboseMode = !0;
mt.enableVerboseMode = function () {
  mt.verboseMode = !0;
};
mt.disableVerboseMode = function () {
  mt.verboseMode = !1;
};
class Mt {
  constructor() {
    (this.data = {
      coords: { x: 0, y: 0 },
      lastCoords: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      lastCoordsOnScreen: { x: 0, y: 0 },
      lastMouseDownCoords: { x: 0, y: 0 },
    }),
      (this.isDown = !1),
      (this.mouseDownTarget = null);
  }
  setCoords(t, e, a = 1, h = 1, i = 1) {
    const o = this.data.coords;
    this.setLastCoords(o.x, o.y),
      (o.x = t),
      (o.y = e),
      (this.data.delta.x = Math.round((o.x - this.data.lastCoords.x) * a * h)),
      (this.data.delta.y = Math.round((o.y - this.data.lastCoords.y) * a * i));
  }
  setLastCoords(t, e) {
    const a = this.data.lastCoords;
    (a.x = t), (a.y = e);
  }
  getLastCoords() {
    const { x: t, y: e } = this.data.lastCoords;
    return { x: t, y: e };
  }
  setLastMouseDownCoords(t, e) {
    const a = this.data.lastMouseDownCoords;
    (a.x = t), (a.y = e);
  }
  getLastMouseDownCoords() {
    const { x: t, y: e } = this.data.lastMouseDownCoords;
    return { x: t, y: e };
  }
  setMouseDownTarget(t = null) {
    this.mouseDownTarget = t;
  }
  getMouseDownTarget() {
    return this.mouseDownTarget;
  }
  update(t) {
    const e = Mt.retrieveCoords(t),
      a = t.target;
    let h = 1,
      i = 1;
    if (Number.isFinite(a.width) && Number.isFinite(a.height)) {
      const o = a.getBoundingClientRect();
      (h = a.width / o.width), (i = a.height / o.height);
    }
    this.setCoords(e.x, e.y, 1, h, i);
  }
  static retrieveCoords(t, e = null) {
    const a = (e || t.target).getBoundingClientRect();
    let h = t;
    return (
      t.changedTouches && t.changedTouches[0] && (h = t.changedTouches[0]),
      { x: h.clientX - a.left, y: h.clientY - a.top }
    );
  }
}
class It extends mt {
  constructor(t) {
    typeof t.name > "u" && (t.name = "mouse-controller"),
      super(t),
      (this.domTarget = t.domTarget || window),
      (this.lockPointer = t.lockPointer || !1);
    const e = t.defaultIsAvoid ? It.avoid : null;
    (this.onMouseMove = t.onMouseMove || e),
      (this.onMouseDown = t.onMouseDown || e),
      (this.onMouseUp = t.onMouseUp || e),
      (this.onClick = t.onClick || e),
      (this.onDoubleClick = t.onDoubleClick || e),
      (this.onMouseEnter = t.onMouseEnter || e),
      (this.onMouseLeave = t.onMouseLeave || e),
      (this.onMouseWheel = t.onMouseWheel || e),
      (this.onTouchStart = t.onTouchStart || t.onMouseDown || e),
      (this.onTouchMove = t.onTouchMove || t.onMouseMove || e),
      (this.onTouchEnd = t.onTouchEnd || t.onMouseUp || e),
      (this.sensivity = 1),
      this.notify(),
      this.init(t);
  }
  init(t = {}) {
    if (
      (typeof t.state < "u" ? (this.state = t.state) : (this.state = new Mt()),
      this.lockPointer && this.requestPointerLock(),
      document.addEventListener(
        "contextmenu",
        function (a) {
          return !1;
        },
        !1
      ),
      this.domTarget.addEventListener(
        "contextmenu",
        function (a) {
          return a.preventDefault(), !1;
        },
        !1
      ),
      this.onMouseMove !== null &&
        this.domTarget.addEventListener("mousemove", this.onMouseMove, !1),
      this.onMouseDown !== null &&
        this.domTarget.addEventListener("mousedown", this.onMouseDown, !1),
      this.onMouseUp !== null &&
        this.domTarget.addEventListener("mouseup", this.onMouseUp, !1),
      this.onClick !== null &&
        this.domTarget.addEventListener("click", this.onClick, !1),
      this.onDoubleClick !== null &&
        this.domTarget.addEventListener("dblclick", this.onDoubleClick, !1),
      this.onMouseEnter !== null &&
        this.domTarget.addEventListener("mouseenter", this.onMouseEnter, !1),
      this.onMouseLeave !== null &&
        this.domTarget.addEventListener("mouseleave", this.onMouseLeave, !1),
      this.onMouseWheel !== null &&
        (this.domTarget.addEventListener("mousewheel", this.onMouseWheel, !1),
        this.domTarget.addEventListener(
          "DOMMouseScroll",
          this.onMouseWheel,
          !1
        )),
      this.onTouchStart !== null)
    ) {
      var e = this;
      this.domTarget.addEventListener(
        "touchstart",
        function (a) {
          e.onTouchStart(a);
        },
        { passive: !1 }
      );
    }
    if (this.onTouchMove !== null) {
      var e = this;
      this.domTarget.addEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      });
    }
    this.onTouchEnd !== null &&
      this.domTarget.addEventListener("touchend", this.onTouchEnd, !1);
  }
  isLeftClick(t) {
    return typeof t != "object" ? !1 : t.which == 1;
  }
  isRightClick(t) {
    return typeof t != "object" ? !1 : t.which === 3;
  }
  avoid() {}
  getMouseCoords(t) {
    var e = t.target,
      a = e.getBoundingClientRect(),
      h,
      i;
    if (((h = 1), (i = 1), this.isTouchEvent(t)))
      var o = (t.changedTouches[0].clientX - a.left) * h,
        s = (t.changedTouches[0].clientY - a.top) * i;
    else
      var o = (t.clientX - a.left) * h,
        s = (t.clientY - a.top) * i;
    return { x: o, y: s };
  }
  notify() {
    try {
      this.boundRect = this.domTarget.getBoundingClientRect();
    } catch (t) {
      this.boundRect
        ? ((this.boundRect.width = this.domTarget.clientWidth),
          (this.boundRect.height = this.domTarget.clientHeight))
        : (this.boundRect = {
            width: this.domTarget.clientWidth,
            height: this.domTarget.clientHeight,
          }),
        this.notifyError(t);
    }
    this.isTargetEmpty()
      ? ((this.ratioX = 1), (this.ratioY = 1))
      : ((this.ratioX = Math.round(
          this.domTarget.width / this.boundRect.width
        )),
        (this.ratioY = Math.round(
          this.domTarget.height / this.boundRect.height
        )));
  }
  isTargetEmpty() {
    return (
      typeof this.domTarget.width > "u" ||
      typeof this.domTarget.height > "u" ||
      this.boundRect.width === 0 ||
      this.boundRect.height === 0
    );
  }
  setCoords(t, e) {
    this.state.setCoords(t, e, this.sensivity, this.ratioX, this.ratioY);
  }
  isTouchEvent(t) {
    return t.changedTouches;
  }
  updateCoords(t) {
    let e;
    this.isTouchEvent() ? (e = t.changedTouches[0]) : (e = t),
      this.setCoords(
        (e.clientX - this.boundRect.left) * this.ratioX,
        (e.clientY - this.boundRect.top) * this.ratioY
      );
  }
  getPointerMovement(t) {
    t.target;
    var e = t._movementX * this.sensivity,
      a = t._movementY * this.sensivity;
    return e || (e = 0), a || (a = 0), { x: e, y: a };
  }
  setPointerMovement(t, e) {
    const a = this.state.data.lastCoordsOnScreen;
    return (
      a.x &&
        a.y &&
        ((t._movementX = parseFloat(e.x - a.x)),
        (t._movementY = parseFloat(e.y - a.y))),
      t
    );
  }
  requestPointerLock() {
    var t = this.domTarget;
    t.addEventListener(
      "click",
      function () {
        (t.requestPointerLock =
          t.requestPointerLock ||
          t.mozRequestPointerLock ||
          t.webkitRequestPointerLock),
          t.requestPointerLock && t.requestPointerLock();
      },
      !1
    );
  }
  exitPointerLock() {
    (document.exitPointerLock =
      document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock),
      document.exitPointerLock();
  }
}
class St {
  constructor(t = {}) {
    this.elementsExcluded = new Set(t.elementsExcluded || St.elementsExcluded);
    const e = t.eventsRecognized || St.eventsRecognized;
    (this.handler = t.handler),
      (this.component = t.component),
      (this.keysFired = {}),
      e.forEach((a) => {
        document.addEventListener(a, (h) => {
          if (!this.isAllowed(h)) return;
          const i = h.key.toLowerCase();
          let o;
          if (
            (i !== "control" && i !== "alt" && i !== "shift"
              ? (o =
                  this.handler[
                    `${h.ctrlKey ? "ctrl+" : ""}${h.altKey ? "alt+" : ""}${
                      h.shiftKey ? "shift+" : ""
                    }${i}`
                  ])
              : (o = this.handler[i]),
            typeof o > "u")
          )
            if (typeof this.handler["*"] < "u") o = this.handler["*"];
            else return;
          let s = !0;
          o.triggerOncePerPression === !0 &&
            this.applyTriggerOncePerPressionConstraint(a, i) !== !0 &&
            (s = !1),
            s === !0 && typeof o[a] == "function" && o[a](h, this.component);
        });
      });
  }
  applyTriggerOncePerPressionConstraint(t, e) {
    if (t === "keydown") return this.isFired(e) ? !1 : (this.fire(e), !0);
    if (t === "keyup") return this.unfire(e), !0;
  }
  isAllowed(t) {
    return !(this.isElementExcluded(t) || this.isContentEditable(t));
  }
  isElementExcluded(t) {
    return this.elementsExcluded.has(t.target.tagName.toLowerCase());
  }
  isContentEditable(t) {
    const e = t.target.getAttribute("contenteditable");
    return e !== null || (typeof e == "string" && e.length > 0);
  }
  isFired(t) {
    return this.keysFired[t] === !0;
  }
  fire(t) {
    this.keysFired[t] = !0;
  }
  unfire(t) {
    this.keysFired[t] = !1;
  }
}
St.elementsExcluded = new Set(["textarea", "input"]);
St.eventsRecognized = new Set(["keydown", "keyup"]);
function U(c, t, e) {
  this.data = c !== void 0 ? [c, t, e] : [0, 0, 0];
}
U.initialized = !1;
U.POOL = { instances: [], avaibles: [], initialSize: 10 };
U.initialize = function () {
  if (U.initialized === !1) {
    for (var c = 0; c < U.POOL.initialSize; ++c) {
      var t = new U();
      U.POOL.instances.push(t), U.POOL.avaibles.push(t);
    }
    U.initialized = !0;
  }
};
U.getComplementOfCouple = function (c, t) {
  return t[0].equals(c[0]) || t[0].equals(c[1]) ? t[1] : t[0];
};
U.fromPoints = function (c, t) {
  return new U(t.getX() - c.getX(), t.getY() - c.getY(), t.getZ() - c.getZ());
};
U.local = function (c, t, e) {
  return new U(c, t, e);
};
U.use = function (h, i, o) {
  var a,
    h = h || 0,
    i = i || 0,
    o = o || 0;
  return (
    U.POOL.avaibles.length > 0
      ? (a = U.POOL.avaibles.pop())
      : ((a = new U()), U.POOL.instances.push(a)),
    a.set(h, i, o),
    (a.inUse = !0),
    a
  );
};
U.getOne = function (h, i, o) {
  var a,
    h = h || 0,
    i = i || 0,
    o = o || 0;
  return (
    U.POOL.avaibles.length > 0
      ? (a = U.POOL.avaibles.pop())
      : ((a = new U()), U.POOL.instances.push(a)),
    a.set(h, i, o),
    (a.inUse = !0),
    a
  );
};
U.getInstance = function (c) {
  return c === !0 ? U.use() : new U();
};
U.determinant = function (c, t) {
  return c.getX() * t.getY() - c.getY() * t.getX();
};
U.det3x3 = function (c, t, e) {
  var a = c[0],
    h = t[0],
    i = e[0],
    o = c[1],
    s = t[1],
    f = e[1],
    v = c[2],
    E = t[2],
    y = e[2];
  return a * (s * y - E * f) + o * (E * i - y * h) + v * (h * f - s * i);
};
U.prototype.inUse = !1;
U.prototype.recycle = function () {
  this.inUse === !0 && ((this.inUse = !1), U.POOL.avaibles.push(this));
};
U.prototype.setX = function (c) {
  return (this.data[0] = c), this;
};
U.prototype.setY = function (c) {
  return (this.data[1] = c), this;
};
U.prototype.setZ = function (c) {
  return (this.data[2] = c), this;
};
U.prototype.getX = function (c) {
  return this.data[0];
};
U.prototype.getY = function (c) {
  return this.data[1];
};
U.prototype.getZ = function () {
  return this.data[2];
};
U.prototype.set = function (c, t, e) {
  return (this.data[0] = c), (this.data[1] = t), (this.data[2] = e), this;
};
U.prototype.affect = function (c) {
  return (
    (this.data[0] = c.data[0]),
    (this.data[1] = c.data[1]),
    (this.data[2] = c.data[2]),
    this
  );
};
U.prototype.getNorm = function () {
  return Math.sqrt(
    this.data[0] * this.data[0] +
      this.data[1] * this.data[1] +
      this.data[2] * this.data[2]
  );
};
U.prototype.getNorm2 = function () {
  return (
    this.data[0] * this.data[0] +
    this.data[1] * this.data[1] +
    this.data[2] * this.data[2]
  );
};
U.prototype.normalize = function () {
  var c = this.getNorm();
  return (
    c > 0 && this.set(this.data[0] / c, this.data[1] / c, this.data[2] / c),
    this
  );
};
U.prototype.isNull = function () {
  return this.data[0] === 0 && this.data[1] === 0 && this.data[2] === 0;
};
U.prototype.cross = function (c, t) {
  var e = U.use().affect(c),
    a = U.use().affect(t);
  return (
    this.set(
      e.data[1] * a.data[2] - e.data[2] * a.data[1],
      e.data[2] * a.data[0] - e.data[0] * a.data[2],
      e.data[0] * a.data[1] - e.data[1] * a.data[0]
    ),
    e.recycle(),
    a.recycle(),
    this
  );
};
U.prototype.round = function (c) {
  return (
    this.set(
      Math.round(this.data[0] * c) / c,
      Math.round(this.data[1] * c) / c,
      Math.round(this.data[2] * c) / c
    ),
    this
  );
};
U.prototype.approxEqual = function (c) {
  return this.distance(c) < 0.1;
};
U.prototype.isInSpace = function (c, t) {
  return (
    t === void 0 && (t = 0),
    this.data[0] < c.minX - t ||
      this.data[1] < c.minY - t ||
      this.data[2] < c.minZ - t ||
      this.data[0] > c.maxX + t ||
      this.data[1] > c.maxY + t ||
      this.data[2] > c.maxZ + t
  );
};
U.prototype.isInSpace2D = function (c, t) {
  return (
    t === void 0 && (t = 0),
    this.data[0] < c.minX - t ||
      this.data[1] < c.minY - t ||
      this.data[0] > c.maxX + t ||
      this.data[1] > c.maxY + t
  );
};
U.prototype.copy = function (c) {
  return U.getInstance(c).set(this.data[0], this.data[1], this.data[2]);
};
U.prototype.equals = function (c) {
  return (
    this.data[0] === c.data[0] &&
    this.data[1] === c.data[1] &&
    this.data[2] === c.data[2]
  );
};
U.prototype.distance = function (c) {
  return Math.sqrt(
    (c.data[0] - this.data[0]) * (c.data[0] - this.data[0]) +
      (c.data[1] - this.data[1]) * (c.data[1] - this.data[1]) +
      (c.data[2] - this.data[2]) * (c.data[2] - this.data[2])
  );
};
U.prototype.angle = function (c) {
  var t = this.scalar(c) / (this.getNorm() * c.getNorm());
  function e(a, h, i) {
    return a <= h ? h : a >= i ? i : a;
  }
  return Math.acos(e(t, -1, 1));
};
U.prototype.signedAngleXY = function (c) {
  return Math.atan2(
    this.getX() * c.getY() - this.getY() * c.getX(),
    this.getX() * c.getX() + this.getY() * c.getY()
  );
};
U.prototype.rotateZ = function (c, t) {
  var e = this.data[0] - c.data[0],
    a = this.data[1] - c.data[1],
    h = this.data[2] - c.data[2];
  return (
    this.set(
      e * Math.cos(t) - a * Math.sin(t) + c.data[0],
      e * Math.sin(t) + a * Math.cos(t) + c.data[1],
      h + c.data[2]
    ),
    this
  );
};
U.prototype.get = function (c) {
  return this.data[c];
};
U.from2D = function (c, t, e) {
  return U.getInstance(e).set(c, t, 0);
};
U.prototype.scalar = function (c) {
  return (
    this.data[0] * c.data[0] +
    this.data[1] * c.data[1] +
    this.data[2] * c.data[2]
  );
};
U.prototype.isColinear = function (c) {
  for (var t = 0; c.data[t] === 0 && t < c.data.length; ) t++;
  if (t === c.length - 1) return !1;
  for (
    var e = this.data[t] / c.data[t], a = !0, h = 0;
    h < this.data.length;
    ++h
  )
    c.data[h] !== 0 &&
      ((e > this.data[h] / c.data[h] - 0.1 &&
        e < this.data[h] / c.data[h] + 0.1) ||
        (a = !1));
  return a && e !== 0;
};
U.prototype.minus = function (c, t) {
  return U.getInstance(t).set(
    this.data[0] - c.data[0],
    this.data[1] - c.data[1],
    this.data[2] - c.data[2]
  );
};
U.prototype.plus = function (c, t) {
  return U.getInstance(t).set(
    this.data[0] + c.data[0],
    this.data[1] + c.data[1],
    this.data[2] + c.data[2]
  );
};
U.prototype.add = function (c) {
  return (
    this.set(
      this.data[0] + c.data[0],
      this.data[1] + c.data[1],
      this.data[2] + c.data[2]
    ),
    this
  );
};
U.prototype.substract = function (c) {
  return (
    this.set(
      this.data[0] - c.data[0],
      this.data[1] - c.data[1],
      this.data[2] - c.data[2]
    ),
    this
  );
};
U.prototype.divideScalar = function (c) {
  return (
    c !== 0 && this.set(this.data[0] / c, this.data[1] / c, this.data[2] / c),
    this
  );
};
U.prototype.multiplyScalar = function (c) {
  return this.set(this.data[0] * c, this.data[1] * c, this.data[2] * c), this;
};
U.prototype.distance = function (c) {
  var t = this.minus(c),
    e = t.getNorm();
  return e;
};
U.prototype.transformMat4 = function (c, t) {
  var e = c.data[0],
    a = c.data[1],
    h = c.data[2],
    i = t[3] * e + t[7] * a + t[11] * h + t[15];
  return (
    (i = i || 1),
    this.set(
      (t[0] * e + t[4] * a + t[8] * h + t[12]) / i,
      (t[1] * e + t[5] * a + t[9] * h + t[13]) / i,
      (t[2] * e + t[6] * a + t[10] * h + t[14]) / i
    ),
    this
  );
};
U.prototype.translate = function (c, t, e) {
  return (
    t === void 0
      ? this.set(
          this.data[0] - c.data[0],
          this.data[1] - c.data[1],
          this.data[2] - c.data[2]
        )
      : this.set(this.data[0] + c, this.data[1] + t, this.data[2] + e),
    this
  );
};
U.prototype.inverseSens = function () {
  return (this.data[0] *= -1), (this.data[1] *= -1), (this.data[2] *= -1), this;
};
U.prototype.scale = function (c = 1, t = 1, e = 1) {
  return (this.data[0] *= c), (this.data[1] *= t), (this.data[2] *= e), this;
};
U.prototype.transfert = function (c) {
  this.affect(c(this));
};
U.prototype.swap = function (c) {
  var t = c.data[0],
    e = c.data[1],
    a = c.data[2];
  return (
    (c.data[0] = this.data[0]),
    (c.data[1] = this.data[1]),
    (c.data[2] = this.data[2]),
    this.set(t, e, a),
    this
  );
};
U.prototype.movePoint = function (c, t) {
  this.set(
    this.data[0] + c * t.getX(),
    this.data[1] + c * t.getY(),
    this.data[2] + c * t.getZ()
  );
};
U.prototype.getIndexOfAbsoluteComposanteMax = function () {
  var c = 0,
    t = 0;
  return (
    this.data.forEach(function (e, a) {
      var h = Math.abs(e);
      c < h && ((c = h), (t = a));
    }),
    t
  );
};
U.prototype.isValid = function () {
  const c = this.data[0],
    t = this.data[1],
    e = this.data[2];
  return Number.isFinite(c) && Number.isFinite(t) && Number.isFinite(e);
};
U.prototype.toString = function () {
  return `[x: ${this.data[0]}|y: ${this.data[1]}|z: ${this.data[2]}]`;
};
U.prototype.translateAlongVector = function (c) {
  this.translate(c.getX(), c.getY(), c.getZ());
};
U.initialize();
typeof window < "u" && typeof window.Vec3 > "u" && (window.Vec3 = U);
const _t = {
  getXByDistanceAndAngle(c, t, e) {
    return c + Math.cos(((e % 360) * Math.PI) / 180) * t;
  },
  getYByDistanceAndAngle(c, t, e) {
    return c + Math.sin(((e % 360) * Math.PI) / 180) * -1 * t;
  },
  getReverseAngle(c) {
    var t = (c + 180) % 360;
    return t;
  },
  getAngleBetween2XY(c, t, e, a) {
    var h = a - t,
      i = e - c,
      o = Math.atan2(-h, i);
    o < 0 && (o += 2 * Math.PI);
    var s = (o * 180) / Math.PI;
    return s;
  },
  getDistanceBetween2XY(c, t, e, a) {
    var h = Math.pow(e - c, 2),
      i = Math.pow(t - a, 2),
      o = Math.sqrt(h + i);
    return o;
  },
  rotatePointAroundCenter(c, t, e, a, h) {
    var i = (Math.PI / 180) * h,
      o = Math.cos(i),
      s = Math.sin(i),
      f = o * (e - c) + s * (a - t) + c,
      v = o * (a - t) - s * (e - c) + t;
    return { x: f, y: v };
  },
  getCartesianEquationOfLine(c, t) {
    var e = t.getY() - c.getY(),
      a = c.getX() - t.getX();
    return { a: e, b: a, c: -(c.getY() * a + e * c.getX()) };
  },
  pointCircleCollide(c, t, e, a = !1) {
    if (e === 0) return !1;
    const h = t[0] - c[0],
      i = t[1] - c[1],
      o = h * h + i * i,
      s = o <= e * e;
    return a === !0 ? { distance: Math.sqrt(o), hasCollision: s } : s;
  },
  lineCircleCollide(c, t, e, a, h) {
    if (_t.pointCircleCollide(c, e, a))
      return h && ((h[0] = c[0]), (h[1] = c[1])), !0;
    if (_t.pointCircleCollide(t, e, a))
      return h && ((h[0] = t[0]), (h[1] = t[1])), !0;
    const i = c[0],
      o = c[1],
      s = t[0],
      f = t[1],
      v = e[0],
      E = e[1],
      y = s - i,
      w = f - o,
      d = v - i,
      _ = E - o,
      l = y * y + w * w;
    let m = y,
      u = w;
    if (l > 0) {
      const x = (d * y + _ * w) / l;
      (m *= x), (u *= x);
    }
    h || (h = [0, 0]), (h[0] = i + m), (h[1] = o + u);
    const b = m * m + u * u;
    return _t.pointCircleCollide(h, e, a) && b <= l && m * y + u * w >= 0;
  },
  distancePointToLine2D: function (c, t, e) {
    var a = _t.getCartesianEquationOfLine(t, e),
      h = Math.abs(a.a * c.getX() + a.b * c.getY() + a.c),
      i = a.a * a.a + a.b * a.b;
    return h / Math.sqrt(i);
  },
  distancePointToEdge2D: function (c, t, e, a) {
    const h = c.distance(t),
      i = t.distance(e),
      o = c.distance(e),
      s = i + a,
      f = h < s,
      v = o < s;
    return f && v ? _t.distancePointToLine2D(c, t, e) : Math.min(h, o);
  },
  gauss: function (c) {
    for (var t = 3, e = 0; e < t; e++) {
      for (var a = Math.abs(c[e][e]), h = e, i = e + 1; i < t; i++)
        Math.abs(c[i][e]) > a && ((a = Math.abs(c[i][e])), (h = i));
      for (var i = e; i < t + 1; i++) {
        var o = c[h][i];
        (c[h][i] = c[e][i]), (c[e][i] = o);
      }
      for (i = e + 1; i < t; i++)
        for (var s = -c[i][e] / c[e][e], f = e; f < t + 1; f++)
          e == f ? (c[i][f] = 0) : (c[i][f] += s * c[e][f]);
    }
    for (var v = new Array(t), e = t - 1; e > -1; e--) {
      v[e] = c[e][e] === 0 ? 0 : c[e][t] / c[e][e];
      for (var i = e - 1; i > -1; i--) c[i][t] -= c[i][e] * v[e];
    }
    return v;
  },
  getCartesianEquationOfPlane: function (c, t, e) {
    var a = new U();
    return (
      e !== void 0 ? a.cross(t, e) : a.affect(t),
      {
        a: a.getX(),
        b: a.getY(),
        c: a.getZ(),
        d: -a.getX() * c.getX() - a.getY() * c.getY() - a.getZ() * c.getZ(),
      }
    );
  },
  intersection2D: function (c, t, e, a) {
    var h = c.getX() - t.getX(),
      i = c.getY() - t.getY(),
      o = e.getX() - a.getX(),
      s = e.getY() - a.getY(),
      f = h * s - i * o;
    if (Math.abs(f) < 0.01) return new U(null, null, null);
    var v = c.getX() * t.getY() - c.getY() * t.getX(),
      E = e.getX() * a.getY() - e.getY() * a.getX(),
      y = (v * o - E * h) / f,
      w = (v * s - E * i) / f;
    return new U(y, w, 0);
  },
  AABBRayIntersection: function (c, t, e) {
    var a = U.use(c.min.getX(), c.min.getY(), 0),
      h = U.use(c.max.getX(), c.min.getY(), 0),
      i = U.use(c.min.getX(), c.max.getY(), 0),
      o = U.use(c.max.getX(), c.max.getY(), 0),
      s = [];
    s.push(_t.intersection2D(a, h, t, e)),
      s.push(_t.intersection2D(a, i, t, e)),
      s.push(_t.intersection2D(h, o, t, e)),
      s.push(_t.intersection2D(i, o, t, e));
    var f = [];
    return (
      s.forEach(function (v) {
        v.getX() !== null && c.containsPoint(v) === !0 && f.push(v);
      }),
      a.recycle(),
      h.recycle(),
      i.recycle(),
      o.recycle(),
      f
    );
  },
};
let ne = class {
  constructor(c, t, e, a, h, i) {
    (this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")),
      (this.matrix = this.svg.createSVGMatrix()),
      this.setTransform(c, t, e, a, h, i);
  }
  setTransformMatrix(c) {
    this.matrix = c;
  }
  getTransformMatrix() {
    return this.matrix;
  }
  scale(c, t) {
    this.matrix = this.matrix.scaleNonUniform(c, t);
  }
  rotate(c) {
    this.matrix = this.matrix.rotate((c * 180) / Math.PI);
  }
  translate(c, t) {
    this.matrix = this.matrix.translate(c, t);
  }
  setTransform(c, t, e, a, h, i) {
    (this.matrix.a = c),
      (this.matrix.b = t),
      (this.matrix.c = e),
      (this.matrix.d = a),
      (this.matrix.e = h),
      (this.matrix.f = i);
  }
  transform(c, t, e, a, h, i) {
    var o = this.svg.createSVGMatrix();
    (o.a = c),
      (o.b = t),
      (o.c = e),
      (o.d = a),
      (o.e = h),
      (o.f = i),
      (this.matrix = this.matrix.multiply(o));
  }
  transformCoordinates(c, t) {
    var e = this.svg.createSVGPoint();
    return (
      (e.x = parseFloat(c)),
      (e.y = parseFloat(t)),
      e.matrixTransform(this.matrix.inverse())
    );
  }
  multiply(c) {
    this.matrix.multiply(c);
  }
  getComputedScaleX() {
    return Math.sqrt(
      this.matrix.a * this.matrix.a + this.matrix.c * this.matrix.c
    );
  }
  getComputedScaleY() {
    return Math.sqrt(
      this.matrix.d * this.matrix.d + this.matrix.b * this.matrix.b
    );
  }
  getTx() {
    return this.matrix.e;
  }
  getTy() {
    return this.matrix.f;
  }
  getScaleX() {
    return this.matrix.a;
  }
  getScaleY() {
    return this.matrix.d;
  }
  getSkewX() {
    return this.matrix.b;
  }
  getSkewY() {
    return this.matrix.c;
  }
  flipX() {
    this.matrix = this.matrix.flipX();
  }
  flipY() {
    this.matrix = this.matrix.flipY();
  }
};
const se = 1,
  ae = 0;
class pt {
  constructor(t) {
    const e = t.width,
      a = t.height;
    switch (
      ((this.canvasTag = document.createElement("canvas")),
      (this.canvasTag.width = e),
      (this.canvasTag.height = a),
      (this.canvasTag.style.zIndex = t.cssZIndex),
      (this.canvasTag.style.position = t.cssPosition),
      (this.canvasTag.style.pointerEvents = t.cssPointerEvents),
      (this.context = this.canvasTag.getContext("2d")),
      (this.context.shadowOffsetX = 0),
      (this.context.shadowOffsetY = 0),
      (this.context.shadowBlur = 0),
      (this.context.shadowColor = null),
      (this.transformMatrix = new ne(1, 0, 0, 1, 0, 0)),
      (this.canvasWidth = e),
      (this.canvasHeight = a),
      (this.savedTransforms = []),
      (this.baseLineForText = "top"),
      (this.container = t.canvasDiv),
      t.addStatusId)
    ) {
      case se:
        this.container.appendChild(this.canvasTag);
        break;
      case ae:
        this.container.insertBefore(this.canvasTag, this.container.firstChild);
        break;
      default:
        throw 'missing "addStatusId" parameter';
    }
    (this.ellipsisWidth = 0),
      (this.ellipsis = "..."),
      (this.space = " "),
      (this.spaceWidth = 0),
      t.useMouseController !== !1 && this.setupListener(),
      this.resize(e, a);
  }
  getContainer() {
    return this.container;
  }
  setupListener() {
    const t = this;
    this.mouseController = new It({
      name: "icanvas-mouse-controller",
      domTarget: t.canvasTag,
      defaultIsAvoid: !0,
    });
  }
  getImageUrl() {
    return this.canvasTag.toDataURL("image/png");
  }
  saveImage() {
    window.open(this.canvasTag.toDataURL("image/jpeg", 1));
  }
  getCanvasHeight() {
    return this.canvasHeight;
  }
  setCanvasHeight(t) {
    return (
      (t = Math.floor(t)),
      this.canvasTag.height !== t &&
        ((this.canvasTag.height = t), (this.canvasHeight = t)),
      this.canvasHeight
    );
  }
  getCanvasWidth() {
    return this.canvasWidth;
  }
  setCanvasWidth(t) {
    return (
      (t = Math.floor(t)),
      this.canvasTag.width !== t &&
        ((this.canvasTag.width = t), (this.canvasWidth = t)),
      this.canvasWidth
    );
  }
  setOnMouseDown(t) {
    (this.mouseController.onMouseDown = t),
      (this.mouseController.onTouchStart = t);
  }
  setOnMouseMove(t) {
    (this.mouseController.onMouseMove = t),
      (this.mouseController.onTouchMove = t);
  }
  setOnMouseUp(t) {
    (this.mouseController.onMouseUp = t), (this.mouseController.onTouchEnd = t);
  }
  setOnMouseEnter(t) {
    this.mouseController.onMouseEnter = t;
  }
  setOnMouseLeave(t) {
    this.mouseController.onMouseLeave = t;
  }
  setOnMouseOut(t) {
    this.mouseController.onMouseOut = t;
  }
  setOnMouseWheel(t) {
    this.mouseController.onMouseWheel = t;
  }
  setOnClick(t) {
    this.mouseController.onClick = t;
  }
  setOnDoubleClick(t) {
    this.mouseController.onDoubleClick = t;
  }
  setKeyDownHandler(t) {
    document.addEventListener("keydown", t);
  }
  setId(t) {
    this.canvasTag.setAttribute("id", t);
  }
  setCss(t, e) {
    $(this.canvasTag).css(t, e);
  }
  setLineWidth(t) {
    this.context.lineWidth = t;
  }
  getOffset() {
    return { left: this.canvasTag.offsetLeft, top: this.canvasTag.offsetTop };
  }
  setTextBaseline(t) {
    (this.baseLineForText = t),
      (this.context.textBaseline = this.baseLineForText);
  }
  setTextAlign(t) {
    this.context.textAlign = t;
  }
  setFillStyle(t) {
    this.context.fillStyle = t;
  }
  setStrokeStyle(t) {
    this.context.strokeStyle = t;
  }
  beginPath() {
    this.context.beginPath();
  }
  moveTo(t, e) {
    this.context.moveTo(t, e);
  }
  lineTo(t, e) {
    this.context.lineTo(t, e);
  }
  stroke() {
    this.context.stroke();
  }
  drawLine(t) {
    const e = this.context;
    (e.fillStyle = t.color),
      (e.strokeStyle = t.color),
      e.beginPath(),
      e.moveTo(Math.floor(t.a.getX()), Math.floor(t.a.getY())),
      e.lineTo(Math.floor(t.b.getX()), Math.floor(t.b.getY())),
      e.fill(),
      e.stroke(),
      e.closePath();
  }
  drawImage(t, e, a, h, i) {
    h && i
      ? this.context.drawImage(t, e, a, h, i)
      : this.context.drawImage(t, e, a);
  }
  fillCircle(t, e, a, h, i) {
    this.context.beginPath(), this.context.arc(t, e, a, 0, 2 * Math.PI, !1);
    const o = pt.getColorFromHex(i);
    (this.context.fillStyle =
      "rgba(" + o.r + "," + o.g + "," + o.b + "," + h + ")"),
      this.context.fill();
  }
  strokeCircle(t, e, a, h, i, o) {
    this.context.beginPath(), this.context.arc(t, e, a, 0, 2 * Math.PI, !1);
    var s = pt.getColorFromHex(i);
    (this.context.lineWidth = o),
      (this.context.strokeStyle =
        "rgba(" + s.r + "," + s.g + "," + s.b + "," + h + ")"),
      this.context.stroke();
  }
  fillEllipsis(t, e, a, h, i, o, s) {
    this.context.beginPath(),
      this.context.ellipse(t, e, a, h, i, 0, Math.PI * 2, !1);
    var f = pt.getColorFromHex(s);
    (this.context.fillStyle =
      "rgba(" + f.r + "," + f.g + "," + f.b + "," + o + ")"),
      this.context.fill();
  }
  strokeEllipsis(t, e, a, h, i, o, s, f) {
    this.context.beginPath(),
      this.context.ellipse(
        t,
        e,
        Math.abs(a),
        Math.abs(h),
        i,
        0,
        Math.PI * 2,
        !1
      ),
      (this.context.lineWidth = f);
    var v = pt.getColorFromHex(s);
    (this.context.strokeStyle =
      "rgba(" + v.r + "," + v.g + "," + v.b + "," + o + ")"),
      this.context.stroke();
  }
  drawRect(t, e, a, h, i, o) {
    this.context.beginPath(), this.context.rect(t, e, a, h);
    const s = pt.getColorFromHex(o);
    (this.context.fillStyle =
      "rgba(" + s.r + "," + s.g + "," + s.b + "," + i + ")"),
      this.context.fill();
  }
  strokeRect(t, e, a, h, i, o) {
    this.context.beginPath(), this.context.rect(t, e, a, h);
    const s = pt.getColorFromHex(o);
    (this.context.strokeStyle =
      "rgba(" + s.r + "," + s.g + "," + s.b + "," + i + ")"),
      this.context.stroke();
  }
  fillRect(t, e, a, h, i, o) {
    this.context.beginPath(), this.context.rect(t, e, a, h);
    const s = pt.getColorFromHex(o);
    (this.context.fillStyle =
      "rgba(" + s.r + "," + s.g + "," + s.b + "," + i + ")"),
      this.context.fill();
  }
  clearCanvas(
    t = 0,
    e = 0,
    a = this.getCanvasWidth(),
    h = this.getCanvasHeight(),
    i = !1
  ) {
    i === !0 && (this.saveCanvas(), this.setTransform(1, 0, 0, 1, 0, 0)),
      this.context.clearRect(t, e, a, h),
      i === !0 && this.restoreCanvas();
  }
  saveCanvas() {
    this.savedTransforms.push(
      new TransformMatrix(
        this.getScaleX(),
        this.getSkewX(),
        this.getSkewY(),
        this.getScaleY(),
        this.getTx(),
        this.getTy()
      )
    ),
      this.context.save();
  }
  restoreCanvas() {
    (this.transformMatrix = this.savedTransforms.pop()), this.context.restore();
  }
  setGlobalAlpha(t) {
    this.context.globalAlpha = t;
  }
  resize(t, e) {
    (this.canvasWidth = t),
      (this.canvasHeight = e),
      (this.canvasTag.width = t),
      (this.canvasTag.height = e),
      (this.context.textBaseline = this.baseLineForText);
  }
  getTransformMatrix() {
    return this.transformMatrix;
  }
  scale(t, e) {
    this.transformMatrix.scale(t, e), this.context.scale(t, e);
  }
  rotate(t) {
    this.transformMatrix.rotate(t), this.context.rotate(t);
  }
  translate(t, e) {
    this.transformMatrix.translate(t, e), this.context.translate(t, e);
  }
  setTransform(t, e, a, h, i, o) {
    this.transformMatrix.setTransform(t, e, a, h, i, o),
      this.context.setTransform(t, e, a, h, i, o);
  }
  transform(t, e, a, h, i, o) {
    this.transformMatrix.transform(t, e, a, h, i, o),
      this.context.transform(t, e, a, h, i, o);
  }
  transformCoordinates(t, e) {
    return this.transformMatrix.transformCoordinates(t, e);
  }
  getTx() {
    return this.transformMatrix.getTx();
  }
  getTy() {
    return this.transformMatrix.getTy();
  }
  getComputedScaleX(t) {
    return (t ? -1 : 1) * this.transformMatrix.getComputedScaleX();
  }
  getComputedScaleY(t) {
    return t
      ? -this.transformMatrix.getComputedScaleY()
      : this.transformMatrix.getComputedScaleY();
  }
  getScaleX() {
    return this.transformMatrix.getScaleX();
  }
  getScaleY() {
    return this.transformMatrix.getScaleY();
  }
  getSkewX() {
    return this.transformMatrix.getSkewX();
  }
  getSkewY() {
    return this.transformMatrix.getSkewY();
  }
  flipX() {
    this.transformMatrix.flipX(),
      this.setTransform(
        -this.transformMatrix.getScaleX(),
        -this.transformMatrix.getSkewX(),
        -this.transformMatrix.getSkewY(),
        this.transformMatrix.getScaleY(),
        this.transformMatrix.getTx(),
        this.transformMatrix.getTy()
      );
  }
  flipX2() {
    this.transformMatrix.flipX(),
      this.setTransform(
        this.transformMatrix.getScaleX(),
        -this.transformMatrix.getSkewX(),
        this.transformMatrix.getSkewY(),
        this.transformMatrix.getScaleY(),
        this.transformMatrix.getTx(),
        this.transformMatrix.getTy()
      );
  }
  flipY2() {
    this.transformMatrix.flipY(),
      this.setTransform(
        -this.transformMatrix.getScaleX(),
        -this.transformMatrix.getSkewX(),
        -this.transformMatrix.getSkewY(),
        this.transformMatrix.getScaleY(),
        this.transformMatrix.getTx(),
        this.transformMatrix.getTy()
      );
  }
  flipXY() {
    this.transformMatrix.flipX(),
      this.setTransform(
        -this.transformMatrix.getScaleX(),
        this.transformMatrix.getSkewX(),
        this.transformMatrix.getSkewY(),
        this.transformMatrix.getScaleY(),
        this.transformMatrix.getTx(),
        this.transformMatrix.getTy()
      );
  }
  flipY() {
    this.transformMatrix.flipY(),
      this.setTransform(
        this.transformMatrix.getScaleX(),
        this.transformMatrix.getSkewX(),
        -this.transformMatrix.getSkewY(),
        this.transformMatrix.getScaleY(),
        this.transformMatrix.getTx(),
        this.transformMatrix.getTy()
      );
  }
  measureTextInCanvas(t) {
    return this.context.measureText(t).width;
  }
  stringEllipsis(t, e, a) {
    let h = this.context.measureText(t).width;
    if (h < e && a === !1) return t;
    {
      let i = t.length;
      for (; h >= e - this.ellipsisWidth && i-- > 0; )
        (t = t.substring(0, i)), (h = this.context.measureText(t).width);
      return t + this.ellipsis;
    }
  }
  drawMultilineText(t, e, a, h, i, o, s, f) {
    if (f === !1) var v = Math.ceil(e + h);
    else var v = Math.ceil(e);
    var E = Math.ceil(a),
      y = this.context.measureText(t).width,
      w = 0;
    if (y > h) {
      for (
        var d = this,
          _ = t.split(this.space),
          l = _.map(function (j) {
            return d.context.measureText(j).width;
          }),
          m = !1,
          u = 0,
          b = 0,
          x = 0,
          T = 0,
          S = 0;
        S < o;
        ++S
      ) {
        for (; u < l.length && x < h; ) (x += l[u]), ++u;
        if (
          (x > h && u > b + 1 && (--u, (x -= l[u])),
          S == 0 && (T = x),
          S < o - 1)
        )
          this.context.fillText(_.slice(b, u).join(" "), v, E + i * S),
            (x += (u - b) * this.spaceWidth);
        else if (u - b === 0 && u < _.length) {
          ++u, (x += l[u]), (m = !0);
          var R = _.slice(b, u).join(this.space),
            F = this.context.measureText(R).width;
          F < h
            ? ((R = this.stringEllipsis(R, h, u < l.length)),
              (x += (u - b) * this.spaceWidth + this.ellipsisWidth))
            : (x += (u - b) * this.spaceWidth),
            this.context.fillText(R, v, E + i * S);
        } else if (u - b !== 0 && u <= _.length) {
          m = !0;
          var R = _.slice(b, u).join(this.space),
            F = this.context.measureText(R).width;
          F < h
            ? ((R = this.stringEllipsis(R, h, u < l.length)),
              (x += (u - b) * this.spaceWidth + this.ellipsisWidth))
            : (x += (u - b) * this.spaceWidth),
            this.context.fillText(R, v, E + i * S);
        }
        w < x && (w = x),
          s &&
            ((x = Math.ceil(x)),
            this.context.beginPath(),
            f === !1
              ? (this.context.moveTo(v, E + 2 + i * (S + 1)),
                this.context.lineTo(v - x, E + 2 + i * (S + 1)))
              : (this.context.moveTo(v, E + 2 + i * (S + 1)),
                this.context.lineTo(v + x, E + 2 + i * (S + 1))),
            this.context.stroke()),
          (x = 0),
          (b = u);
      }
      return { lengthOfFirstLine: (m === !0 ? -1 : 1) * T, maxLength: w };
    } else
      return (
        this.context.fillText(t, v, E),
        s &&
          (this.context.beginPath(),
          this.context.moveTo(v, E + i + 2),
          f === !1
            ? this.context.lineTo(v - y, E + i + 2)
            : this.context.lineTo(e + y, E + i + 2),
          this.context.stroke()),
        { lengthOfFirstLine: y, maxLength: y }
      );
  }
  getLabelInfos(t, e, a, h) {
    var i = this.context.measureText(t).width,
      o = Math.min(Math.max(Math.ceil(i / a), 1), h),
      s = o * (e + EAnatomyViewer.STYLE.LINE_INTERVAL_PX);
    return LabelToDrawInfos.getOne(s, t, t.length, o);
  }
  setCanvasBackground(t) {
    this.canvasTag.style.backgroundColor = "#" + t;
  }
  hide() {
    this.canvasTag.style.display = "none";
  }
  show() {
    this.canvasTag.style.display = "block";
  }
  static recycleColor(t) {}
  getColor(t) {}
  static getColorFromHex(t) {
    if (
      (t.charAt(0) == "#" && (t = t.substr(1)),
      pt.COLOR_POOL.AVAILABLE.length > 0)
    )
      var e = pt.COLOR_POOL.AVAILABLE.pop();
    else var e = { r: 0, g: 0, b: 0 };
    var a = parseInt(t, 16);
    return (e.r = a >> 16), (e.g = (a >> 8) & 255), (e.b = a & 255), e;
  }
}
pt.COLOR_POOL = {
  AVAILABLE: [
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
  ],
};
class de {
  constructor(t, e, a) {
    (this.a = t), (this.b = e), (this.color = a), (this.accuracy = 0.1);
  }
  getDirection(t = !1) {
    return U.getInstance(t).affect(this.b).substract(this.a).normalize();
  }
  recycle() {
    this.a.recycle(), this.b.recycle();
  }
  setAccuracy(t) {
    this.accuracy = t;
  }
  hasPoint(t) {
    const e = t.distance(this.a),
      a = this.a.distance(this.b),
      h = t.distance(this.b);
    return Math.abs(e + h - a) < this.accuracy;
  }
  getIntersectionWith(t) {
    let e = _t.intersection2D(this.a, this.b, t.a, t.b);
    return e !== null && this.hasPoint(e) === !1 && (e = null), e;
  }
}
class vt extends mt {
  constructor(t) {
    super(wt({ name: "pointer-controller" }, t)),
      (this.target = t.target),
      (this.handlers = {
        pointer: new It({
          domTarget: this.target,
          onMouseMove: this.onMouseMove.bind(this),
          onMouseDown: this.onMouseDown.bind(this),
          onMouseUp: this.onMouseUp.bind(this),
          onClick: this.onClick.bind(this),
          onDoubleClick: this.onDoubleClick.bind(this),
          onMouseEnter: this.onMouseEnter.bind(this),
          onMouseLeave: this.onMouseLeave.bind(this),
          onMouseWheel: this.onMouseWheel.bind(this),
        }),
      }),
      (this.state = { pointer: t.state.pointer || new Mt() });
    const e = t.clickSensitivity || {};
    (this.clickSensitivity = { min: e.min || 80, max: e.max || 200 }),
      (this.lastClickTimestamp = Date.now()),
      (this.lastDBClickTimestamp = Date.now()),
      (this.longClickTimer = null);
  }
  updatePointerCoords(t) {
    this.state.pointer.update(t),
      (this.state.pointer.data.lastCoordsOnScreen.x = t.clientX),
      (this.state.pointer.data.lastCoordsOnScreen.y = t.clientY);
  }
  clearLongClickTimer() {
    clearTimeout(this.longClickTimer), (this.longClickTimer = null);
  }
  enable() {
    this.data.enabled = !0;
  }
  disable() {
    this.data.enabled = !1;
  }
  isEnabled() {
    return this.data.enabled === !0;
  }
  onMouseMove(t) {
    this.isEnabled() === !0 &&
      (this.updatePointerCoords(t),
      this.publish(vt.EVENT.POINTER_MOVE, t),
      this.clearLongClickTimer());
  }
  onMouseDown(t) {
    this.updatePointerCoords(t),
      this.state.pointer.setMouseDownTarget(t.target),
      (this.state.pointer.isDown = !0);
    const e = Date.now(),
      a = e - this.lastClickTimestamp;
    if (a <= this.clickSensitivity.min) this.lastClickTimestamp = e;
    else {
      if (
        ((this.state.pointer.isDown = !0),
        (this.lastClickTimestamp = e),
        a < this.clickSensitivity.max)
      )
        return this.onDoubleClick(t);
      this.longClickTimer === null &&
        (this.longClickTimer = setTimeout(() => {
          this.publish(vt.EVENT.LONG_CLICK);
        }, 500)),
        this.publish(vt.EVENT.POINTER_DOWN, t);
    }
  }
  onMouseUp(t) {
    this.updatePointerCoords(t),
      clearTimeout(this.longClickTimer),
      (this.state.pointer.isDown = !1),
      this.publish(vt.EVENT.POINTER_UP, t),
      t.preventDefault();
  }
  onMouseEnter(t) {
    this.updatePointerCoords(t), this.publish(vt.EVENT.POINTER_ENTER, t);
  }
  onMouseLeave(t) {
    this.state.pointer.isDown &&
      ((this.state.pointer.isDown = !1), this.clearLongClickTimer()),
      this.publish(vt.EVENT.POINTER_LEAVE, t);
  }
  onMouseWheel(t) {
    this.publish(vt.EVENT.MOUSE_WHEEL, t);
  }
  onClick(t) {}
  onDoubleClick(t) {
    const e = Date.now();
    e - this.lastDBClickTimestamp < this.clickSensitivity.min * 2 ||
      ((this.lastDBClickTimestamp = e),
      (this.lastClickTimestamp = e),
      this.publish(vt.EVENT.DOUBLE_CLICK, t));
  }
  static isRightClick(t) {
    return t.which === 3 || t.button === 2;
  }
}
vt.EVENT = {
  POINTER_MOVE: "pointer-move",
  POINTER_DOWN: "pointer-down",
  POINTER_UP: "pointer-up",
  POINTER_ENTER: "pointer-enter",
  POINTER_LEAVE: "pointer-leave",
  LONG_CLICK: "long-click",
  DOUBLE_CLICK: "double-click",
  MOUSE_WHEEL: "mouse-wheel",
};
class Lt extends jt {
  constructor(t) {
    super(),
      (this.initialize = (e) => {
        this.init(e, t);
      });
  }
  init(t, e) {
    return (
      t.store("isFullScreen", !1),
      Lt.isSafariIOS()
        ? this.initFullscreenModeForIOS(t, e.element)
        : this.initFullscreenMode(t, e.element),
      this
    );
  }
  onFullScreen(t, e) {
    t.emit("onFullScreen"),
      t.store("isFullScreen", !0),
      e.classList.add("fullscreen"),
      t.publish(Nt.ON_FULLSCREEN);
  }
  onExitFullScreen(t, e) {
    t.emit("onExitFullscreen"),
      t.store("isFullScreen", !1),
      e.classList.remove("fullscreen"),
      t.publish(Nt.ON_EXIT_FULLSCREEN);
  }
  onFullScreenChange(t, e) {
    document[this.getLeaveFullscreenHandler(t).propertyName] !== e &&
      this.onExitFullScreen(t, e);
  }
  initFullscreenModeForIOS(t, e) {
    const a = document.body,
      h = (i) => {
        try {
          i.preventDefault();
        } catch (o) {
          t.notifyError(o);
        }
      };
    t.setBehavior("toggleFullScreen", () => {
      t.get("isFullScreen") === !1
        ? (e.classList.add("fullscreen"),
          a.classList.add("no-scroll"),
          (a.ontouchmove = h),
          (a.parentElement.ontouchmove = h),
          (e.style.height = window.innerHeight + "px"))
        : (e.classList.remove("fullscreen"),
          a.classList.remove("no-scroll"),
          (a.ontouchmove = null),
          (a.parentElement.ontouchmove = null),
          (e.style.height = ""));
    });
  }
  initFullscreenMode(t, e) {
    const a = this.getFullscreenHandler(t, e);
    t.listen(a.eventName, () => {
      this.onFullScreenChange(t, e);
    }),
      a.eventName !== "fullscreenchange" &&
        t.listen("fullscreenchange", () => {
          this.onFullScreenChange(t, e);
        }),
      t.setBehavior("toggleFullScreen", () => {
        t.get("isFullScreen") === !1
          ? (a.requestFullScreen(), this.onFullScreen(t, e))
          : (a.exitFullscreen(), this.onExitFullScreen(t, e));
      });
  }
  getOpenFullscreenHandler(t, e = document.body) {
    let a, h;
    return (
      typeof e.requestFullscreen == "function"
        ? ((a = "requestFullscreen"), (h = "fullscreenChange"))
        : typeof e.mozRequestFullScreen == "function"
        ? ((a = "mozRequestFullScreen"), (h = "mozfullscreenchange"))
        : typeof e.webkitRequestFullscreen == "function"
        ? ((a = "webkitRequestFullScreen"), (h = "webkitfullscreenchange"))
        : typeof e.msRequestFullscreen == "function" &&
          ((a = "msRequestFullscreen"), (h = "MSFullscreenChange")),
      {
        requestFullScreen() {
          try {
            e[a]();
          } catch (i) {
            t.notifyError(i);
          }
        },
        eventName: h,
      }
    );
  }
  getLeaveFullscreenHandler(t) {
    let e = null,
      a = null;
    if (typeof document.exitFullscreen == "function") e = "exitFullscreen";
    else if (typeof document.webkitExitFullscreen == "function")
      e = "webkitExitFullscreen";
    else if (typeof document.mozCancelFullScreen == "function")
      e = "mozCancelFullScreen";
    else if (typeof document.msExitFullscreen == "function")
      e = "msExitFullscreen";
    else throw new Error("No exit fullscreen method");
    if ("fullscreenElement" in document) a = "fullscreenElement";
    else if ("webkitFullscreenElement" in document)
      a = "webkitFullscreenElement";
    else if ("mozFullScreenElement" in document) a = "mozFullScreenElement";
    else if ("msFullscreenElement" in document) a = "msFullscreenElement ";
    else throw new Error("No fullscreen element property");
    return {
      exitFullscreen() {
        if (a === null || document[a])
          try {
            document[e]();
          } catch (h) {
            t.notifyError(h);
          }
      },
      propertyName: a,
    };
  }
  getFullscreenHandler(t, e = document.body) {
    return wt(
      wt({}, this.getOpenFullscreenHandler(t, e)),
      this.getLeaveFullscreenHandler(t)
    );
  }
  static isSafariIOS() {
    return (
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) !== null &&
      navigator.userAgent.match(/AppleWebKit/) !== null
    );
  }
}
const Nt = {
  ON_FULLSCREEN: "onFullscreen",
  ON_EXIT_FULLSCREEN: "onExitFullscreen",
};
function fe(c, t) {
  return new Lt(t);
}
const pe = "1.1.3";
function zt(c) {
  throw new Error(
    'Could not dynamically require "' +
      c +
      '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
  );
}
var Wt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/ (function (c, t) {
  (function (e) {
    c.exports = e();
  })(function () {
    return (function e(a, h, i) {
      function o(v, E) {
        if (!h[v]) {
          if (!a[v]) {
            var y = typeof zt == "function" && zt;
            if (!E && y) return y(v, !0);
            if (s) return s(v, !0);
            var w = new Error("Cannot find module '" + v + "'");
            throw ((w.code = "MODULE_NOT_FOUND"), w);
          }
          var d = (h[v] = { exports: {} });
          a[v][0].call(
            d.exports,
            function (_) {
              var l = a[v][1][_];
              return o(l || _);
            },
            d,
            d.exports,
            e,
            a,
            h,
            i
          );
        }
        return h[v].exports;
      }
      for (var s = typeof zt == "function" && zt, f = 0; f < i.length; f++)
        o(i[f]);
      return o;
    })(
      {
        1: [
          function (e, a, h) {
            var i = e("./utils"),
              o = e("./support"),
              s =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            (h.encode = function (f) {
              for (
                var v,
                  E,
                  y,
                  w,
                  d,
                  _,
                  l,
                  m = [],
                  u = 0,
                  b = f.length,
                  x = b,
                  T = i.getTypeOf(f) !== "string";
                u < f.length;

              )
                (x = b - u),
                  (y = T
                    ? ((v = f[u++]),
                      (E = u < b ? f[u++] : 0),
                      u < b ? f[u++] : 0)
                    : ((v = f.charCodeAt(u++)),
                      (E = u < b ? f.charCodeAt(u++) : 0),
                      u < b ? f.charCodeAt(u++) : 0)),
                  (w = v >> 2),
                  (d = ((3 & v) << 4) | (E >> 4)),
                  (_ = 1 < x ? ((15 & E) << 2) | (y >> 6) : 64),
                  (l = 2 < x ? 63 & y : 64),
                  m.push(s.charAt(w) + s.charAt(d) + s.charAt(_) + s.charAt(l));
              return m.join("");
            }),
              (h.decode = function (f) {
                var v,
                  E,
                  y,
                  w,
                  d,
                  _,
                  l = 0,
                  m = 0,
                  u = "data:";
                if (f.substr(0, u.length) === u)
                  throw new Error(
                    "Invalid base64 input, it looks like a data url."
                  );
                var b,
                  x = (3 * (f = f.replace(/[^A-Za-z0-9+/=]/g, "")).length) / 4;
                if (
                  (f.charAt(f.length - 1) === s.charAt(64) && x--,
                  f.charAt(f.length - 2) === s.charAt(64) && x--,
                  x % 1 != 0)
                )
                  throw new Error("Invalid base64 input, bad content length.");
                for (
                  b = o.uint8array ? new Uint8Array(0 | x) : new Array(0 | x);
                  l < f.length;

                )
                  (v =
                    (s.indexOf(f.charAt(l++)) << 2) |
                    ((w = s.indexOf(f.charAt(l++))) >> 4)),
                    (E =
                      ((15 & w) << 4) | ((d = s.indexOf(f.charAt(l++))) >> 2)),
                    (y = ((3 & d) << 6) | (_ = s.indexOf(f.charAt(l++)))),
                    (b[m++] = v),
                    d !== 64 && (b[m++] = E),
                    _ !== 64 && (b[m++] = y);
                return b;
              });
          },
          { "./support": 30, "./utils": 32 },
        ],
        2: [
          function (e, a, h) {
            var i = e("./external"),
              o = e("./stream/DataWorker"),
              s = e("./stream/Crc32Probe"),
              f = e("./stream/DataLengthProbe");
            function v(E, y, w, d, _) {
              (this.compressedSize = E),
                (this.uncompressedSize = y),
                (this.crc32 = w),
                (this.compression = d),
                (this.compressedContent = _);
            }
            (v.prototype = {
              getContentWorker: function () {
                var E = new o(i.Promise.resolve(this.compressedContent))
                    .pipe(this.compression.uncompressWorker())
                    .pipe(new f("data_length")),
                  y = this;
                return (
                  E.on("end", function () {
                    if (this.streamInfo.data_length !== y.uncompressedSize)
                      throw new Error("Bug : uncompressed data size mismatch");
                  }),
                  E
                );
              },
              getCompressedWorker: function () {
                return new o(i.Promise.resolve(this.compressedContent))
                  .withStreamInfo("compressedSize", this.compressedSize)
                  .withStreamInfo("uncompressedSize", this.uncompressedSize)
                  .withStreamInfo("crc32", this.crc32)
                  .withStreamInfo("compression", this.compression);
              },
            }),
              (v.createWorkerFrom = function (E, y, w) {
                return E.pipe(new s())
                  .pipe(new f("uncompressedSize"))
                  .pipe(y.compressWorker(w))
                  .pipe(new f("compressedSize"))
                  .withStreamInfo("compression", y);
              }),
              (a.exports = v);
          },
          {
            "./external": 6,
            "./stream/Crc32Probe": 25,
            "./stream/DataLengthProbe": 26,
            "./stream/DataWorker": 27,
          },
        ],
        3: [
          function (e, a, h) {
            var i = e("./stream/GenericWorker");
            (h.STORE = {
              magic: "\0\0",
              compressWorker: function () {
                return new i("STORE compression");
              },
              uncompressWorker: function () {
                return new i("STORE decompression");
              },
            }),
              (h.DEFLATE = e("./flate"));
          },
          { "./flate": 7, "./stream/GenericWorker": 28 },
        ],
        4: [
          function (e, a, h) {
            var i = e("./utils"),
              o = (function () {
                for (var s, f = [], v = 0; v < 256; v++) {
                  s = v;
                  for (var E = 0; E < 8; E++)
                    s = 1 & s ? 3988292384 ^ (s >>> 1) : s >>> 1;
                  f[v] = s;
                }
                return f;
              })();
            a.exports = function (s, f) {
              return s !== void 0 && s.length
                ? i.getTypeOf(s) !== "string"
                  ? (function (v, E, y, w) {
                      var d = o,
                        _ = w + y;
                      v ^= -1;
                      for (var l = w; l < _; l++)
                        v = (v >>> 8) ^ d[255 & (v ^ E[l])];
                      return -1 ^ v;
                    })(0 | f, s, s.length, 0)
                  : (function (v, E, y, w) {
                      var d = o,
                        _ = w + y;
                      v ^= -1;
                      for (var l = w; l < _; l++)
                        v = (v >>> 8) ^ d[255 & (v ^ E.charCodeAt(l))];
                      return -1 ^ v;
                    })(0 | f, s, s.length, 0)
                : 0;
            };
          },
          { "./utils": 32 },
        ],
        5: [
          function (e, a, h) {
            (h.base64 = !1),
              (h.binary = !1),
              (h.dir = !1),
              (h.createFolders = !0),
              (h.date = null),
              (h.compression = null),
              (h.compressionOptions = null),
              (h.comment = null),
              (h.unixPermissions = null),
              (h.dosPermissions = null);
          },
          {},
        ],
        6: [
          function (e, a, h) {
            var i = null;
            (i = typeof Promise != "undefined" ? Promise : e("lie")),
              (a.exports = { Promise: i });
          },
          { lie: 37 },
        ],
        7: [
          function (e, a, h) {
            var i =
                typeof Uint8Array != "undefined" &&
                typeof Uint16Array != "undefined" &&
                typeof Uint32Array != "undefined",
              o = e("pako"),
              s = e("./utils"),
              f = e("./stream/GenericWorker"),
              v = i ? "uint8array" : "array";
            function E(y, w) {
              f.call(this, "FlateWorker/" + y),
                (this._pako = null),
                (this._pakoAction = y),
                (this._pakoOptions = w),
                (this.meta = {});
            }
            (h.magic = "\b\0"),
              s.inherits(E, f),
              (E.prototype.processChunk = function (y) {
                (this.meta = y.meta),
                  this._pako === null && this._createPako(),
                  this._pako.push(s.transformTo(v, y.data), !1);
              }),
              (E.prototype.flush = function () {
                f.prototype.flush.call(this),
                  this._pako === null && this._createPako(),
                  this._pako.push([], !0);
              }),
              (E.prototype.cleanUp = function () {
                f.prototype.cleanUp.call(this), (this._pako = null);
              }),
              (E.prototype._createPako = function () {
                this._pako = new o[this._pakoAction]({
                  raw: !0,
                  level: this._pakoOptions.level || -1,
                });
                var y = this;
                this._pako.onData = function (w) {
                  y.push({ data: w, meta: y.meta });
                };
              }),
              (h.compressWorker = function (y) {
                return new E("Deflate", y);
              }),
              (h.uncompressWorker = function () {
                return new E("Inflate", {});
              });
          },
          { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 },
        ],
        8: [
          function (e, a, h) {
            function i(d, _) {
              var l,
                m = "";
              for (l = 0; l < _; l++)
                (m += String.fromCharCode(255 & d)), (d >>>= 8);
              return m;
            }
            function o(d, _, l, m, u, b) {
              var x,
                T,
                S = d.file,
                R = d.compression,
                F = b !== v.utf8encode,
                j = s.transformTo("string", b(S.name)),
                I = s.transformTo("string", v.utf8encode(S.name)),
                H = S.comment,
                Q = s.transformTo("string", b(H)),
                k = s.transformTo("string", v.utf8encode(H)),
                L = I.length !== S.name.length,
                n = k.length !== H.length,
                B = "",
                et = "",
                W = "",
                rt = S.dir,
                X = S.date,
                tt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
              (_ && !l) ||
                ((tt.crc32 = d.crc32),
                (tt.compressedSize = d.compressedSize),
                (tt.uncompressedSize = d.uncompressedSize));
              var z = 0;
              _ && (z |= 8), F || (!L && !n) || (z |= 2048);
              var O = 0,
                J = 0;
              rt && (O |= 16),
                u === "UNIX"
                  ? ((J = 798),
                    (O |= (function (q, ot) {
                      var ct = q;
                      return q || (ct = ot ? 16893 : 33204), (65535 & ct) << 16;
                    })(S.unixPermissions, rt)))
                  : ((J = 20),
                    (O |= (function (q) {
                      return 63 & (q || 0);
                    })(S.dosPermissions))),
                (x = X.getUTCHours()),
                (x <<= 6),
                (x |= X.getUTCMinutes()),
                (x <<= 5),
                (x |= X.getUTCSeconds() / 2),
                (T = X.getUTCFullYear() - 1980),
                (T <<= 4),
                (T |= X.getUTCMonth() + 1),
                (T <<= 5),
                (T |= X.getUTCDate()),
                L &&
                  ((et = i(1, 1) + i(E(j), 4) + I),
                  (B += "up" + i(et.length, 2) + et)),
                n &&
                  ((W = i(1, 1) + i(E(Q), 4) + k),
                  (B += "uc" + i(W.length, 2) + W));
              var V = "";
              return (
                (V += `
\0`),
                (V += i(z, 2)),
                (V += R.magic),
                (V += i(x, 2)),
                (V += i(T, 2)),
                (V += i(tt.crc32, 4)),
                (V += i(tt.compressedSize, 4)),
                (V += i(tt.uncompressedSize, 4)),
                (V += i(j.length, 2)),
                (V += i(B.length, 2)),
                {
                  fileRecord: y.LOCAL_FILE_HEADER + V + j + B,
                  dirRecord:
                    y.CENTRAL_FILE_HEADER +
                    i(J, 2) +
                    V +
                    i(Q.length, 2) +
                    "\0\0\0\0" +
                    i(O, 4) +
                    i(m, 4) +
                    j +
                    B +
                    Q,
                }
              );
            }
            var s = e("../utils"),
              f = e("../stream/GenericWorker"),
              v = e("../utf8"),
              E = e("../crc32"),
              y = e("../signature");
            function w(d, _, l, m) {
              f.call(this, "ZipFileWorker"),
                (this.bytesWritten = 0),
                (this.zipComment = _),
                (this.zipPlatform = l),
                (this.encodeFileName = m),
                (this.streamFiles = d),
                (this.accumulate = !1),
                (this.contentBuffer = []),
                (this.dirRecords = []),
                (this.currentSourceOffset = 0),
                (this.entriesCount = 0),
                (this.currentFile = null),
                (this._sources = []);
            }
            s.inherits(w, f),
              (w.prototype.push = function (d) {
                var _ = d.meta.percent || 0,
                  l = this.entriesCount,
                  m = this._sources.length;
                this.accumulate
                  ? this.contentBuffer.push(d)
                  : ((this.bytesWritten += d.data.length),
                    f.prototype.push.call(this, {
                      data: d.data,
                      meta: {
                        currentFile: this.currentFile,
                        percent: l ? (_ + 100 * (l - m - 1)) / l : 100,
                      },
                    }));
              }),
              (w.prototype.openedSource = function (d) {
                (this.currentSourceOffset = this.bytesWritten),
                  (this.currentFile = d.file.name);
                var _ = this.streamFiles && !d.file.dir;
                if (_) {
                  var l = o(
                    d,
                    _,
                    !1,
                    this.currentSourceOffset,
                    this.zipPlatform,
                    this.encodeFileName
                  );
                  this.push({ data: l.fileRecord, meta: { percent: 0 } });
                } else this.accumulate = !0;
              }),
              (w.prototype.closedSource = function (d) {
                this.accumulate = !1;
                var _ = this.streamFiles && !d.file.dir,
                  l = o(
                    d,
                    _,
                    !0,
                    this.currentSourceOffset,
                    this.zipPlatform,
                    this.encodeFileName
                  );
                if ((this.dirRecords.push(l.dirRecord), _))
                  this.push({
                    data: (function (m) {
                      return (
                        y.DATA_DESCRIPTOR +
                        i(m.crc32, 4) +
                        i(m.compressedSize, 4) +
                        i(m.uncompressedSize, 4)
                      );
                    })(d),
                    meta: { percent: 100 },
                  });
                else
                  for (
                    this.push({ data: l.fileRecord, meta: { percent: 0 } });
                    this.contentBuffer.length;

                  )
                    this.push(this.contentBuffer.shift());
                this.currentFile = null;
              }),
              (w.prototype.flush = function () {
                for (
                  var d = this.bytesWritten, _ = 0;
                  _ < this.dirRecords.length;
                  _++
                )
                  this.push({
                    data: this.dirRecords[_],
                    meta: { percent: 100 },
                  });
                var l = this.bytesWritten - d,
                  m = (function (u, b, x, T, S) {
                    var R = s.transformTo("string", S(T));
                    return (
                      y.CENTRAL_DIRECTORY_END +
                      "\0\0\0\0" +
                      i(u, 2) +
                      i(u, 2) +
                      i(b, 4) +
                      i(x, 4) +
                      i(R.length, 2) +
                      R
                    );
                  })(
                    this.dirRecords.length,
                    l,
                    d,
                    this.zipComment,
                    this.encodeFileName
                  );
                this.push({ data: m, meta: { percent: 100 } });
              }),
              (w.prototype.prepareNextSource = function () {
                (this.previous = this._sources.shift()),
                  this.openedSource(this.previous.streamInfo),
                  this.isPaused
                    ? this.previous.pause()
                    : this.previous.resume();
              }),
              (w.prototype.registerPrevious = function (d) {
                this._sources.push(d);
                var _ = this;
                return (
                  d.on("data", function (l) {
                    _.processChunk(l);
                  }),
                  d.on("end", function () {
                    _.closedSource(_.previous.streamInfo),
                      _._sources.length ? _.prepareNextSource() : _.end();
                  }),
                  d.on("error", function (l) {
                    _.error(l);
                  }),
                  this
                );
              }),
              (w.prototype.resume = function () {
                return (
                  !!f.prototype.resume.call(this) &&
                  (!this.previous && this._sources.length
                    ? (this.prepareNextSource(), !0)
                    : this.previous ||
                      this._sources.length ||
                      this.generatedError
                    ? void 0
                    : (this.end(), !0))
                );
              }),
              (w.prototype.error = function (d) {
                var _ = this._sources;
                if (!f.prototype.error.call(this, d)) return !1;
                for (var l = 0; l < _.length; l++)
                  try {
                    _[l].error(d);
                  } catch (m) {}
                return !0;
              }),
              (w.prototype.lock = function () {
                f.prototype.lock.call(this);
                for (var d = this._sources, _ = 0; _ < d.length; _++)
                  d[_].lock();
              }),
              (a.exports = w);
          },
          {
            "../crc32": 4,
            "../signature": 23,
            "../stream/GenericWorker": 28,
            "../utf8": 31,
            "../utils": 32,
          },
        ],
        9: [
          function (e, a, h) {
            var i = e("../compressions"),
              o = e("./ZipFileWorker");
            h.generateWorker = function (s, f, v) {
              var E = new o(f.streamFiles, v, f.platform, f.encodeFileName),
                y = 0;
              try {
                s.forEach(function (w, d) {
                  y++;
                  var _ = (function (b, x) {
                      var T = b || x,
                        S = i[T];
                      if (!S)
                        throw new Error(
                          T + " is not a valid compression method !"
                        );
                      return S;
                    })(d.options.compression, f.compression),
                    l =
                      d.options.compressionOptions ||
                      f.compressionOptions ||
                      {},
                    m = d.dir,
                    u = d.date;
                  d._compressWorker(_, l)
                    .withStreamInfo("file", {
                      name: w,
                      dir: m,
                      date: u,
                      comment: d.comment || "",
                      unixPermissions: d.unixPermissions,
                      dosPermissions: d.dosPermissions,
                    })
                    .pipe(E);
                }),
                  (E.entriesCount = y);
              } catch (w) {
                E.error(w);
              }
              return E;
            };
          },
          { "../compressions": 3, "./ZipFileWorker": 8 },
        ],
        10: [
          function (e, a, h) {
            function i() {
              if (!(this instanceof i)) return new i();
              if (arguments.length)
                throw new Error(
                  "The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide."
                );
              (this.files = Object.create(null)),
                (this.comment = null),
                (this.root = ""),
                (this.clone = function () {
                  var o = new i();
                  for (var s in this)
                    typeof this[s] != "function" && (o[s] = this[s]);
                  return o;
                });
            }
            ((i.prototype = e("./object")).loadAsync = e("./load")),
              (i.support = e("./support")),
              (i.defaults = e("./defaults")),
              (i.version = "3.10.1"),
              (i.loadAsync = function (o, s) {
                return new i().loadAsync(o, s);
              }),
              (i.external = e("./external")),
              (a.exports = i);
          },
          {
            "./defaults": 5,
            "./external": 6,
            "./load": 11,
            "./object": 15,
            "./support": 30,
          },
        ],
        11: [
          function (e, a, h) {
            var i = e("./utils"),
              o = e("./external"),
              s = e("./utf8"),
              f = e("./zipEntries"),
              v = e("./stream/Crc32Probe"),
              E = e("./nodejsUtils");
            function y(w) {
              return new o.Promise(function (d, _) {
                var l = w.decompressed.getContentWorker().pipe(new v());
                l.on("error", function (m) {
                  _(m);
                })
                  .on("end", function () {
                    l.streamInfo.crc32 !== w.decompressed.crc32
                      ? _(new Error("Corrupted zip : CRC32 mismatch"))
                      : d();
                  })
                  .resume();
              });
            }
            a.exports = function (w, d) {
              var _ = this;
              return (
                (d = i.extend(d || {}, {
                  base64: !1,
                  checkCRC32: !1,
                  optimizedBinaryString: !1,
                  createFolders: !1,
                  decodeFileName: s.utf8decode,
                })),
                E.isNode && E.isStream(w)
                  ? o.Promise.reject(
                      new Error(
                        "JSZip can't accept a stream when loading a zip file."
                      )
                    )
                  : i
                      .prepareContent(
                        "the loaded zip file",
                        w,
                        !0,
                        d.optimizedBinaryString,
                        d.base64
                      )
                      .then(function (l) {
                        var m = new f(d);
                        return m.load(l), m;
                      })
                      .then(function (l) {
                        var m = [o.Promise.resolve(l)],
                          u = l.files;
                        if (d.checkCRC32)
                          for (var b = 0; b < u.length; b++) m.push(y(u[b]));
                        return o.Promise.all(m);
                      })
                      .then(function (l) {
                        for (
                          var m = l.shift(), u = m.files, b = 0;
                          b < u.length;
                          b++
                        ) {
                          var x = u[b],
                            T = x.fileNameStr,
                            S = i.resolve(x.fileNameStr);
                          _.file(S, x.decompressed, {
                            binary: !0,
                            optimizedBinaryString: !0,
                            date: x.date,
                            dir: x.dir,
                            comment: x.fileCommentStr.length
                              ? x.fileCommentStr
                              : null,
                            unixPermissions: x.unixPermissions,
                            dosPermissions: x.dosPermissions,
                            createFolders: d.createFolders,
                          }),
                            x.dir || (_.file(S).unsafeOriginalName = T);
                        }
                        return (
                          m.zipComment.length && (_.comment = m.zipComment), _
                        );
                      })
              );
            };
          },
          {
            "./external": 6,
            "./nodejsUtils": 14,
            "./stream/Crc32Probe": 25,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntries": 33,
          },
        ],
        12: [
          function (e, a, h) {
            var i = e("../utils"),
              o = e("../stream/GenericWorker");
            function s(f, v) {
              o.call(this, "Nodejs stream input adapter for " + f),
                (this._upstreamEnded = !1),
                this._bindStream(v);
            }
            i.inherits(s, o),
              (s.prototype._bindStream = function (f) {
                var v = this;
                (this._stream = f).pause(),
                  f
                    .on("data", function (E) {
                      v.push({ data: E, meta: { percent: 0 } });
                    })
                    .on("error", function (E) {
                      v.isPaused ? (this.generatedError = E) : v.error(E);
                    })
                    .on("end", function () {
                      v.isPaused ? (v._upstreamEnded = !0) : v.end();
                    });
              }),
              (s.prototype.pause = function () {
                return (
                  !!o.prototype.pause.call(this) && (this._stream.pause(), !0)
                );
              }),
              (s.prototype.resume = function () {
                return (
                  !!o.prototype.resume.call(this) &&
                  (this._upstreamEnded ? this.end() : this._stream.resume(), !0)
                );
              }),
              (a.exports = s);
          },
          { "../stream/GenericWorker": 28, "../utils": 32 },
        ],
        13: [
          function (e, a, h) {
            var i = e("readable-stream").Readable;
            function o(s, f, v) {
              i.call(this, f), (this._helper = s);
              var E = this;
              s.on("data", function (y, w) {
                E.push(y) || E._helper.pause(), v && v(w);
              })
                .on("error", function (y) {
                  E.emit("error", y);
                })
                .on("end", function () {
                  E.push(null);
                });
            }
            e("../utils").inherits(o, i),
              (o.prototype._read = function () {
                this._helper.resume();
              }),
              (a.exports = o);
          },
          { "../utils": 32, "readable-stream": 16 },
        ],
        14: [
          function (e, a, h) {
            a.exports = {
              isNode: typeof Buffer != "undefined",
              newBufferFrom: function (i, o) {
                if (Buffer.from && Buffer.from !== Uint8Array.from)
                  return Buffer.from(i, o);
                if (typeof i == "number")
                  throw new Error('The "data" argument must not be a number');
                return new Buffer(i, o);
              },
              allocBuffer: function (i) {
                if (Buffer.alloc) return Buffer.alloc(i);
                var o = new Buffer(i);
                return o.fill(0), o;
              },
              isBuffer: function (i) {
                return Buffer.isBuffer(i);
              },
              isStream: function (i) {
                return (
                  i &&
                  typeof i.on == "function" &&
                  typeof i.pause == "function" &&
                  typeof i.resume == "function"
                );
              },
            };
          },
          {},
        ],
        15: [
          function (e, a, h) {
            function i(S, R, F) {
              var j,
                I = s.getTypeOf(R),
                H = s.extend(F || {}, E);
              (H.date = H.date || new Date()),
                H.compression !== null &&
                  (H.compression = H.compression.toUpperCase()),
                typeof H.unixPermissions == "string" &&
                  (H.unixPermissions = parseInt(H.unixPermissions, 8)),
                H.unixPermissions && 16384 & H.unixPermissions && (H.dir = !0),
                H.dosPermissions && 16 & H.dosPermissions && (H.dir = !0),
                H.dir && (S = u(S)),
                H.createFolders && (j = m(S)) && b.call(this, j, !0);
              var Q = I === "string" && H.binary === !1 && H.base64 === !1;
              (F && F.binary !== void 0) || (H.binary = !Q),
                ((R instanceof y && R.uncompressedSize === 0) ||
                  H.dir ||
                  !R ||
                  R.length === 0) &&
                  ((H.base64 = !1),
                  (H.binary = !0),
                  (R = ""),
                  (H.compression = "STORE"),
                  (I = "string"));
              var k = null;
              k =
                R instanceof y || R instanceof f
                  ? R
                  : _.isNode && _.isStream(R)
                  ? new l(S, R)
                  : s.prepareContent(
                      S,
                      R,
                      H.binary,
                      H.optimizedBinaryString,
                      H.base64
                    );
              var L = new w(S, k, H);
              this.files[S] = L;
            }
            var o = e("./utf8"),
              s = e("./utils"),
              f = e("./stream/GenericWorker"),
              v = e("./stream/StreamHelper"),
              E = e("./defaults"),
              y = e("./compressedObject"),
              w = e("./zipObject"),
              d = e("./generate"),
              _ = e("./nodejsUtils"),
              l = e("./nodejs/NodejsStreamInputAdapter"),
              m = function (S) {
                S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
                var R = S.lastIndexOf("/");
                return 0 < R ? S.substring(0, R) : "";
              },
              u = function (S) {
                return S.slice(-1) !== "/" && (S += "/"), S;
              },
              b = function (S, R) {
                return (
                  (R = R !== void 0 ? R : E.createFolders),
                  (S = u(S)),
                  this.files[S] ||
                    i.call(this, S, null, { dir: !0, createFolders: R }),
                  this.files[S]
                );
              };
            function x(S) {
              return Object.prototype.toString.call(S) === "[object RegExp]";
            }
            var T = {
              load: function () {
                throw new Error(
                  "This method has been removed in JSZip 3.0, please check the upgrade guide."
                );
              },
              forEach: function (S) {
                var R, F, j;
                for (R in this.files)
                  (j = this.files[R]),
                    (F = R.slice(this.root.length, R.length)) &&
                      R.slice(0, this.root.length) === this.root &&
                      S(F, j);
              },
              filter: function (S) {
                var R = [];
                return (
                  this.forEach(function (F, j) {
                    S(F, j) && R.push(j);
                  }),
                  R
                );
              },
              file: function (S, R, F) {
                if (arguments.length !== 1)
                  return (S = this.root + S), i.call(this, S, R, F), this;
                if (x(S)) {
                  var j = S;
                  return this.filter(function (H, Q) {
                    return !Q.dir && j.test(H);
                  });
                }
                var I = this.files[this.root + S];
                return I && !I.dir ? I : null;
              },
              folder: function (S) {
                if (!S) return this;
                if (x(S))
                  return this.filter(function (I, H) {
                    return H.dir && S.test(I);
                  });
                var R = this.root + S,
                  F = b.call(this, R),
                  j = this.clone();
                return (j.root = F.name), j;
              },
              remove: function (S) {
                S = this.root + S;
                var R = this.files[S];
                if (
                  (R ||
                    (S.slice(-1) !== "/" && (S += "/"), (R = this.files[S])),
                  R && !R.dir)
                )
                  delete this.files[S];
                else
                  for (
                    var F = this.filter(function (I, H) {
                        return H.name.slice(0, S.length) === S;
                      }),
                      j = 0;
                    j < F.length;
                    j++
                  )
                    delete this.files[F[j].name];
                return this;
              },
              generate: function () {
                throw new Error(
                  "This method has been removed in JSZip 3.0, please check the upgrade guide."
                );
              },
              generateInternalStream: function (S) {
                var R,
                  F = {};
                try {
                  if (
                    (((F = s.extend(S || {}, {
                      streamFiles: !1,
                      compression: "STORE",
                      compressionOptions: null,
                      type: "",
                      platform: "DOS",
                      comment: null,
                      mimeType: "application/zip",
                      encodeFileName: o.utf8encode,
                    })).type = F.type.toLowerCase()),
                    (F.compression = F.compression.toUpperCase()),
                    F.type === "binarystring" && (F.type = "string"),
                    !F.type)
                  )
                    throw new Error("No output type specified.");
                  s.checkSupport(F.type),
                    (F.platform !== "darwin" &&
                      F.platform !== "freebsd" &&
                      F.platform !== "linux" &&
                      F.platform !== "sunos") ||
                      (F.platform = "UNIX"),
                    F.platform === "win32" && (F.platform = "DOS");
                  var j = F.comment || this.comment || "";
                  R = d.generateWorker(this, F, j);
                } catch (I) {
                  (R = new f("error")).error(I);
                }
                return new v(R, F.type || "string", F.mimeType);
              },
              generateAsync: function (S, R) {
                return this.generateInternalStream(S).accumulate(R);
              },
              generateNodeStream: function (S, R) {
                return (
                  (S = S || {}).type || (S.type = "nodebuffer"),
                  this.generateInternalStream(S).toNodejsStream(R)
                );
              },
            };
            a.exports = T;
          },
          {
            "./compressedObject": 2,
            "./defaults": 5,
            "./generate": 9,
            "./nodejs/NodejsStreamInputAdapter": 12,
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31,
            "./utils": 32,
            "./zipObject": 35,
          },
        ],
        16: [
          function (e, a, h) {
            a.exports = e("stream");
          },
          { stream: void 0 },
        ],
        17: [
          function (e, a, h) {
            var i = e("./DataReader");
            function o(s) {
              i.call(this, s);
              for (var f = 0; f < this.data.length; f++) s[f] = 255 & s[f];
            }
            e("../utils").inherits(o, i),
              (o.prototype.byteAt = function (s) {
                return this.data[this.zero + s];
              }),
              (o.prototype.lastIndexOfSignature = function (s) {
                for (
                  var f = s.charCodeAt(0),
                    v = s.charCodeAt(1),
                    E = s.charCodeAt(2),
                    y = s.charCodeAt(3),
                    w = this.length - 4;
                  0 <= w;
                  --w
                )
                  if (
                    this.data[w] === f &&
                    this.data[w + 1] === v &&
                    this.data[w + 2] === E &&
                    this.data[w + 3] === y
                  )
                    return w - this.zero;
                return -1;
              }),
              (o.prototype.readAndCheckSignature = function (s) {
                var f = s.charCodeAt(0),
                  v = s.charCodeAt(1),
                  E = s.charCodeAt(2),
                  y = s.charCodeAt(3),
                  w = this.readData(4);
                return f === w[0] && v === w[1] && E === w[2] && y === w[3];
              }),
              (o.prototype.readData = function (s) {
                if ((this.checkOffset(s), s === 0)) return [];
                var f = this.data.slice(
                  this.zero + this.index,
                  this.zero + this.index + s
                );
                return (this.index += s), f;
              }),
              (a.exports = o);
          },
          { "../utils": 32, "./DataReader": 18 },
        ],
        18: [
          function (e, a, h) {
            var i = e("../utils");
            function o(s) {
              (this.data = s),
                (this.length = s.length),
                (this.index = 0),
                (this.zero = 0);
            }
            (o.prototype = {
              checkOffset: function (s) {
                this.checkIndex(this.index + s);
              },
              checkIndex: function (s) {
                if (this.length < this.zero + s || s < 0)
                  throw new Error(
                    "End of data reached (data length = " +
                      this.length +
                      ", asked index = " +
                      s +
                      "). Corrupted zip ?"
                  );
              },
              setIndex: function (s) {
                this.checkIndex(s), (this.index = s);
              },
              skip: function (s) {
                this.setIndex(this.index + s);
              },
              byteAt: function () {},
              readInt: function (s) {
                var f,
                  v = 0;
                for (
                  this.checkOffset(s), f = this.index + s - 1;
                  f >= this.index;
                  f--
                )
                  v = (v << 8) + this.byteAt(f);
                return (this.index += s), v;
              },
              readString: function (s) {
                return i.transformTo("string", this.readData(s));
              },
              readData: function () {},
              lastIndexOfSignature: function () {},
              readAndCheckSignature: function () {},
              readDate: function () {
                var s = this.readInt(4);
                return new Date(
                  Date.UTC(
                    1980 + ((s >> 25) & 127),
                    ((s >> 21) & 15) - 1,
                    (s >> 16) & 31,
                    (s >> 11) & 31,
                    (s >> 5) & 63,
                    (31 & s) << 1
                  )
                );
              },
            }),
              (a.exports = o);
          },
          { "../utils": 32 },
        ],
        19: [
          function (e, a, h) {
            var i = e("./Uint8ArrayReader");
            function o(s) {
              i.call(this, s);
            }
            e("../utils").inherits(o, i),
              (o.prototype.readData = function (s) {
                this.checkOffset(s);
                var f = this.data.slice(
                  this.zero + this.index,
                  this.zero + this.index + s
                );
                return (this.index += s), f;
              }),
              (a.exports = o);
          },
          { "../utils": 32, "./Uint8ArrayReader": 21 },
        ],
        20: [
          function (e, a, h) {
            var i = e("./DataReader");
            function o(s) {
              i.call(this, s);
            }
            e("../utils").inherits(o, i),
              (o.prototype.byteAt = function (s) {
                return this.data.charCodeAt(this.zero + s);
              }),
              (o.prototype.lastIndexOfSignature = function (s) {
                return this.data.lastIndexOf(s) - this.zero;
              }),
              (o.prototype.readAndCheckSignature = function (s) {
                return s === this.readData(4);
              }),
              (o.prototype.readData = function (s) {
                this.checkOffset(s);
                var f = this.data.slice(
                  this.zero + this.index,
                  this.zero + this.index + s
                );
                return (this.index += s), f;
              }),
              (a.exports = o);
          },
          { "../utils": 32, "./DataReader": 18 },
        ],
        21: [
          function (e, a, h) {
            var i = e("./ArrayReader");
            function o(s) {
              i.call(this, s);
            }
            e("../utils").inherits(o, i),
              (o.prototype.readData = function (s) {
                if ((this.checkOffset(s), s === 0)) return new Uint8Array(0);
                var f = this.data.subarray(
                  this.zero + this.index,
                  this.zero + this.index + s
                );
                return (this.index += s), f;
              }),
              (a.exports = o);
          },
          { "../utils": 32, "./ArrayReader": 17 },
        ],
        22: [
          function (e, a, h) {
            var i = e("../utils"),
              o = e("../support"),
              s = e("./ArrayReader"),
              f = e("./StringReader"),
              v = e("./NodeBufferReader"),
              E = e("./Uint8ArrayReader");
            a.exports = function (y) {
              var w = i.getTypeOf(y);
              return (
                i.checkSupport(w),
                w !== "string" || o.uint8array
                  ? w === "nodebuffer"
                    ? new v(y)
                    : o.uint8array
                    ? new E(i.transformTo("uint8array", y))
                    : new s(i.transformTo("array", y))
                  : new f(y)
              );
            };
          },
          {
            "../support": 30,
            "../utils": 32,
            "./ArrayReader": 17,
            "./NodeBufferReader": 19,
            "./StringReader": 20,
            "./Uint8ArrayReader": 21,
          },
        ],
        23: [
          function (e, a, h) {
            (h.LOCAL_FILE_HEADER = "PK"),
              (h.CENTRAL_FILE_HEADER = "PK"),
              (h.CENTRAL_DIRECTORY_END = "PK"),
              (h.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07"),
              (h.ZIP64_CENTRAL_DIRECTORY_END = "PK"),
              (h.DATA_DESCRIPTOR = "PK\x07\b");
          },
          {},
        ],
        24: [
          function (e, a, h) {
            var i = e("./GenericWorker"),
              o = e("../utils");
            function s(f) {
              i.call(this, "ConvertWorker to " + f), (this.destType = f);
            }
            o.inherits(s, i),
              (s.prototype.processChunk = function (f) {
                this.push({
                  data: o.transformTo(this.destType, f.data),
                  meta: f.meta,
                });
              }),
              (a.exports = s);
          },
          { "../utils": 32, "./GenericWorker": 28 },
        ],
        25: [
          function (e, a, h) {
            var i = e("./GenericWorker"),
              o = e("../crc32");
            function s() {
              i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
            }
            e("../utils").inherits(s, i),
              (s.prototype.processChunk = function (f) {
                (this.streamInfo.crc32 = o(f.data, this.streamInfo.crc32 || 0)),
                  this.push(f);
              }),
              (a.exports = s);
          },
          { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 },
        ],
        26: [
          function (e, a, h) {
            var i = e("../utils"),
              o = e("./GenericWorker");
            function s(f) {
              o.call(this, "DataLengthProbe for " + f),
                (this.propName = f),
                this.withStreamInfo(f, 0);
            }
            i.inherits(s, o),
              (s.prototype.processChunk = function (f) {
                if (f) {
                  var v = this.streamInfo[this.propName] || 0;
                  this.streamInfo[this.propName] = v + f.data.length;
                }
                o.prototype.processChunk.call(this, f);
              }),
              (a.exports = s);
          },
          { "../utils": 32, "./GenericWorker": 28 },
        ],
        27: [
          function (e, a, h) {
            var i = e("../utils"),
              o = e("./GenericWorker");
            function s(f) {
              o.call(this, "DataWorker");
              var v = this;
              (this.dataIsReady = !1),
                (this.index = 0),
                (this.max = 0),
                (this.data = null),
                (this.type = ""),
                (this._tickScheduled = !1),
                f.then(
                  function (E) {
                    (v.dataIsReady = !0),
                      (v.data = E),
                      (v.max = (E && E.length) || 0),
                      (v.type = i.getTypeOf(E)),
                      v.isPaused || v._tickAndRepeat();
                  },
                  function (E) {
                    v.error(E);
                  }
                );
            }
            i.inherits(s, o),
              (s.prototype.cleanUp = function () {
                o.prototype.cleanUp.call(this), (this.data = null);
              }),
              (s.prototype.resume = function () {
                return (
                  !!o.prototype.resume.call(this) &&
                  (!this._tickScheduled &&
                    this.dataIsReady &&
                    ((this._tickScheduled = !0),
                    i.delay(this._tickAndRepeat, [], this)),
                  !0)
                );
              }),
              (s.prototype._tickAndRepeat = function () {
                (this._tickScheduled = !1),
                  this.isPaused ||
                    this.isFinished ||
                    (this._tick(),
                    this.isFinished ||
                      (i.delay(this._tickAndRepeat, [], this),
                      (this._tickScheduled = !0)));
              }),
              (s.prototype._tick = function () {
                if (this.isPaused || this.isFinished) return !1;
                var f = null,
                  v = Math.min(this.max, this.index + 16384);
                if (this.index >= this.max) return this.end();
                switch (this.type) {
                  case "string":
                    f = this.data.substring(this.index, v);
                    break;
                  case "uint8array":
                    f = this.data.subarray(this.index, v);
                    break;
                  case "array":
                  case "nodebuffer":
                    f = this.data.slice(this.index, v);
                }
                return (
                  (this.index = v),
                  this.push({
                    data: f,
                    meta: {
                      percent: this.max ? (this.index / this.max) * 100 : 0,
                    },
                  })
                );
              }),
              (a.exports = s);
          },
          { "../utils": 32, "./GenericWorker": 28 },
        ],
        28: [
          function (e, a, h) {
            function i(o) {
              (this.name = o || "default"),
                (this.streamInfo = {}),
                (this.generatedError = null),
                (this.extraStreamInfo = {}),
                (this.isPaused = !0),
                (this.isFinished = !1),
                (this.isLocked = !1),
                (this._listeners = { data: [], end: [], error: [] }),
                (this.previous = null);
            }
            (i.prototype = {
              push: function (o) {
                this.emit("data", o);
              },
              end: function () {
                if (this.isFinished) return !1;
                this.flush();
                try {
                  this.emit("end"), this.cleanUp(), (this.isFinished = !0);
                } catch (o) {
                  this.emit("error", o);
                }
                return !0;
              },
              error: function (o) {
                return (
                  !this.isFinished &&
                  (this.isPaused
                    ? (this.generatedError = o)
                    : ((this.isFinished = !0),
                      this.emit("error", o),
                      this.previous && this.previous.error(o),
                      this.cleanUp()),
                  !0)
                );
              },
              on: function (o, s) {
                return this._listeners[o].push(s), this;
              },
              cleanUp: function () {
                (this.streamInfo =
                  this.generatedError =
                  this.extraStreamInfo =
                    null),
                  (this._listeners = []);
              },
              emit: function (o, s) {
                if (this._listeners[o])
                  for (var f = 0; f < this._listeners[o].length; f++)
                    this._listeners[o][f].call(this, s);
              },
              pipe: function (o) {
                return o.registerPrevious(this);
              },
              registerPrevious: function (o) {
                if (this.isLocked)
                  throw new Error(
                    "The stream '" + this + "' has already been used."
                  );
                (this.streamInfo = o.streamInfo),
                  this.mergeStreamInfo(),
                  (this.previous = o);
                var s = this;
                return (
                  o.on("data", function (f) {
                    s.processChunk(f);
                  }),
                  o.on("end", function () {
                    s.end();
                  }),
                  o.on("error", function (f) {
                    s.error(f);
                  }),
                  this
                );
              },
              pause: function () {
                return (
                  !this.isPaused &&
                  !this.isFinished &&
                  ((this.isPaused = !0),
                  this.previous && this.previous.pause(),
                  !0)
                );
              },
              resume: function () {
                if (!this.isPaused || this.isFinished) return !1;
                var o = (this.isPaused = !1);
                return (
                  this.generatedError &&
                    (this.error(this.generatedError), (o = !0)),
                  this.previous && this.previous.resume(),
                  !o
                );
              },
              flush: function () {},
              processChunk: function (o) {
                this.push(o);
              },
              withStreamInfo: function (o, s) {
                return (
                  (this.extraStreamInfo[o] = s), this.mergeStreamInfo(), this
                );
              },
              mergeStreamInfo: function () {
                for (var o in this.extraStreamInfo)
                  Object.prototype.hasOwnProperty.call(
                    this.extraStreamInfo,
                    o
                  ) && (this.streamInfo[o] = this.extraStreamInfo[o]);
              },
              lock: function () {
                if (this.isLocked)
                  throw new Error(
                    "The stream '" + this + "' has already been used."
                  );
                (this.isLocked = !0), this.previous && this.previous.lock();
              },
              toString: function () {
                var o = "Worker " + this.name;
                return this.previous ? this.previous + " -> " + o : o;
              },
            }),
              (a.exports = i);
          },
          {},
        ],
        29: [
          function (e, a, h) {
            var i = e("../utils"),
              o = e("./ConvertWorker"),
              s = e("./GenericWorker"),
              f = e("../base64"),
              v = e("../support"),
              E = e("../external"),
              y = null;
            if (v.nodestream)
              try {
                y = e("../nodejs/NodejsStreamOutputAdapter");
              } catch (_) {}
            function w(_, l) {
              return new E.Promise(function (m, u) {
                var b = [],
                  x = _._internalType,
                  T = _._outputType,
                  S = _._mimeType;
                _.on("data", function (R, F) {
                  b.push(R), l && l(F);
                })
                  .on("error", function (R) {
                    (b = []), u(R);
                  })
                  .on("end", function () {
                    try {
                      var R = (function (F, j, I) {
                        switch (F) {
                          case "blob":
                            return i.newBlob(
                              i.transformTo("arraybuffer", j),
                              I
                            );
                          case "base64":
                            return f.encode(j);
                          default:
                            return i.transformTo(F, j);
                        }
                      })(
                        T,
                        (function (F, j) {
                          var I,
                            H = 0,
                            Q = null,
                            k = 0;
                          for (I = 0; I < j.length; I++) k += j[I].length;
                          switch (F) {
                            case "string":
                              return j.join("");
                            case "array":
                              return Array.prototype.concat.apply([], j);
                            case "uint8array":
                              for (
                                Q = new Uint8Array(k), I = 0;
                                I < j.length;
                                I++
                              )
                                Q.set(j[I], H), (H += j[I].length);
                              return Q;
                            case "nodebuffer":
                              return Buffer.concat(j);
                            default:
                              throw new Error(
                                "concat : unsupported type '" + F + "'"
                              );
                          }
                        })(x, b),
                        S
                      );
                      m(R);
                    } catch (F) {
                      u(F);
                    }
                    b = [];
                  })
                  .resume();
              });
            }
            function d(_, l, m) {
              var u = l;
              switch (l) {
                case "blob":
                case "arraybuffer":
                  u = "uint8array";
                  break;
                case "base64":
                  u = "string";
              }
              try {
                (this._internalType = u),
                  (this._outputType = l),
                  (this._mimeType = m),
                  i.checkSupport(u),
                  (this._worker = _.pipe(new o(u))),
                  _.lock();
              } catch (b) {
                (this._worker = new s("error")), this._worker.error(b);
              }
            }
            (d.prototype = {
              accumulate: function (_) {
                return w(this, _);
              },
              on: function (_, l) {
                var m = this;
                return (
                  _ === "data"
                    ? this._worker.on(_, function (u) {
                        l.call(m, u.data, u.meta);
                      })
                    : this._worker.on(_, function () {
                        i.delay(l, arguments, m);
                      }),
                  this
                );
              },
              resume: function () {
                return i.delay(this._worker.resume, [], this._worker), this;
              },
              pause: function () {
                return this._worker.pause(), this;
              },
              toNodejsStream: function (_) {
                if (
                  (i.checkSupport("nodestream"),
                  this._outputType !== "nodebuffer")
                )
                  throw new Error(
                    this._outputType + " is not supported by this method"
                  );
                return new y(
                  this,
                  { objectMode: this._outputType !== "nodebuffer" },
                  _
                );
              },
            }),
              (a.exports = d);
          },
          {
            "../base64": 1,
            "../external": 6,
            "../nodejs/NodejsStreamOutputAdapter": 13,
            "../support": 30,
            "../utils": 32,
            "./ConvertWorker": 24,
            "./GenericWorker": 28,
          },
        ],
        30: [
          function (e, a, h) {
            if (
              ((h.base64 = !0),
              (h.array = !0),
              (h.string = !0),
              (h.arraybuffer =
                typeof ArrayBuffer != "undefined" &&
                typeof Uint8Array != "undefined"),
              (h.nodebuffer = typeof Buffer != "undefined"),
              (h.uint8array = typeof Uint8Array != "undefined"),
              typeof ArrayBuffer == "undefined")
            )
              h.blob = !1;
            else {
              var i = new ArrayBuffer(0);
              try {
                h.blob = new Blob([i], { type: "application/zip" }).size === 0;
              } catch (s) {
                try {
                  var o = new (self.BlobBuilder ||
                    self.WebKitBlobBuilder ||
                    self.MozBlobBuilder ||
                    self.MSBlobBuilder)();
                  o.append(i),
                    (h.blob = o.getBlob("application/zip").size === 0);
                } catch (f) {
                  h.blob = !1;
                }
              }
            }
            try {
              h.nodestream = !!e("readable-stream").Readable;
            } catch (s) {
              h.nodestream = !1;
            }
          },
          { "readable-stream": 16 },
        ],
        31: [
          function (e, a, h) {
            for (
              var i = e("./utils"),
                o = e("./support"),
                s = e("./nodejsUtils"),
                f = e("./stream/GenericWorker"),
                v = new Array(256),
                E = 0;
              E < 256;
              E++
            )
              v[E] =
                252 <= E
                  ? 6
                  : 248 <= E
                  ? 5
                  : 240 <= E
                  ? 4
                  : 224 <= E
                  ? 3
                  : 192 <= E
                  ? 2
                  : 1;
            v[254] = v[254] = 1;
            function y() {
              f.call(this, "utf-8 decode"), (this.leftOver = null);
            }
            function w() {
              f.call(this, "utf-8 encode");
            }
            (h.utf8encode = function (d) {
              return o.nodebuffer
                ? s.newBufferFrom(d, "utf-8")
                : (function (_) {
                    var l,
                      m,
                      u,
                      b,
                      x,
                      T = _.length,
                      S = 0;
                    for (b = 0; b < T; b++)
                      (64512 & (m = _.charCodeAt(b))) == 55296 &&
                        b + 1 < T &&
                        (64512 & (u = _.charCodeAt(b + 1))) == 56320 &&
                        ((m = 65536 + ((m - 55296) << 10) + (u - 56320)), b++),
                        (S += m < 128 ? 1 : m < 2048 ? 2 : m < 65536 ? 3 : 4);
                    for (
                      l = o.uint8array ? new Uint8Array(S) : new Array(S),
                        b = x = 0;
                      x < S;
                      b++
                    )
                      (64512 & (m = _.charCodeAt(b))) == 55296 &&
                        b + 1 < T &&
                        (64512 & (u = _.charCodeAt(b + 1))) == 56320 &&
                        ((m = 65536 + ((m - 55296) << 10) + (u - 56320)), b++),
                        m < 128
                          ? (l[x++] = m)
                          : (m < 2048
                              ? (l[x++] = 192 | (m >>> 6))
                              : (m < 65536
                                  ? (l[x++] = 224 | (m >>> 12))
                                  : ((l[x++] = 240 | (m >>> 18)),
                                    (l[x++] = 128 | ((m >>> 12) & 63))),
                                (l[x++] = 128 | ((m >>> 6) & 63))),
                            (l[x++] = 128 | (63 & m)));
                    return l;
                  })(d);
            }),
              (h.utf8decode = function (d) {
                return o.nodebuffer
                  ? i.transformTo("nodebuffer", d).toString("utf-8")
                  : (function (_) {
                      var l,
                        m,
                        u,
                        b,
                        x = _.length,
                        T = new Array(2 * x);
                      for (l = m = 0; l < x; )
                        if ((u = _[l++]) < 128) T[m++] = u;
                        else if (4 < (b = v[u])) (T[m++] = 65533), (l += b - 1);
                        else {
                          for (
                            u &= b === 2 ? 31 : b === 3 ? 15 : 7;
                            1 < b && l < x;

                          )
                            (u = (u << 6) | (63 & _[l++])), b--;
                          1 < b
                            ? (T[m++] = 65533)
                            : u < 65536
                            ? (T[m++] = u)
                            : ((u -= 65536),
                              (T[m++] = 55296 | ((u >> 10) & 1023)),
                              (T[m++] = 56320 | (1023 & u)));
                        }
                      return (
                        T.length !== m &&
                          (T.subarray
                            ? (T = T.subarray(0, m))
                            : (T.length = m)),
                        i.applyFromCharCode(T)
                      );
                    })(
                      (d = i.transformTo(
                        o.uint8array ? "uint8array" : "array",
                        d
                      ))
                    );
              }),
              i.inherits(y, f),
              (y.prototype.processChunk = function (d) {
                var _ = i.transformTo(
                  o.uint8array ? "uint8array" : "array",
                  d.data
                );
                if (this.leftOver && this.leftOver.length) {
                  if (o.uint8array) {
                    var l = _;
                    (_ = new Uint8Array(l.length + this.leftOver.length)).set(
                      this.leftOver,
                      0
                    ),
                      _.set(l, this.leftOver.length);
                  } else _ = this.leftOver.concat(_);
                  this.leftOver = null;
                }
                var m = (function (b, x) {
                    var T;
                    for (
                      (x = x || b.length) > b.length && (x = b.length),
                        T = x - 1;
                      0 <= T && (192 & b[T]) == 128;

                    )
                      T--;
                    return T < 0 || T === 0 ? x : T + v[b[T]] > x ? T : x;
                  })(_),
                  u = _;
                m !== _.length &&
                  (o.uint8array
                    ? ((u = _.subarray(0, m)),
                      (this.leftOver = _.subarray(m, _.length)))
                    : ((u = _.slice(0, m)),
                      (this.leftOver = _.slice(m, _.length)))),
                  this.push({ data: h.utf8decode(u), meta: d.meta });
              }),
              (y.prototype.flush = function () {
                this.leftOver &&
                  this.leftOver.length &&
                  (this.push({ data: h.utf8decode(this.leftOver), meta: {} }),
                  (this.leftOver = null));
              }),
              (h.Utf8DecodeWorker = y),
              i.inherits(w, f),
              (w.prototype.processChunk = function (d) {
                this.push({ data: h.utf8encode(d.data), meta: d.meta });
              }),
              (h.Utf8EncodeWorker = w);
          },
          {
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./support": 30,
            "./utils": 32,
          },
        ],
        32: [
          function (e, a, h) {
            var i = e("./support"),
              o = e("./base64"),
              s = e("./nodejsUtils"),
              f = e("./external");
            function v(l) {
              return l;
            }
            function E(l, m) {
              for (var u = 0; u < l.length; ++u) m[u] = 255 & l.charCodeAt(u);
              return m;
            }
            e("setimmediate"),
              (h.newBlob = function (l, m) {
                h.checkSupport("blob");
                try {
                  return new Blob([l], { type: m });
                } catch (b) {
                  try {
                    var u = new (self.BlobBuilder ||
                      self.WebKitBlobBuilder ||
                      self.MozBlobBuilder ||
                      self.MSBlobBuilder)();
                    return u.append(l), u.getBlob(m);
                  } catch (x) {
                    throw new Error("Bug : can't construct the Blob.");
                  }
                }
              });
            var y = {
              stringifyByChunk: function (l, m, u) {
                var b = [],
                  x = 0,
                  T = l.length;
                if (T <= u) return String.fromCharCode.apply(null, l);
                for (; x < T; )
                  m === "array" || m === "nodebuffer"
                    ? b.push(
                        String.fromCharCode.apply(
                          null,
                          l.slice(x, Math.min(x + u, T))
                        )
                      )
                    : b.push(
                        String.fromCharCode.apply(
                          null,
                          l.subarray(x, Math.min(x + u, T))
                        )
                      ),
                    (x += u);
                return b.join("");
              },
              stringifyByChar: function (l) {
                for (var m = "", u = 0; u < l.length; u++)
                  m += String.fromCharCode(l[u]);
                return m;
              },
              applyCanBeUsed: {
                uint8array: (function () {
                  try {
                    return (
                      i.uint8array &&
                      String.fromCharCode.apply(null, new Uint8Array(1))
                        .length === 1
                    );
                  } catch (l) {
                    return !1;
                  }
                })(),
                nodebuffer: (function () {
                  try {
                    return (
                      i.nodebuffer &&
                      String.fromCharCode.apply(null, s.allocBuffer(1))
                        .length === 1
                    );
                  } catch (l) {
                    return !1;
                  }
                })(),
              },
            };
            function w(l) {
              var m = 65536,
                u = h.getTypeOf(l),
                b = !0;
              if (
                (u === "uint8array"
                  ? (b = y.applyCanBeUsed.uint8array)
                  : u === "nodebuffer" && (b = y.applyCanBeUsed.nodebuffer),
                b)
              )
                for (; 1 < m; )
                  try {
                    return y.stringifyByChunk(l, u, m);
                  } catch (x) {
                    m = Math.floor(m / 2);
                  }
              return y.stringifyByChar(l);
            }
            function d(l, m) {
              for (var u = 0; u < l.length; u++) m[u] = l[u];
              return m;
            }
            h.applyFromCharCode = w;
            var _ = {};
            (_.string = {
              string: v,
              array: function (l) {
                return E(l, new Array(l.length));
              },
              arraybuffer: function (l) {
                return _.string.uint8array(l).buffer;
              },
              uint8array: function (l) {
                return E(l, new Uint8Array(l.length));
              },
              nodebuffer: function (l) {
                return E(l, s.allocBuffer(l.length));
              },
            }),
              (_.array = {
                string: w,
                array: v,
                arraybuffer: function (l) {
                  return new Uint8Array(l).buffer;
                },
                uint8array: function (l) {
                  return new Uint8Array(l);
                },
                nodebuffer: function (l) {
                  return s.newBufferFrom(l);
                },
              }),
              (_.arraybuffer = {
                string: function (l) {
                  return w(new Uint8Array(l));
                },
                array: function (l) {
                  return d(new Uint8Array(l), new Array(l.byteLength));
                },
                arraybuffer: v,
                uint8array: function (l) {
                  return new Uint8Array(l);
                },
                nodebuffer: function (l) {
                  return s.newBufferFrom(new Uint8Array(l));
                },
              }),
              (_.uint8array = {
                string: w,
                array: function (l) {
                  return d(l, new Array(l.length));
                },
                arraybuffer: function (l) {
                  return l.buffer;
                },
                uint8array: v,
                nodebuffer: function (l) {
                  return s.newBufferFrom(l);
                },
              }),
              (_.nodebuffer = {
                string: w,
                array: function (l) {
                  return d(l, new Array(l.length));
                },
                arraybuffer: function (l) {
                  return _.nodebuffer.uint8array(l).buffer;
                },
                uint8array: function (l) {
                  return d(l, new Uint8Array(l.length));
                },
                nodebuffer: v,
              }),
              (h.transformTo = function (l, m) {
                if (((m = m || ""), !l)) return m;
                h.checkSupport(l);
                var u = h.getTypeOf(m);
                return _[u][l](m);
              }),
              (h.resolve = function (l) {
                for (var m = l.split("/"), u = [], b = 0; b < m.length; b++) {
                  var x = m[b];
                  x === "." ||
                    (x === "" && b !== 0 && b !== m.length - 1) ||
                    (x === ".." ? u.pop() : u.push(x));
                }
                return u.join("/");
              }),
              (h.getTypeOf = function (l) {
                return typeof l == "string"
                  ? "string"
                  : Object.prototype.toString.call(l) === "[object Array]"
                  ? "array"
                  : i.nodebuffer && s.isBuffer(l)
                  ? "nodebuffer"
                  : i.uint8array && l instanceof Uint8Array
                  ? "uint8array"
                  : i.arraybuffer && l instanceof ArrayBuffer
                  ? "arraybuffer"
                  : void 0;
              }),
              (h.checkSupport = function (l) {
                if (!i[l.toLowerCase()])
                  throw new Error(l + " is not supported by this platform");
              }),
              (h.MAX_VALUE_16BITS = 65535),
              (h.MAX_VALUE_32BITS = -1),
              (h.pretty = function (l) {
                var m,
                  u,
                  b = "";
                for (u = 0; u < (l || "").length; u++)
                  b +=
                    "\\x" +
                    ((m = l.charCodeAt(u)) < 16 ? "0" : "") +
                    m.toString(16).toUpperCase();
                return b;
              }),
              (h.delay = function (l, m, u) {
                setImmediate(function () {
                  l.apply(u || null, m || []);
                });
              }),
              (h.inherits = function (l, m) {
                function u() {}
                (u.prototype = m.prototype), (l.prototype = new u());
              }),
              (h.extend = function () {
                var l,
                  m,
                  u = {};
                for (l = 0; l < arguments.length; l++)
                  for (m in arguments[l])
                    Object.prototype.hasOwnProperty.call(arguments[l], m) &&
                      u[m] === void 0 &&
                      (u[m] = arguments[l][m]);
                return u;
              }),
              (h.prepareContent = function (l, m, u, b, x) {
                return f.Promise.resolve(m)
                  .then(function (T) {
                    return i.blob &&
                      (T instanceof Blob ||
                        ["[object File]", "[object Blob]"].indexOf(
                          Object.prototype.toString.call(T)
                        ) !== -1) &&
                      typeof FileReader != "undefined"
                      ? new f.Promise(function (S, R) {
                          var F = new FileReader();
                          (F.onload = function (j) {
                            S(j.target.result);
                          }),
                            (F.onerror = function (j) {
                              R(j.target.error);
                            }),
                            F.readAsArrayBuffer(T);
                        })
                      : T;
                  })
                  .then(function (T) {
                    var S = h.getTypeOf(T);
                    return S
                      ? (S === "arraybuffer"
                          ? (T = h.transformTo("uint8array", T))
                          : S === "string" &&
                            (x
                              ? (T = o.decode(T))
                              : u &&
                                b !== !0 &&
                                (T = (function (R) {
                                  return E(
                                    R,
                                    i.uint8array
                                      ? new Uint8Array(R.length)
                                      : new Array(R.length)
                                  );
                                })(T))),
                        T)
                      : f.Promise.reject(
                          new Error(
                            "Can't read the data of '" +
                              l +
                              "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"
                          )
                        );
                  });
              });
          },
          {
            "./base64": 1,
            "./external": 6,
            "./nodejsUtils": 14,
            "./support": 30,
            setimmediate: 54,
          },
        ],
        33: [
          function (e, a, h) {
            var i = e("./reader/readerFor"),
              o = e("./utils"),
              s = e("./signature"),
              f = e("./zipEntry"),
              v = e("./support");
            function E(y) {
              (this.files = []), (this.loadOptions = y);
            }
            (E.prototype = {
              checkSignature: function (y) {
                if (!this.reader.readAndCheckSignature(y)) {
                  this.reader.index -= 4;
                  var w = this.reader.readString(4);
                  throw new Error(
                    "Corrupted zip or bug: unexpected signature (" +
                      o.pretty(w) +
                      ", expected " +
                      o.pretty(y) +
                      ")"
                  );
                }
              },
              isSignature: function (y, w) {
                var d = this.reader.index;
                this.reader.setIndex(y);
                var _ = this.reader.readString(4) === w;
                return this.reader.setIndex(d), _;
              },
              readBlockEndOfCentral: function () {
                (this.diskNumber = this.reader.readInt(2)),
                  (this.diskWithCentralDirStart = this.reader.readInt(2)),
                  (this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
                  (this.centralDirRecords = this.reader.readInt(2)),
                  (this.centralDirSize = this.reader.readInt(4)),
                  (this.centralDirOffset = this.reader.readInt(4)),
                  (this.zipCommentLength = this.reader.readInt(2));
                var y = this.reader.readData(this.zipCommentLength),
                  w = v.uint8array ? "uint8array" : "array",
                  d = o.transformTo(w, y);
                this.zipComment = this.loadOptions.decodeFileName(d);
              },
              readBlockZip64EndOfCentral: function () {
                (this.zip64EndOfCentralSize = this.reader.readInt(8)),
                  this.reader.skip(4),
                  (this.diskNumber = this.reader.readInt(4)),
                  (this.diskWithCentralDirStart = this.reader.readInt(4)),
                  (this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
                  (this.centralDirRecords = this.reader.readInt(8)),
                  (this.centralDirSize = this.reader.readInt(8)),
                  (this.centralDirOffset = this.reader.readInt(8)),
                  (this.zip64ExtensibleData = {});
                for (var y, w, d, _ = this.zip64EndOfCentralSize - 44; 0 < _; )
                  (y = this.reader.readInt(2)),
                    (w = this.reader.readInt(4)),
                    (d = this.reader.readData(w)),
                    (this.zip64ExtensibleData[y] = {
                      id: y,
                      length: w,
                      value: d,
                    });
              },
              readBlockZip64EndOfCentralLocator: function () {
                if (
                  ((this.diskWithZip64CentralDirStart = this.reader.readInt(4)),
                  (this.relativeOffsetEndOfZip64CentralDir =
                    this.reader.readInt(8)),
                  (this.disksCount = this.reader.readInt(4)),
                  1 < this.disksCount)
                )
                  throw new Error("Multi-volumes zip are not supported");
              },
              readLocalFiles: function () {
                var y, w;
                for (y = 0; y < this.files.length; y++)
                  (w = this.files[y]),
                    this.reader.setIndex(w.localHeaderOffset),
                    this.checkSignature(s.LOCAL_FILE_HEADER),
                    w.readLocalPart(this.reader),
                    w.handleUTF8(),
                    w.processAttributes();
              },
              readCentralDir: function () {
                var y;
                for (
                  this.reader.setIndex(this.centralDirOffset);
                  this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);

                )
                  (y = new f(
                    { zip64: this.zip64 },
                    this.loadOptions
                  )).readCentralPart(this.reader),
                    this.files.push(y);
                if (
                  this.centralDirRecords !== this.files.length &&
                  this.centralDirRecords !== 0 &&
                  this.files.length === 0
                )
                  throw new Error(
                    "Corrupted zip or bug: expected " +
                      this.centralDirRecords +
                      " records in central dir, got " +
                      this.files.length
                  );
              },
              readEndOfCentral: function () {
                var y = this.reader.lastIndexOfSignature(
                  s.CENTRAL_DIRECTORY_END
                );
                if (y < 0)
                  throw this.isSignature(0, s.LOCAL_FILE_HEADER)
                    ? new Error(
                        "Corrupted zip: can't find end of central directory"
                      )
                    : new Error(
                        "Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"
                      );
                this.reader.setIndex(y);
                var w = y;
                if (
                  (this.checkSignature(s.CENTRAL_DIRECTORY_END),
                  this.readBlockEndOfCentral(),
                  this.diskNumber === o.MAX_VALUE_16BITS ||
                    this.diskWithCentralDirStart === o.MAX_VALUE_16BITS ||
                    this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS ||
                    this.centralDirRecords === o.MAX_VALUE_16BITS ||
                    this.centralDirSize === o.MAX_VALUE_32BITS ||
                    this.centralDirOffset === o.MAX_VALUE_32BITS)
                ) {
                  if (
                    ((this.zip64 = !0),
                    (y = this.reader.lastIndexOfSignature(
                      s.ZIP64_CENTRAL_DIRECTORY_LOCATOR
                    )) < 0)
                  )
                    throw new Error(
                      "Corrupted zip: can't find the ZIP64 end of central directory locator"
                    );
                  if (
                    (this.reader.setIndex(y),
                    this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                    this.readBlockZip64EndOfCentralLocator(),
                    !this.isSignature(
                      this.relativeOffsetEndOfZip64CentralDir,
                      s.ZIP64_CENTRAL_DIRECTORY_END
                    ) &&
                      ((this.relativeOffsetEndOfZip64CentralDir =
                        this.reader.lastIndexOfSignature(
                          s.ZIP64_CENTRAL_DIRECTORY_END
                        )),
                      this.relativeOffsetEndOfZip64CentralDir < 0))
                  )
                    throw new Error(
                      "Corrupted zip: can't find the ZIP64 end of central directory"
                    );
                  this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),
                    this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),
                    this.readBlockZip64EndOfCentral();
                }
                var d = this.centralDirOffset + this.centralDirSize;
                this.zip64 &&
                  ((d += 20), (d += 12 + this.zip64EndOfCentralSize));
                var _ = w - d;
                if (0 < _)
                  this.isSignature(w, s.CENTRAL_FILE_HEADER) ||
                    (this.reader.zero = _);
                else if (_ < 0)
                  throw new Error(
                    "Corrupted zip: missing " + Math.abs(_) + " bytes."
                  );
              },
              prepareReader: function (y) {
                this.reader = i(y);
              },
              load: function (y) {
                this.prepareReader(y),
                  this.readEndOfCentral(),
                  this.readCentralDir(),
                  this.readLocalFiles();
              },
            }),
              (a.exports = E);
          },
          {
            "./reader/readerFor": 22,
            "./signature": 23,
            "./support": 30,
            "./utils": 32,
            "./zipEntry": 34,
          },
        ],
        34: [
          function (e, a, h) {
            var i = e("./reader/readerFor"),
              o = e("./utils"),
              s = e("./compressedObject"),
              f = e("./crc32"),
              v = e("./utf8"),
              E = e("./compressions"),
              y = e("./support");
            function w(d, _) {
              (this.options = d), (this.loadOptions = _);
            }
            (w.prototype = {
              isEncrypted: function () {
                return (1 & this.bitFlag) == 1;
              },
              useUTF8: function () {
                return (2048 & this.bitFlag) == 2048;
              },
              readLocalPart: function (d) {
                var _, l;
                if (
                  (d.skip(22),
                  (this.fileNameLength = d.readInt(2)),
                  (l = d.readInt(2)),
                  (this.fileName = d.readData(this.fileNameLength)),
                  d.skip(l),
                  this.compressedSize === -1 || this.uncompressedSize === -1)
                )
                  throw new Error(
                    "Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)"
                  );
                if (
                  (_ = (function (m) {
                    for (var u in E)
                      if (
                        Object.prototype.hasOwnProperty.call(E, u) &&
                        E[u].magic === m
                      )
                        return E[u];
                    return null;
                  })(this.compressionMethod)) === null
                )
                  throw new Error(
                    "Corrupted zip : compression " +
                      o.pretty(this.compressionMethod) +
                      " unknown (inner file : " +
                      o.transformTo("string", this.fileName) +
                      ")"
                  );
                this.decompressed = new s(
                  this.compressedSize,
                  this.uncompressedSize,
                  this.crc32,
                  _,
                  d.readData(this.compressedSize)
                );
              },
              readCentralPart: function (d) {
                (this.versionMadeBy = d.readInt(2)),
                  d.skip(2),
                  (this.bitFlag = d.readInt(2)),
                  (this.compressionMethod = d.readString(2)),
                  (this.date = d.readDate()),
                  (this.crc32 = d.readInt(4)),
                  (this.compressedSize = d.readInt(4)),
                  (this.uncompressedSize = d.readInt(4));
                var _ = d.readInt(2);
                if (
                  ((this.extraFieldsLength = d.readInt(2)),
                  (this.fileCommentLength = d.readInt(2)),
                  (this.diskNumberStart = d.readInt(2)),
                  (this.internalFileAttributes = d.readInt(2)),
                  (this.externalFileAttributes = d.readInt(4)),
                  (this.localHeaderOffset = d.readInt(4)),
                  this.isEncrypted())
                )
                  throw new Error("Encrypted zip are not supported");
                d.skip(_),
                  this.readExtraFields(d),
                  this.parseZIP64ExtraField(d),
                  (this.fileComment = d.readData(this.fileCommentLength));
              },
              processAttributes: function () {
                (this.unixPermissions = null), (this.dosPermissions = null);
                var d = this.versionMadeBy >> 8;
                (this.dir = !!(16 & this.externalFileAttributes)),
                  d == 0 &&
                    (this.dosPermissions = 63 & this.externalFileAttributes),
                  d == 3 &&
                    (this.unixPermissions =
                      (this.externalFileAttributes >> 16) & 65535),
                  this.dir ||
                    this.fileNameStr.slice(-1) !== "/" ||
                    (this.dir = !0);
              },
              parseZIP64ExtraField: function () {
                if (this.extraFields[1]) {
                  var d = i(this.extraFields[1].value);
                  this.uncompressedSize === o.MAX_VALUE_32BITS &&
                    (this.uncompressedSize = d.readInt(8)),
                    this.compressedSize === o.MAX_VALUE_32BITS &&
                      (this.compressedSize = d.readInt(8)),
                    this.localHeaderOffset === o.MAX_VALUE_32BITS &&
                      (this.localHeaderOffset = d.readInt(8)),
                    this.diskNumberStart === o.MAX_VALUE_32BITS &&
                      (this.diskNumberStart = d.readInt(4));
                }
              },
              readExtraFields: function (d) {
                var _,
                  l,
                  m,
                  u = d.index + this.extraFieldsLength;
                for (
                  this.extraFields || (this.extraFields = {});
                  d.index + 4 < u;

                )
                  (_ = d.readInt(2)),
                    (l = d.readInt(2)),
                    (m = d.readData(l)),
                    (this.extraFields[_] = { id: _, length: l, value: m });
                d.setIndex(u);
              },
              handleUTF8: function () {
                var d = y.uint8array ? "uint8array" : "array";
                if (this.useUTF8())
                  (this.fileNameStr = v.utf8decode(this.fileName)),
                    (this.fileCommentStr = v.utf8decode(this.fileComment));
                else {
                  var _ = this.findExtraFieldUnicodePath();
                  if (_ !== null) this.fileNameStr = _;
                  else {
                    var l = o.transformTo(d, this.fileName);
                    this.fileNameStr = this.loadOptions.decodeFileName(l);
                  }
                  var m = this.findExtraFieldUnicodeComment();
                  if (m !== null) this.fileCommentStr = m;
                  else {
                    var u = o.transformTo(d, this.fileComment);
                    this.fileCommentStr = this.loadOptions.decodeFileName(u);
                  }
                }
              },
              findExtraFieldUnicodePath: function () {
                var d = this.extraFields[28789];
                if (d) {
                  var _ = i(d.value);
                  return _.readInt(1) !== 1 || f(this.fileName) !== _.readInt(4)
                    ? null
                    : v.utf8decode(_.readData(d.length - 5));
                }
                return null;
              },
              findExtraFieldUnicodeComment: function () {
                var d = this.extraFields[25461];
                if (d) {
                  var _ = i(d.value);
                  return _.readInt(1) !== 1 ||
                    f(this.fileComment) !== _.readInt(4)
                    ? null
                    : v.utf8decode(_.readData(d.length - 5));
                }
                return null;
              },
            }),
              (a.exports = w);
          },
          {
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./reader/readerFor": 22,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32,
          },
        ],
        35: [
          function (e, a, h) {
            function i(_, l, m) {
              (this.name = _),
                (this.dir = m.dir),
                (this.date = m.date),
                (this.comment = m.comment),
                (this.unixPermissions = m.unixPermissions),
                (this.dosPermissions = m.dosPermissions),
                (this._data = l),
                (this._dataBinary = m.binary),
                (this.options = {
                  compression: m.compression,
                  compressionOptions: m.compressionOptions,
                });
            }
            var o = e("./stream/StreamHelper"),
              s = e("./stream/DataWorker"),
              f = e("./utf8"),
              v = e("./compressedObject"),
              E = e("./stream/GenericWorker");
            i.prototype = {
              internalStream: function (_) {
                var l = null,
                  m = "string";
                try {
                  if (!_) throw new Error("No output type specified.");
                  var u = (m = _.toLowerCase()) === "string" || m === "text";
                  (m !== "binarystring" && m !== "text") || (m = "string"),
                    (l = this._decompressWorker());
                  var b = !this._dataBinary;
                  b && !u && (l = l.pipe(new f.Utf8EncodeWorker())),
                    !b && u && (l = l.pipe(new f.Utf8DecodeWorker()));
                } catch (x) {
                  (l = new E("error")).error(x);
                }
                return new o(l, m, "");
              },
              async: function (_, l) {
                return this.internalStream(_).accumulate(l);
              },
              nodeStream: function (_, l) {
                return this.internalStream(_ || "nodebuffer").toNodejsStream(l);
              },
              _compressWorker: function (_, l) {
                if (
                  this._data instanceof v &&
                  this._data.compression.magic === _.magic
                )
                  return this._data.getCompressedWorker();
                var m = this._decompressWorker();
                return (
                  this._dataBinary || (m = m.pipe(new f.Utf8EncodeWorker())),
                  v.createWorkerFrom(m, _, l)
                );
              },
              _decompressWorker: function () {
                return this._data instanceof v
                  ? this._data.getContentWorker()
                  : this._data instanceof E
                  ? this._data
                  : new s(this._data);
              },
            };
            for (
              var y = [
                  "asText",
                  "asBinary",
                  "asNodeBuffer",
                  "asUint8Array",
                  "asArrayBuffer",
                ],
                w = function () {
                  throw new Error(
                    "This method has been removed in JSZip 3.0, please check the upgrade guide."
                  );
                },
                d = 0;
              d < y.length;
              d++
            )
              i.prototype[y[d]] = w;
            a.exports = i;
          },
          {
            "./compressedObject": 2,
            "./stream/DataWorker": 27,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31,
          },
        ],
        36: [
          function (e, a, h) {
            (function (i) {
              var o,
                s,
                f = i.MutationObserver || i.WebKitMutationObserver;
              if (f) {
                var v = 0,
                  E = new f(_),
                  y = i.document.createTextNode("");
                E.observe(y, { characterData: !0 }),
                  (o = function () {
                    y.data = v = ++v % 2;
                  });
              } else if (i.setImmediate || i.MessageChannel === void 0)
                o =
                  "document" in i &&
                  "onreadystatechange" in i.document.createElement("script")
                    ? function () {
                        var l = i.document.createElement("script");
                        (l.onreadystatechange = function () {
                          _(),
                            (l.onreadystatechange = null),
                            l.parentNode.removeChild(l),
                            (l = null);
                        }),
                          i.document.documentElement.appendChild(l);
                      }
                    : function () {
                        setTimeout(_, 0);
                      };
              else {
                var w = new i.MessageChannel();
                (w.port1.onmessage = _),
                  (o = function () {
                    w.port2.postMessage(0);
                  });
              }
              var d = [];
              function _() {
                var l, m;
                s = !0;
                for (var u = d.length; u; ) {
                  for (m = d, d = [], l = -1; ++l < u; ) m[l]();
                  u = d.length;
                }
                s = !1;
              }
              a.exports = function (l) {
                d.push(l) !== 1 || s || o();
              };
            }).call(
              this,
              typeof Ot != "undefined"
                ? Ot
                : typeof self != "undefined"
                ? self
                : typeof window != "undefined"
                ? window
                : {}
            );
          },
          {},
        ],
        37: [
          function (e, a, h) {
            var i = e("immediate");
            function o() {}
            var s = {},
              f = ["REJECTED"],
              v = ["FULFILLED"],
              E = ["PENDING"];
            function y(u) {
              if (typeof u != "function")
                throw new TypeError("resolver must be a function");
              (this.state = E),
                (this.queue = []),
                (this.outcome = void 0),
                u !== o && l(this, u);
            }
            function w(u, b, x) {
              (this.promise = u),
                typeof b == "function" &&
                  ((this.onFulfilled = b),
                  (this.callFulfilled = this.otherCallFulfilled)),
                typeof x == "function" &&
                  ((this.onRejected = x),
                  (this.callRejected = this.otherCallRejected));
            }
            function d(u, b, x) {
              i(function () {
                var T;
                try {
                  T = b(x);
                } catch (S) {
                  return s.reject(u, S);
                }
                T === u
                  ? s.reject(
                      u,
                      new TypeError("Cannot resolve promise with itself")
                    )
                  : s.resolve(u, T);
              });
            }
            function _(u) {
              var b = u && u.then;
              if (
                u &&
                (typeof u == "object" || typeof u == "function") &&
                typeof b == "function"
              )
                return function () {
                  b.apply(u, arguments);
                };
            }
            function l(u, b) {
              var x = !1;
              function T(F) {
                x || ((x = !0), s.reject(u, F));
              }
              function S(F) {
                x || ((x = !0), s.resolve(u, F));
              }
              var R = m(function () {
                b(S, T);
              });
              R.status === "error" && T(R.value);
            }
            function m(u, b) {
              var x = {};
              try {
                (x.value = u(b)), (x.status = "success");
              } catch (T) {
                (x.status = "error"), (x.value = T);
              }
              return x;
            }
            ((a.exports = y).prototype.finally = function (u) {
              if (typeof u != "function") return this;
              var b = this.constructor;
              return this.then(
                function (x) {
                  return b.resolve(u()).then(function () {
                    return x;
                  });
                },
                function (x) {
                  return b.resolve(u()).then(function () {
                    throw x;
                  });
                }
              );
            }),
              (y.prototype.catch = function (u) {
                return this.then(null, u);
              }),
              (y.prototype.then = function (u, b) {
                if (
                  (typeof u != "function" && this.state === v) ||
                  (typeof b != "function" && this.state === f)
                )
                  return this;
                var x = new this.constructor(o);
                return (
                  this.state !== E
                    ? d(x, this.state === v ? u : b, this.outcome)
                    : this.queue.push(new w(x, u, b)),
                  x
                );
              }),
              (w.prototype.callFulfilled = function (u) {
                s.resolve(this.promise, u);
              }),
              (w.prototype.otherCallFulfilled = function (u) {
                d(this.promise, this.onFulfilled, u);
              }),
              (w.prototype.callRejected = function (u) {
                s.reject(this.promise, u);
              }),
              (w.prototype.otherCallRejected = function (u) {
                d(this.promise, this.onRejected, u);
              }),
              (s.resolve = function (u, b) {
                var x = m(_, b);
                if (x.status === "error") return s.reject(u, x.value);
                var T = x.value;
                if (T) l(u, T);
                else {
                  (u.state = v), (u.outcome = b);
                  for (var S = -1, R = u.queue.length; ++S < R; )
                    u.queue[S].callFulfilled(b);
                }
                return u;
              }),
              (s.reject = function (u, b) {
                (u.state = f), (u.outcome = b);
                for (var x = -1, T = u.queue.length; ++x < T; )
                  u.queue[x].callRejected(b);
                return u;
              }),
              (y.resolve = function (u) {
                return u instanceof this ? u : s.resolve(new this(o), u);
              }),
              (y.reject = function (u) {
                var b = new this(o);
                return s.reject(b, u);
              }),
              (y.all = function (u) {
                var b = this;
                if (Object.prototype.toString.call(u) !== "[object Array]")
                  return this.reject(new TypeError("must be an array"));
                var x = u.length,
                  T = !1;
                if (!x) return this.resolve([]);
                for (
                  var S = new Array(x), R = 0, F = -1, j = new this(o);
                  ++F < x;

                )
                  I(u[F], F);
                return j;
                function I(H, Q) {
                  b.resolve(H).then(
                    function (k) {
                      (S[Q] = k), ++R !== x || T || ((T = !0), s.resolve(j, S));
                    },
                    function (k) {
                      T || ((T = !0), s.reject(j, k));
                    }
                  );
                }
              }),
              (y.race = function (u) {
                var b = this;
                if (Object.prototype.toString.call(u) !== "[object Array]")
                  return this.reject(new TypeError("must be an array"));
                var x = u.length,
                  T = !1;
                if (!x) return this.resolve([]);
                for (var S = -1, R = new this(o); ++S < x; )
                  (F = u[S]),
                    b.resolve(F).then(
                      function (j) {
                        T || ((T = !0), s.resolve(R, j));
                      },
                      function (j) {
                        T || ((T = !0), s.reject(R, j));
                      }
                    );
                var F;
                return R;
              });
          },
          { immediate: 36 },
        ],
        38: [
          function (e, a, h) {
            var i = {};
            (0, e("./lib/utils/common").assign)(
              i,
              e("./lib/deflate"),
              e("./lib/inflate"),
              e("./lib/zlib/constants")
            ),
              (a.exports = i);
          },
          {
            "./lib/deflate": 39,
            "./lib/inflate": 40,
            "./lib/utils/common": 41,
            "./lib/zlib/constants": 44,
          },
        ],
        39: [
          function (e, a, h) {
            var i = e("./zlib/deflate"),
              o = e("./utils/common"),
              s = e("./utils/strings"),
              f = e("./zlib/messages"),
              v = e("./zlib/zstream"),
              E = Object.prototype.toString,
              y = 0,
              w = -1,
              d = 0,
              _ = 8;
            function l(u) {
              if (!(this instanceof l)) return new l(u);
              this.options = o.assign(
                {
                  level: w,
                  method: _,
                  chunkSize: 16384,
                  windowBits: 15,
                  memLevel: 8,
                  strategy: d,
                  to: "",
                },
                u || {}
              );
              var b = this.options;
              b.raw && 0 < b.windowBits
                ? (b.windowBits = -b.windowBits)
                : b.gzip &&
                  0 < b.windowBits &&
                  b.windowBits < 16 &&
                  (b.windowBits += 16),
                (this.err = 0),
                (this.msg = ""),
                (this.ended = !1),
                (this.chunks = []),
                (this.strm = new v()),
                (this.strm.avail_out = 0);
              var x = i.deflateInit2(
                this.strm,
                b.level,
                b.method,
                b.windowBits,
                b.memLevel,
                b.strategy
              );
              if (x !== y) throw new Error(f[x]);
              if (
                (b.header && i.deflateSetHeader(this.strm, b.header),
                b.dictionary)
              ) {
                var T;
                if (
                  ((T =
                    typeof b.dictionary == "string"
                      ? s.string2buf(b.dictionary)
                      : E.call(b.dictionary) === "[object ArrayBuffer]"
                      ? new Uint8Array(b.dictionary)
                      : b.dictionary),
                  (x = i.deflateSetDictionary(this.strm, T)) !== y)
                )
                  throw new Error(f[x]);
                this._dict_set = !0;
              }
            }
            function m(u, b) {
              var x = new l(b);
              if ((x.push(u, !0), x.err)) throw x.msg || f[x.err];
              return x.result;
            }
            (l.prototype.push = function (u, b) {
              var x,
                T,
                S = this.strm,
                R = this.options.chunkSize;
              if (this.ended) return !1;
              (T = b === ~~b ? b : b === !0 ? 4 : 0),
                typeof u == "string"
                  ? (S.input = s.string2buf(u))
                  : E.call(u) === "[object ArrayBuffer]"
                  ? (S.input = new Uint8Array(u))
                  : (S.input = u),
                (S.next_in = 0),
                (S.avail_in = S.input.length);
              do {
                if (
                  (S.avail_out === 0 &&
                    ((S.output = new o.Buf8(R)),
                    (S.next_out = 0),
                    (S.avail_out = R)),
                  (x = i.deflate(S, T)) !== 1 && x !== y)
                )
                  return this.onEnd(x), !(this.ended = !0);
                (S.avail_out !== 0 &&
                  (S.avail_in !== 0 || (T !== 4 && T !== 2))) ||
                  (this.options.to === "string"
                    ? this.onData(
                        s.buf2binstring(o.shrinkBuf(S.output, S.next_out))
                      )
                    : this.onData(o.shrinkBuf(S.output, S.next_out)));
              } while ((0 < S.avail_in || S.avail_out === 0) && x !== 1);
              return T === 4
                ? ((x = i.deflateEnd(this.strm)),
                  this.onEnd(x),
                  (this.ended = !0),
                  x === y)
                : T !== 2 || (this.onEnd(y), !(S.avail_out = 0));
            }),
              (l.prototype.onData = function (u) {
                this.chunks.push(u);
              }),
              (l.prototype.onEnd = function (u) {
                u === y &&
                  (this.options.to === "string"
                    ? (this.result = this.chunks.join(""))
                    : (this.result = o.flattenChunks(this.chunks))),
                  (this.chunks = []),
                  (this.err = u),
                  (this.msg = this.strm.msg);
              }),
              (h.Deflate = l),
              (h.deflate = m),
              (h.deflateRaw = function (u, b) {
                return ((b = b || {}).raw = !0), m(u, b);
              }),
              (h.gzip = function (u, b) {
                return ((b = b || {}).gzip = !0), m(u, b);
              });
          },
          {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/deflate": 46,
            "./zlib/messages": 51,
            "./zlib/zstream": 53,
          },
        ],
        40: [
          function (e, a, h) {
            var i = e("./zlib/inflate"),
              o = e("./utils/common"),
              s = e("./utils/strings"),
              f = e("./zlib/constants"),
              v = e("./zlib/messages"),
              E = e("./zlib/zstream"),
              y = e("./zlib/gzheader"),
              w = Object.prototype.toString;
            function d(l) {
              if (!(this instanceof d)) return new d(l);
              this.options = o.assign(
                { chunkSize: 16384, windowBits: 0, to: "" },
                l || {}
              );
              var m = this.options;
              m.raw &&
                0 <= m.windowBits &&
                m.windowBits < 16 &&
                ((m.windowBits = -m.windowBits),
                m.windowBits === 0 && (m.windowBits = -15)),
                !(0 <= m.windowBits && m.windowBits < 16) ||
                  (l && l.windowBits) ||
                  (m.windowBits += 32),
                15 < m.windowBits &&
                  m.windowBits < 48 &&
                  !(15 & m.windowBits) &&
                  (m.windowBits |= 15),
                (this.err = 0),
                (this.msg = ""),
                (this.ended = !1),
                (this.chunks = []),
                (this.strm = new E()),
                (this.strm.avail_out = 0);
              var u = i.inflateInit2(this.strm, m.windowBits);
              if (u !== f.Z_OK) throw new Error(v[u]);
              (this.header = new y()),
                i.inflateGetHeader(this.strm, this.header);
            }
            function _(l, m) {
              var u = new d(m);
              if ((u.push(l, !0), u.err)) throw u.msg || v[u.err];
              return u.result;
            }
            (d.prototype.push = function (l, m) {
              var u,
                b,
                x,
                T,
                S,
                R,
                F = this.strm,
                j = this.options.chunkSize,
                I = this.options.dictionary,
                H = !1;
              if (this.ended) return !1;
              (b = m === ~~m ? m : m === !0 ? f.Z_FINISH : f.Z_NO_FLUSH),
                typeof l == "string"
                  ? (F.input = s.binstring2buf(l))
                  : w.call(l) === "[object ArrayBuffer]"
                  ? (F.input = new Uint8Array(l))
                  : (F.input = l),
                (F.next_in = 0),
                (F.avail_in = F.input.length);
              do {
                if (
                  (F.avail_out === 0 &&
                    ((F.output = new o.Buf8(j)),
                    (F.next_out = 0),
                    (F.avail_out = j)),
                  (u = i.inflate(F, f.Z_NO_FLUSH)) === f.Z_NEED_DICT &&
                    I &&
                    ((R =
                      typeof I == "string"
                        ? s.string2buf(I)
                        : w.call(I) === "[object ArrayBuffer]"
                        ? new Uint8Array(I)
                        : I),
                    (u = i.inflateSetDictionary(this.strm, R))),
                  u === f.Z_BUF_ERROR && H === !0 && ((u = f.Z_OK), (H = !1)),
                  u !== f.Z_STREAM_END && u !== f.Z_OK)
                )
                  return this.onEnd(u), !(this.ended = !0);
                F.next_out &&
                  ((F.avail_out !== 0 &&
                    u !== f.Z_STREAM_END &&
                    (F.avail_in !== 0 ||
                      (b !== f.Z_FINISH && b !== f.Z_SYNC_FLUSH))) ||
                    (this.options.to === "string"
                      ? ((x = s.utf8border(F.output, F.next_out)),
                        (T = F.next_out - x),
                        (S = s.buf2string(F.output, x)),
                        (F.next_out = T),
                        (F.avail_out = j - T),
                        T && o.arraySet(F.output, F.output, x, T, 0),
                        this.onData(S))
                      : this.onData(o.shrinkBuf(F.output, F.next_out)))),
                  F.avail_in === 0 && F.avail_out === 0 && (H = !0);
              } while (
                (0 < F.avail_in || F.avail_out === 0) &&
                u !== f.Z_STREAM_END
              );
              return (
                u === f.Z_STREAM_END && (b = f.Z_FINISH),
                b === f.Z_FINISH
                  ? ((u = i.inflateEnd(this.strm)),
                    this.onEnd(u),
                    (this.ended = !0),
                    u === f.Z_OK)
                  : b !== f.Z_SYNC_FLUSH ||
                    (this.onEnd(f.Z_OK), !(F.avail_out = 0))
              );
            }),
              (d.prototype.onData = function (l) {
                this.chunks.push(l);
              }),
              (d.prototype.onEnd = function (l) {
                l === f.Z_OK &&
                  (this.options.to === "string"
                    ? (this.result = this.chunks.join(""))
                    : (this.result = o.flattenChunks(this.chunks))),
                  (this.chunks = []),
                  (this.err = l),
                  (this.msg = this.strm.msg);
              }),
              (h.Inflate = d),
              (h.inflate = _),
              (h.inflateRaw = function (l, m) {
                return ((m = m || {}).raw = !0), _(l, m);
              }),
              (h.ungzip = _);
          },
          {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/constants": 44,
            "./zlib/gzheader": 47,
            "./zlib/inflate": 49,
            "./zlib/messages": 51,
            "./zlib/zstream": 53,
          },
        ],
        41: [
          function (e, a, h) {
            var i =
              typeof Uint8Array != "undefined" &&
              typeof Uint16Array != "undefined" &&
              typeof Int32Array != "undefined";
            (h.assign = function (f) {
              for (
                var v = Array.prototype.slice.call(arguments, 1);
                v.length;

              ) {
                var E = v.shift();
                if (E) {
                  if (typeof E != "object")
                    throw new TypeError(E + "must be non-object");
                  for (var y in E) E.hasOwnProperty(y) && (f[y] = E[y]);
                }
              }
              return f;
            }),
              (h.shrinkBuf = function (f, v) {
                return f.length === v
                  ? f
                  : f.subarray
                  ? f.subarray(0, v)
                  : ((f.length = v), f);
              });
            var o = {
                arraySet: function (f, v, E, y, w) {
                  if (v.subarray && f.subarray) f.set(v.subarray(E, E + y), w);
                  else for (var d = 0; d < y; d++) f[w + d] = v[E + d];
                },
                flattenChunks: function (f) {
                  var v, E, y, w, d, _;
                  for (v = y = 0, E = f.length; v < E; v++) y += f[v].length;
                  for (
                    _ = new Uint8Array(y), v = w = 0, E = f.length;
                    v < E;
                    v++
                  )
                    (d = f[v]), _.set(d, w), (w += d.length);
                  return _;
                },
              },
              s = {
                arraySet: function (f, v, E, y, w) {
                  for (var d = 0; d < y; d++) f[w + d] = v[E + d];
                },
                flattenChunks: function (f) {
                  return [].concat.apply([], f);
                },
              };
            (h.setTyped = function (f) {
              f
                ? ((h.Buf8 = Uint8Array),
                  (h.Buf16 = Uint16Array),
                  (h.Buf32 = Int32Array),
                  h.assign(h, o))
                : ((h.Buf8 = Array),
                  (h.Buf16 = Array),
                  (h.Buf32 = Array),
                  h.assign(h, s));
            }),
              h.setTyped(i);
          },
          {},
        ],
        42: [
          function (e, a, h) {
            var i = e("./common"),
              o = !0,
              s = !0;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (y) {
              o = !1;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (y) {
              s = !1;
            }
            for (var f = new i.Buf8(256), v = 0; v < 256; v++)
              f[v] =
                252 <= v
                  ? 6
                  : 248 <= v
                  ? 5
                  : 240 <= v
                  ? 4
                  : 224 <= v
                  ? 3
                  : 192 <= v
                  ? 2
                  : 1;
            function E(y, w) {
              if (w < 65537 && ((y.subarray && s) || (!y.subarray && o)))
                return String.fromCharCode.apply(null, i.shrinkBuf(y, w));
              for (var d = "", _ = 0; _ < w; _++)
                d += String.fromCharCode(y[_]);
              return d;
            }
            (f[254] = f[254] = 1),
              (h.string2buf = function (y) {
                var w,
                  d,
                  _,
                  l,
                  m,
                  u = y.length,
                  b = 0;
                for (l = 0; l < u; l++)
                  (64512 & (d = y.charCodeAt(l))) == 55296 &&
                    l + 1 < u &&
                    (64512 & (_ = y.charCodeAt(l + 1))) == 56320 &&
                    ((d = 65536 + ((d - 55296) << 10) + (_ - 56320)), l++),
                    (b += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4);
                for (w = new i.Buf8(b), l = m = 0; m < b; l++)
                  (64512 & (d = y.charCodeAt(l))) == 55296 &&
                    l + 1 < u &&
                    (64512 & (_ = y.charCodeAt(l + 1))) == 56320 &&
                    ((d = 65536 + ((d - 55296) << 10) + (_ - 56320)), l++),
                    d < 128
                      ? (w[m++] = d)
                      : (d < 2048
                          ? (w[m++] = 192 | (d >>> 6))
                          : (d < 65536
                              ? (w[m++] = 224 | (d >>> 12))
                              : ((w[m++] = 240 | (d >>> 18)),
                                (w[m++] = 128 | ((d >>> 12) & 63))),
                            (w[m++] = 128 | ((d >>> 6) & 63))),
                        (w[m++] = 128 | (63 & d)));
                return w;
              }),
              (h.buf2binstring = function (y) {
                return E(y, y.length);
              }),
              (h.binstring2buf = function (y) {
                for (
                  var w = new i.Buf8(y.length), d = 0, _ = w.length;
                  d < _;
                  d++
                )
                  w[d] = y.charCodeAt(d);
                return w;
              }),
              (h.buf2string = function (y, w) {
                var d,
                  _,
                  l,
                  m,
                  u = w || y.length,
                  b = new Array(2 * u);
                for (d = _ = 0; d < u; )
                  if ((l = y[d++]) < 128) b[_++] = l;
                  else if (4 < (m = f[l])) (b[_++] = 65533), (d += m - 1);
                  else {
                    for (l &= m === 2 ? 31 : m === 3 ? 15 : 7; 1 < m && d < u; )
                      (l = (l << 6) | (63 & y[d++])), m--;
                    1 < m
                      ? (b[_++] = 65533)
                      : l < 65536
                      ? (b[_++] = l)
                      : ((l -= 65536),
                        (b[_++] = 55296 | ((l >> 10) & 1023)),
                        (b[_++] = 56320 | (1023 & l)));
                  }
                return E(b, _);
              }),
              (h.utf8border = function (y, w) {
                var d;
                for (
                  (w = w || y.length) > y.length && (w = y.length), d = w - 1;
                  0 <= d && (192 & y[d]) == 128;

                )
                  d--;
                return d < 0 || d === 0 ? w : d + f[y[d]] > w ? d : w;
              });
          },
          { "./common": 41 },
        ],
        43: [
          function (e, a, h) {
            a.exports = function (i, o, s, f) {
              for (
                var v = (65535 & i) | 0, E = ((i >>> 16) & 65535) | 0, y = 0;
                s !== 0;

              ) {
                for (
                  s -= y = 2e3 < s ? 2e3 : s;
                  (E = (E + (v = (v + o[f++]) | 0)) | 0), --y;

                );
                (v %= 65521), (E %= 65521);
              }
              return v | (E << 16) | 0;
            };
          },
          {},
        ],
        44: [
          function (e, a, h) {
            a.exports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8,
            };
          },
          {},
        ],
        45: [
          function (e, a, h) {
            var i = (function () {
              for (var o, s = [], f = 0; f < 256; f++) {
                o = f;
                for (var v = 0; v < 8; v++)
                  o = 1 & o ? 3988292384 ^ (o >>> 1) : o >>> 1;
                s[f] = o;
              }
              return s;
            })();
            a.exports = function (o, s, f, v) {
              var E = i,
                y = v + f;
              o ^= -1;
              for (var w = v; w < y; w++) o = (o >>> 8) ^ E[255 & (o ^ s[w])];
              return -1 ^ o;
            };
          },
          {},
        ],
        46: [
          function (e, a, h) {
            var i,
              o = e("../utils/common"),
              s = e("./trees"),
              f = e("./adler32"),
              v = e("./crc32"),
              E = e("./messages"),
              y = 0,
              w = 4,
              d = 0,
              _ = -2,
              l = -1,
              m = 4,
              u = 2,
              b = 8,
              x = 9,
              T = 286,
              S = 30,
              R = 19,
              F = 2 * T + 1,
              j = 15,
              I = 3,
              H = 258,
              Q = H + I + 1,
              k = 42,
              L = 113,
              n = 1,
              B = 2,
              et = 3,
              W = 4;
            function rt(r, D) {
              return (r.msg = E[D]), D;
            }
            function X(r) {
              return (r << 1) - (4 < r ? 9 : 0);
            }
            function tt(r) {
              for (var D = r.length; 0 <= --D; ) r[D] = 0;
            }
            function z(r) {
              var D = r.state,
                M = D.pending;
              M > r.avail_out && (M = r.avail_out),
                M !== 0 &&
                  (o.arraySet(
                    r.output,
                    D.pending_buf,
                    D.pending_out,
                    M,
                    r.next_out
                  ),
                  (r.next_out += M),
                  (D.pending_out += M),
                  (r.total_out += M),
                  (r.avail_out -= M),
                  (D.pending -= M),
                  D.pending === 0 && (D.pending_out = 0));
            }
            function O(r, D) {
              s._tr_flush_block(
                r,
                0 <= r.block_start ? r.block_start : -1,
                r.strstart - r.block_start,
                D
              ),
                (r.block_start = r.strstart),
                z(r.strm);
            }
            function J(r, D) {
              r.pending_buf[r.pending++] = D;
            }
            function V(r, D) {
              (r.pending_buf[r.pending++] = (D >>> 8) & 255),
                (r.pending_buf[r.pending++] = 255 & D);
            }
            function q(r, D) {
              var M,
                g,
                p = r.max_chain_length,
                C = r.strstart,
                P = r.prev_length,
                N = r.nice_match,
                A = r.strstart > r.w_size - Q ? r.strstart - (r.w_size - Q) : 0,
                Y = r.window,
                G = r.w_mask,
                Z = r.prev,
                K = r.strstart + H,
                at = Y[C + P - 1],
                nt = Y[C + P];
              r.prev_length >= r.good_match && (p >>= 2),
                N > r.lookahead && (N = r.lookahead);
              do
                if (
                  Y[(M = D) + P] === nt &&
                  Y[M + P - 1] === at &&
                  Y[M] === Y[C] &&
                  Y[++M] === Y[C + 1]
                ) {
                  (C += 2), M++;
                  do;
                  while (
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    Y[++C] === Y[++M] &&
                    C < K
                  );
                  if (((g = H - (K - C)), (C = K - H), P < g)) {
                    if (((r.match_start = D), N <= (P = g))) break;
                    (at = Y[C + P - 1]), (nt = Y[C + P]);
                  }
                }
              while ((D = Z[D & G]) > A && --p != 0);
              return P <= r.lookahead ? P : r.lookahead;
            }
            function ot(r) {
              var D,
                M,
                g,
                p,
                C,
                P,
                N,
                A,
                Y,
                G,
                Z = r.w_size;
              do {
                if (
                  ((p = r.window_size - r.lookahead - r.strstart),
                  r.strstart >= Z + (Z - Q))
                ) {
                  for (
                    o.arraySet(r.window, r.window, Z, Z, 0),
                      r.match_start -= Z,
                      r.strstart -= Z,
                      r.block_start -= Z,
                      D = M = r.hash_size;
                    (g = r.head[--D]), (r.head[D] = Z <= g ? g - Z : 0), --M;

                  );
                  for (
                    D = M = Z;
                    (g = r.prev[--D]), (r.prev[D] = Z <= g ? g - Z : 0), --M;

                  );
                  p += Z;
                }
                if (r.strm.avail_in === 0) break;
                if (
                  ((P = r.strm),
                  (N = r.window),
                  (A = r.strstart + r.lookahead),
                  (Y = p),
                  (G = void 0),
                  (G = P.avail_in),
                  Y < G && (G = Y),
                  (M =
                    G === 0
                      ? 0
                      : ((P.avail_in -= G),
                        o.arraySet(N, P.input, P.next_in, G, A),
                        P.state.wrap === 1
                          ? (P.adler = f(P.adler, N, G, A))
                          : P.state.wrap === 2 &&
                            (P.adler = v(P.adler, N, G, A)),
                        (P.next_in += G),
                        (P.total_in += G),
                        G)),
                  (r.lookahead += M),
                  r.lookahead + r.insert >= I)
                )
                  for (
                    C = r.strstart - r.insert,
                      r.ins_h = r.window[C],
                      r.ins_h =
                        ((r.ins_h << r.hash_shift) ^ r.window[C + 1]) &
                        r.hash_mask;
                    r.insert &&
                    ((r.ins_h =
                      ((r.ins_h << r.hash_shift) ^ r.window[C + I - 1]) &
                      r.hash_mask),
                    (r.prev[C & r.w_mask] = r.head[r.ins_h]),
                    (r.head[r.ins_h] = C),
                    C++,
                    r.insert--,
                    !(r.lookahead + r.insert < I));

                  );
              } while (r.lookahead < Q && r.strm.avail_in !== 0);
            }
            function ct(r, D) {
              for (var M, g; ; ) {
                if (r.lookahead < Q) {
                  if ((ot(r), r.lookahead < Q && D === y)) return n;
                  if (r.lookahead === 0) break;
                }
                if (
                  ((M = 0),
                  r.lookahead >= I &&
                    ((r.ins_h =
                      ((r.ins_h << r.hash_shift) ^
                        r.window[r.strstart + I - 1]) &
                      r.hash_mask),
                    (M = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h]),
                    (r.head[r.ins_h] = r.strstart)),
                  M !== 0 &&
                    r.strstart - M <= r.w_size - Q &&
                    (r.match_length = q(r, M)),
                  r.match_length >= I)
                )
                  if (
                    ((g = s._tr_tally(
                      r,
                      r.strstart - r.match_start,
                      r.match_length - I
                    )),
                    (r.lookahead -= r.match_length),
                    r.match_length <= r.max_lazy_match && r.lookahead >= I)
                  ) {
                    for (
                      r.match_length--;
                      r.strstart++,
                        (r.ins_h =
                          ((r.ins_h << r.hash_shift) ^
                            r.window[r.strstart + I - 1]) &
                          r.hash_mask),
                        (M = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h]),
                        (r.head[r.ins_h] = r.strstart),
                        --r.match_length != 0;

                    );
                    r.strstart++;
                  } else
                    (r.strstart += r.match_length),
                      (r.match_length = 0),
                      (r.ins_h = r.window[r.strstart]),
                      (r.ins_h =
                        ((r.ins_h << r.hash_shift) ^ r.window[r.strstart + 1]) &
                        r.hash_mask);
                else
                  (g = s._tr_tally(r, 0, r.window[r.strstart])),
                    r.lookahead--,
                    r.strstart++;
                if (g && (O(r, !1), r.strm.avail_out === 0)) return n;
              }
              return (
                (r.insert = r.strstart < I - 1 ? r.strstart : I - 1),
                D === w
                  ? (O(r, !0), r.strm.avail_out === 0 ? et : W)
                  : r.last_lit && (O(r, !1), r.strm.avail_out === 0)
                  ? n
                  : B
              );
            }
            function it(r, D) {
              for (var M, g, p; ; ) {
                if (r.lookahead < Q) {
                  if ((ot(r), r.lookahead < Q && D === y)) return n;
                  if (r.lookahead === 0) break;
                }
                if (
                  ((M = 0),
                  r.lookahead >= I &&
                    ((r.ins_h =
                      ((r.ins_h << r.hash_shift) ^
                        r.window[r.strstart + I - 1]) &
                      r.hash_mask),
                    (M = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h]),
                    (r.head[r.ins_h] = r.strstart)),
                  (r.prev_length = r.match_length),
                  (r.prev_match = r.match_start),
                  (r.match_length = I - 1),
                  M !== 0 &&
                    r.prev_length < r.max_lazy_match &&
                    r.strstart - M <= r.w_size - Q &&
                    ((r.match_length = q(r, M)),
                    r.match_length <= 5 &&
                      (r.strategy === 1 ||
                        (r.match_length === I &&
                          4096 < r.strstart - r.match_start)) &&
                      (r.match_length = I - 1)),
                  r.prev_length >= I && r.match_length <= r.prev_length)
                ) {
                  for (
                    p = r.strstart + r.lookahead - I,
                      g = s._tr_tally(
                        r,
                        r.strstart - 1 - r.prev_match,
                        r.prev_length - I
                      ),
                      r.lookahead -= r.prev_length - 1,
                      r.prev_length -= 2;
                    ++r.strstart <= p &&
                      ((r.ins_h =
                        ((r.ins_h << r.hash_shift) ^
                          r.window[r.strstart + I - 1]) &
                        r.hash_mask),
                      (M = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h]),
                      (r.head[r.ins_h] = r.strstart)),
                      --r.prev_length != 0;

                  );
                  if (
                    ((r.match_available = 0),
                    (r.match_length = I - 1),
                    r.strstart++,
                    g && (O(r, !1), r.strm.avail_out === 0))
                  )
                    return n;
                } else if (r.match_available) {
                  if (
                    ((g = s._tr_tally(r, 0, r.window[r.strstart - 1])) &&
                      O(r, !1),
                    r.strstart++,
                    r.lookahead--,
                    r.strm.avail_out === 0)
                  )
                    return n;
                } else (r.match_available = 1), r.strstart++, r.lookahead--;
              }
              return (
                r.match_available &&
                  ((g = s._tr_tally(r, 0, r.window[r.strstart - 1])),
                  (r.match_available = 0)),
                (r.insert = r.strstart < I - 1 ? r.strstart : I - 1),
                D === w
                  ? (O(r, !0), r.strm.avail_out === 0 ? et : W)
                  : r.last_lit && (O(r, !1), r.strm.avail_out === 0)
                  ? n
                  : B
              );
            }
            function st(r, D, M, g, p) {
              (this.good_length = r),
                (this.max_lazy = D),
                (this.nice_length = M),
                (this.max_chain = g),
                (this.func = p);
            }
            function ut() {
              (this.strm = null),
                (this.status = 0),
                (this.pending_buf = null),
                (this.pending_buf_size = 0),
                (this.pending_out = 0),
                (this.pending = 0),
                (this.wrap = 0),
                (this.gzhead = null),
                (this.gzindex = 0),
                (this.method = b),
                (this.last_flush = -1),
                (this.w_size = 0),
                (this.w_bits = 0),
                (this.w_mask = 0),
                (this.window = null),
                (this.window_size = 0),
                (this.prev = null),
                (this.head = null),
                (this.ins_h = 0),
                (this.hash_size = 0),
                (this.hash_bits = 0),
                (this.hash_mask = 0),
                (this.hash_shift = 0),
                (this.block_start = 0),
                (this.match_length = 0),
                (this.prev_match = 0),
                (this.match_available = 0),
                (this.strstart = 0),
                (this.match_start = 0),
                (this.lookahead = 0),
                (this.prev_length = 0),
                (this.max_chain_length = 0),
                (this.max_lazy_match = 0),
                (this.level = 0),
                (this.strategy = 0),
                (this.good_match = 0),
                (this.nice_match = 0),
                (this.dyn_ltree = new o.Buf16(2 * F)),
                (this.dyn_dtree = new o.Buf16(2 * (2 * S + 1))),
                (this.bl_tree = new o.Buf16(2 * (2 * R + 1))),
                tt(this.dyn_ltree),
                tt(this.dyn_dtree),
                tt(this.bl_tree),
                (this.l_desc = null),
                (this.d_desc = null),
                (this.bl_desc = null),
                (this.bl_count = new o.Buf16(j + 1)),
                (this.heap = new o.Buf16(2 * T + 1)),
                tt(this.heap),
                (this.heap_len = 0),
                (this.heap_max = 0),
                (this.depth = new o.Buf16(2 * T + 1)),
                tt(this.depth),
                (this.l_buf = 0),
                (this.lit_bufsize = 0),
                (this.last_lit = 0),
                (this.d_buf = 0),
                (this.opt_len = 0),
                (this.static_len = 0),
                (this.matches = 0),
                (this.insert = 0),
                (this.bi_buf = 0),
                (this.bi_valid = 0);
            }
            function ht(r) {
              var D;
              return r && r.state
                ? ((r.total_in = r.total_out = 0),
                  (r.data_type = u),
                  ((D = r.state).pending = 0),
                  (D.pending_out = 0),
                  D.wrap < 0 && (D.wrap = -D.wrap),
                  (D.status = D.wrap ? k : L),
                  (r.adler = D.wrap === 2 ? 0 : 1),
                  (D.last_flush = y),
                  s._tr_init(D),
                  d)
                : rt(r, _);
            }
            function gt(r) {
              var D = ht(r);
              return (
                D === d &&
                  (function (M) {
                    (M.window_size = 2 * M.w_size),
                      tt(M.head),
                      (M.max_lazy_match = i[M.level].max_lazy),
                      (M.good_match = i[M.level].good_length),
                      (M.nice_match = i[M.level].nice_length),
                      (M.max_chain_length = i[M.level].max_chain),
                      (M.strstart = 0),
                      (M.block_start = 0),
                      (M.lookahead = 0),
                      (M.insert = 0),
                      (M.match_length = M.prev_length = I - 1),
                      (M.match_available = 0),
                      (M.ins_h = 0);
                  })(r.state),
                D
              );
            }
            function ft(r, D, M, g, p, C) {
              if (!r) return _;
              var P = 1;
              if (
                (D === l && (D = 6),
                g < 0 ? ((P = 0), (g = -g)) : 15 < g && ((P = 2), (g -= 16)),
                p < 1 ||
                  x < p ||
                  M !== b ||
                  g < 8 ||
                  15 < g ||
                  D < 0 ||
                  9 < D ||
                  C < 0 ||
                  m < C)
              )
                return rt(r, _);
              g === 8 && (g = 9);
              var N = new ut();
              return (
                ((r.state = N).strm = r),
                (N.wrap = P),
                (N.gzhead = null),
                (N.w_bits = g),
                (N.w_size = 1 << N.w_bits),
                (N.w_mask = N.w_size - 1),
                (N.hash_bits = p + 7),
                (N.hash_size = 1 << N.hash_bits),
                (N.hash_mask = N.hash_size - 1),
                (N.hash_shift = ~~((N.hash_bits + I - 1) / I)),
                (N.window = new o.Buf8(2 * N.w_size)),
                (N.head = new o.Buf16(N.hash_size)),
                (N.prev = new o.Buf16(N.w_size)),
                (N.lit_bufsize = 1 << (p + 6)),
                (N.pending_buf_size = 4 * N.lit_bufsize),
                (N.pending_buf = new o.Buf8(N.pending_buf_size)),
                (N.d_buf = 1 * N.lit_bufsize),
                (N.l_buf = 3 * N.lit_bufsize),
                (N.level = D),
                (N.strategy = C),
                (N.method = M),
                gt(r)
              );
            }
            (i = [
              new st(0, 0, 0, 0, function (r, D) {
                var M = 65535;
                for (
                  M > r.pending_buf_size - 5 && (M = r.pending_buf_size - 5);
                  ;

                ) {
                  if (r.lookahead <= 1) {
                    if ((ot(r), r.lookahead === 0 && D === y)) return n;
                    if (r.lookahead === 0) break;
                  }
                  (r.strstart += r.lookahead), (r.lookahead = 0);
                  var g = r.block_start + M;
                  if (
                    ((r.strstart === 0 || r.strstart >= g) &&
                      ((r.lookahead = r.strstart - g),
                      (r.strstart = g),
                      O(r, !1),
                      r.strm.avail_out === 0)) ||
                    (r.strstart - r.block_start >= r.w_size - Q &&
                      (O(r, !1), r.strm.avail_out === 0))
                  )
                    return n;
                }
                return (
                  (r.insert = 0),
                  D === w
                    ? (O(r, !0), r.strm.avail_out === 0 ? et : W)
                    : (r.strstart > r.block_start &&
                        (O(r, !1), r.strm.avail_out),
                      n)
                );
              }),
              new st(4, 4, 8, 4, ct),
              new st(4, 5, 16, 8, ct),
              new st(4, 6, 32, 32, ct),
              new st(4, 4, 16, 16, it),
              new st(8, 16, 32, 32, it),
              new st(8, 16, 128, 128, it),
              new st(8, 32, 128, 256, it),
              new st(32, 128, 258, 1024, it),
              new st(32, 258, 258, 4096, it),
            ]),
              (h.deflateInit = function (r, D) {
                return ft(r, D, b, 15, 8, 0);
              }),
              (h.deflateInit2 = ft),
              (h.deflateReset = gt),
              (h.deflateResetKeep = ht),
              (h.deflateSetHeader = function (r, D) {
                return r && r.state
                  ? r.state.wrap !== 2
                    ? _
                    : ((r.state.gzhead = D), d)
                  : _;
              }),
              (h.deflate = function (r, D) {
                var M, g, p, C;
                if (!r || !r.state || 5 < D || D < 0) return r ? rt(r, _) : _;
                if (
                  ((g = r.state),
                  !r.output ||
                    (!r.input && r.avail_in !== 0) ||
                    (g.status === 666 && D !== w))
                )
                  return rt(r, r.avail_out === 0 ? -5 : _);
                if (
                  ((g.strm = r),
                  (M = g.last_flush),
                  (g.last_flush = D),
                  g.status === k)
                )
                  if (g.wrap === 2)
                    (r.adler = 0),
                      J(g, 31),
                      J(g, 139),
                      J(g, 8),
                      g.gzhead
                        ? (J(
                            g,
                            (g.gzhead.text ? 1 : 0) +
                              (g.gzhead.hcrc ? 2 : 0) +
                              (g.gzhead.extra ? 4 : 0) +
                              (g.gzhead.name ? 8 : 0) +
                              (g.gzhead.comment ? 16 : 0)
                          ),
                          J(g, 255 & g.gzhead.time),
                          J(g, (g.gzhead.time >> 8) & 255),
                          J(g, (g.gzhead.time >> 16) & 255),
                          J(g, (g.gzhead.time >> 24) & 255),
                          J(
                            g,
                            g.level === 9
                              ? 2
                              : 2 <= g.strategy || g.level < 2
                              ? 4
                              : 0
                          ),
                          J(g, 255 & g.gzhead.os),
                          g.gzhead.extra &&
                            g.gzhead.extra.length &&
                            (J(g, 255 & g.gzhead.extra.length),
                            J(g, (g.gzhead.extra.length >> 8) & 255)),
                          g.gzhead.hcrc &&
                            (r.adler = v(r.adler, g.pending_buf, g.pending, 0)),
                          (g.gzindex = 0),
                          (g.status = 69))
                        : (J(g, 0),
                          J(g, 0),
                          J(g, 0),
                          J(g, 0),
                          J(g, 0),
                          J(
                            g,
                            g.level === 9
                              ? 2
                              : 2 <= g.strategy || g.level < 2
                              ? 4
                              : 0
                          ),
                          J(g, 3),
                          (g.status = L));
                  else {
                    var P = (b + ((g.w_bits - 8) << 4)) << 8;
                    (P |=
                      (2 <= g.strategy || g.level < 2
                        ? 0
                        : g.level < 6
                        ? 1
                        : g.level === 6
                        ? 2
                        : 3) << 6),
                      g.strstart !== 0 && (P |= 32),
                      (P += 31 - (P % 31)),
                      (g.status = L),
                      V(g, P),
                      g.strstart !== 0 &&
                        (V(g, r.adler >>> 16), V(g, 65535 & r.adler)),
                      (r.adler = 1);
                  }
                if (g.status === 69)
                  if (g.gzhead.extra) {
                    for (
                      p = g.pending;
                      g.gzindex < (65535 & g.gzhead.extra.length) &&
                      (g.pending !== g.pending_buf_size ||
                        (g.gzhead.hcrc &&
                          g.pending > p &&
                          (r.adler = v(
                            r.adler,
                            g.pending_buf,
                            g.pending - p,
                            p
                          )),
                        z(r),
                        (p = g.pending),
                        g.pending !== g.pending_buf_size));

                    )
                      J(g, 255 & g.gzhead.extra[g.gzindex]), g.gzindex++;
                    g.gzhead.hcrc &&
                      g.pending > p &&
                      (r.adler = v(r.adler, g.pending_buf, g.pending - p, p)),
                      g.gzindex === g.gzhead.extra.length &&
                        ((g.gzindex = 0), (g.status = 73));
                  } else g.status = 73;
                if (g.status === 73)
                  if (g.gzhead.name) {
                    p = g.pending;
                    do {
                      if (
                        g.pending === g.pending_buf_size &&
                        (g.gzhead.hcrc &&
                          g.pending > p &&
                          (r.adler = v(
                            r.adler,
                            g.pending_buf,
                            g.pending - p,
                            p
                          )),
                        z(r),
                        (p = g.pending),
                        g.pending === g.pending_buf_size)
                      ) {
                        C = 1;
                        break;
                      }
                      (C =
                        g.gzindex < g.gzhead.name.length
                          ? 255 & g.gzhead.name.charCodeAt(g.gzindex++)
                          : 0),
                        J(g, C);
                    } while (C !== 0);
                    g.gzhead.hcrc &&
                      g.pending > p &&
                      (r.adler = v(r.adler, g.pending_buf, g.pending - p, p)),
                      C === 0 && ((g.gzindex = 0), (g.status = 91));
                  } else g.status = 91;
                if (g.status === 91)
                  if (g.gzhead.comment) {
                    p = g.pending;
                    do {
                      if (
                        g.pending === g.pending_buf_size &&
                        (g.gzhead.hcrc &&
                          g.pending > p &&
                          (r.adler = v(
                            r.adler,
                            g.pending_buf,
                            g.pending - p,
                            p
                          )),
                        z(r),
                        (p = g.pending),
                        g.pending === g.pending_buf_size)
                      ) {
                        C = 1;
                        break;
                      }
                      (C =
                        g.gzindex < g.gzhead.comment.length
                          ? 255 & g.gzhead.comment.charCodeAt(g.gzindex++)
                          : 0),
                        J(g, C);
                    } while (C !== 0);
                    g.gzhead.hcrc &&
                      g.pending > p &&
                      (r.adler = v(r.adler, g.pending_buf, g.pending - p, p)),
                      C === 0 && (g.status = 103);
                  } else g.status = 103;
                if (
                  (g.status === 103 &&
                    (g.gzhead.hcrc
                      ? (g.pending + 2 > g.pending_buf_size && z(r),
                        g.pending + 2 <= g.pending_buf_size &&
                          (J(g, 255 & r.adler),
                          J(g, (r.adler >> 8) & 255),
                          (r.adler = 0),
                          (g.status = L)))
                      : (g.status = L)),
                  g.pending !== 0)
                ) {
                  if ((z(r), r.avail_out === 0)) return (g.last_flush = -1), d;
                } else if (r.avail_in === 0 && X(D) <= X(M) && D !== w)
                  return rt(r, -5);
                if (g.status === 666 && r.avail_in !== 0) return rt(r, -5);
                if (
                  r.avail_in !== 0 ||
                  g.lookahead !== 0 ||
                  (D !== y && g.status !== 666)
                ) {
                  var N =
                    g.strategy === 2
                      ? (function (A, Y) {
                          for (var G; ; ) {
                            if (
                              A.lookahead === 0 &&
                              (ot(A), A.lookahead === 0)
                            ) {
                              if (Y === y) return n;
                              break;
                            }
                            if (
                              ((A.match_length = 0),
                              (G = s._tr_tally(A, 0, A.window[A.strstart])),
                              A.lookahead--,
                              A.strstart++,
                              G && (O(A, !1), A.strm.avail_out === 0))
                            )
                              return n;
                          }
                          return (
                            (A.insert = 0),
                            Y === w
                              ? (O(A, !0), A.strm.avail_out === 0 ? et : W)
                              : A.last_lit && (O(A, !1), A.strm.avail_out === 0)
                              ? n
                              : B
                          );
                        })(g, D)
                      : g.strategy === 3
                      ? (function (A, Y) {
                          for (var G, Z, K, at, nt = A.window; ; ) {
                            if (A.lookahead <= H) {
                              if ((ot(A), A.lookahead <= H && Y === y))
                                return n;
                              if (A.lookahead === 0) break;
                            }
                            if (
                              ((A.match_length = 0),
                              A.lookahead >= I &&
                                0 < A.strstart &&
                                (Z = nt[(K = A.strstart - 1)]) === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K])
                            ) {
                              at = A.strstart + H;
                              do;
                              while (
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                Z === nt[++K] &&
                                K < at
                              );
                              (A.match_length = H - (at - K)),
                                A.match_length > A.lookahead &&
                                  (A.match_length = A.lookahead);
                            }
                            if (
                              (A.match_length >= I
                                ? ((G = s._tr_tally(A, 1, A.match_length - I)),
                                  (A.lookahead -= A.match_length),
                                  (A.strstart += A.match_length),
                                  (A.match_length = 0))
                                : ((G = s._tr_tally(
                                    A,
                                    0,
                                    A.window[A.strstart]
                                  )),
                                  A.lookahead--,
                                  A.strstart++),
                              G && (O(A, !1), A.strm.avail_out === 0))
                            )
                              return n;
                          }
                          return (
                            (A.insert = 0),
                            Y === w
                              ? (O(A, !0), A.strm.avail_out === 0 ? et : W)
                              : A.last_lit && (O(A, !1), A.strm.avail_out === 0)
                              ? n
                              : B
                          );
                        })(g, D)
                      : i[g.level].func(g, D);
                  if (
                    ((N !== et && N !== W) || (g.status = 666),
                    N === n || N === et)
                  )
                    return r.avail_out === 0 && (g.last_flush = -1), d;
                  if (
                    N === B &&
                    (D === 1
                      ? s._tr_align(g)
                      : D !== 5 &&
                        (s._tr_stored_block(g, 0, 0, !1),
                        D === 3 &&
                          (tt(g.head),
                          g.lookahead === 0 &&
                            ((g.strstart = 0),
                            (g.block_start = 0),
                            (g.insert = 0)))),
                    z(r),
                    r.avail_out === 0)
                  )
                    return (g.last_flush = -1), d;
                }
                return D !== w
                  ? d
                  : g.wrap <= 0
                  ? 1
                  : (g.wrap === 2
                      ? (J(g, 255 & r.adler),
                        J(g, (r.adler >> 8) & 255),
                        J(g, (r.adler >> 16) & 255),
                        J(g, (r.adler >> 24) & 255),
                        J(g, 255 & r.total_in),
                        J(g, (r.total_in >> 8) & 255),
                        J(g, (r.total_in >> 16) & 255),
                        J(g, (r.total_in >> 24) & 255))
                      : (V(g, r.adler >>> 16), V(g, 65535 & r.adler)),
                    z(r),
                    0 < g.wrap && (g.wrap = -g.wrap),
                    g.pending !== 0 ? d : 1);
              }),
              (h.deflateEnd = function (r) {
                var D;
                return r && r.state
                  ? (D = r.state.status) !== k &&
                    D !== 69 &&
                    D !== 73 &&
                    D !== 91 &&
                    D !== 103 &&
                    D !== L &&
                    D !== 666
                    ? rt(r, _)
                    : ((r.state = null), D === L ? rt(r, -3) : d)
                  : _;
              }),
              (h.deflateSetDictionary = function (r, D) {
                var M,
                  g,
                  p,
                  C,
                  P,
                  N,
                  A,
                  Y,
                  G = D.length;
                if (
                  !r ||
                  !r.state ||
                  (C = (M = r.state).wrap) === 2 ||
                  (C === 1 && M.status !== k) ||
                  M.lookahead
                )
                  return _;
                for (
                  C === 1 && (r.adler = f(r.adler, D, G, 0)),
                    M.wrap = 0,
                    G >= M.w_size &&
                      (C === 0 &&
                        (tt(M.head),
                        (M.strstart = 0),
                        (M.block_start = 0),
                        (M.insert = 0)),
                      (Y = new o.Buf8(M.w_size)),
                      o.arraySet(Y, D, G - M.w_size, M.w_size, 0),
                      (D = Y),
                      (G = M.w_size)),
                    P = r.avail_in,
                    N = r.next_in,
                    A = r.input,
                    r.avail_in = G,
                    r.next_in = 0,
                    r.input = D,
                    ot(M);
                  M.lookahead >= I;

                ) {
                  for (
                    g = M.strstart, p = M.lookahead - (I - 1);
                    (M.ins_h =
                      ((M.ins_h << M.hash_shift) ^ M.window[g + I - 1]) &
                      M.hash_mask),
                      (M.prev[g & M.w_mask] = M.head[M.ins_h]),
                      (M.head[M.ins_h] = g),
                      g++,
                      --p;

                  );
                  (M.strstart = g), (M.lookahead = I - 1), ot(M);
                }
                return (
                  (M.strstart += M.lookahead),
                  (M.block_start = M.strstart),
                  (M.insert = M.lookahead),
                  (M.lookahead = 0),
                  (M.match_length = M.prev_length = I - 1),
                  (M.match_available = 0),
                  (r.next_in = N),
                  (r.input = A),
                  (r.avail_in = P),
                  (M.wrap = C),
                  d
                );
              }),
              (h.deflateInfo = "pako deflate (from Nodeca project)");
          },
          {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./messages": 51,
            "./trees": 52,
          },
        ],
        47: [
          function (e, a, h) {
            a.exports = function () {
              (this.text = 0),
                (this.time = 0),
                (this.xflags = 0),
                (this.os = 0),
                (this.extra = null),
                (this.extra_len = 0),
                (this.name = ""),
                (this.comment = ""),
                (this.hcrc = 0),
                (this.done = !1);
            };
          },
          {},
        ],
        48: [
          function (e, a, h) {
            a.exports = function (i, o) {
              var s,
                f,
                v,
                E,
                y,
                w,
                d,
                _,
                l,
                m,
                u,
                b,
                x,
                T,
                S,
                R,
                F,
                j,
                I,
                H,
                Q,
                k,
                L,
                n,
                B;
              (s = i.state),
                (f = i.next_in),
                (n = i.input),
                (v = f + (i.avail_in - 5)),
                (E = i.next_out),
                (B = i.output),
                (y = E - (o - i.avail_out)),
                (w = E + (i.avail_out - 257)),
                (d = s.dmax),
                (_ = s.wsize),
                (l = s.whave),
                (m = s.wnext),
                (u = s.window),
                (b = s.hold),
                (x = s.bits),
                (T = s.lencode),
                (S = s.distcode),
                (R = (1 << s.lenbits) - 1),
                (F = (1 << s.distbits) - 1);
              t: do {
                x < 15 &&
                  ((b += n[f++] << x), (x += 8), (b += n[f++] << x), (x += 8)),
                  (j = T[b & R]);
                e: for (;;) {
                  if (
                    ((b >>>= I = j >>> 24),
                    (x -= I),
                    (I = (j >>> 16) & 255) === 0)
                  )
                    B[E++] = 65535 & j;
                  else {
                    if (!(16 & I)) {
                      if (!(64 & I)) {
                        j = T[(65535 & j) + (b & ((1 << I) - 1))];
                        continue e;
                      }
                      if (32 & I) {
                        s.mode = 12;
                        break t;
                      }
                      (i.msg = "invalid literal/length code"), (s.mode = 30);
                      break t;
                    }
                    (H = 65535 & j),
                      (I &= 15) &&
                        (x < I && ((b += n[f++] << x), (x += 8)),
                        (H += b & ((1 << I) - 1)),
                        (b >>>= I),
                        (x -= I)),
                      x < 15 &&
                        ((b += n[f++] << x),
                        (x += 8),
                        (b += n[f++] << x),
                        (x += 8)),
                      (j = S[b & F]);
                    r: for (;;) {
                      if (
                        ((b >>>= I = j >>> 24),
                        (x -= I),
                        !(16 & (I = (j >>> 16) & 255)))
                      ) {
                        if (!(64 & I)) {
                          j = S[(65535 & j) + (b & ((1 << I) - 1))];
                          continue r;
                        }
                        (i.msg = "invalid distance code"), (s.mode = 30);
                        break t;
                      }
                      if (
                        ((Q = 65535 & j),
                        x < (I &= 15) &&
                          ((b += n[f++] << x),
                          (x += 8) < I && ((b += n[f++] << x), (x += 8))),
                        d < (Q += b & ((1 << I) - 1)))
                      ) {
                        (i.msg = "invalid distance too far back"),
                          (s.mode = 30);
                        break t;
                      }
                      if (((b >>>= I), (x -= I), (I = E - y) < Q)) {
                        if (l < (I = Q - I) && s.sane) {
                          (i.msg = "invalid distance too far back"),
                            (s.mode = 30);
                          break t;
                        }
                        if (((L = u), (k = 0) === m)) {
                          if (((k += _ - I), I < H)) {
                            for (H -= I; (B[E++] = u[k++]), --I; );
                            (k = E - Q), (L = B);
                          }
                        } else if (m < I) {
                          if (((k += _ + m - I), (I -= m) < H)) {
                            for (H -= I; (B[E++] = u[k++]), --I; );
                            if (((k = 0), m < H)) {
                              for (H -= I = m; (B[E++] = u[k++]), --I; );
                              (k = E - Q), (L = B);
                            }
                          }
                        } else if (((k += m - I), I < H)) {
                          for (H -= I; (B[E++] = u[k++]), --I; );
                          (k = E - Q), (L = B);
                        }
                        for (; 2 < H; )
                          (B[E++] = L[k++]),
                            (B[E++] = L[k++]),
                            (B[E++] = L[k++]),
                            (H -= 3);
                        H && ((B[E++] = L[k++]), 1 < H && (B[E++] = L[k++]));
                      } else {
                        for (
                          k = E - Q;
                          (B[E++] = B[k++]),
                            (B[E++] = B[k++]),
                            (B[E++] = B[k++]),
                            2 < (H -= 3);

                        );
                        H && ((B[E++] = B[k++]), 1 < H && (B[E++] = B[k++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (f < v && E < w);
              (f -= H = x >> 3),
                (b &= (1 << (x -= H << 3)) - 1),
                (i.next_in = f),
                (i.next_out = E),
                (i.avail_in = f < v ? v - f + 5 : 5 - (f - v)),
                (i.avail_out = E < w ? w - E + 257 : 257 - (E - w)),
                (s.hold = b),
                (s.bits = x);
            };
          },
          {},
        ],
        49: [
          function (e, a, h) {
            var i = e("../utils/common"),
              o = e("./adler32"),
              s = e("./crc32"),
              f = e("./inffast"),
              v = e("./inftrees"),
              E = 1,
              y = 2,
              w = 0,
              d = -2,
              _ = 1,
              l = 852,
              m = 592;
            function u(k) {
              return (
                ((k >>> 24) & 255) +
                ((k >>> 8) & 65280) +
                ((65280 & k) << 8) +
                ((255 & k) << 24)
              );
            }
            function b() {
              (this.mode = 0),
                (this.last = !1),
                (this.wrap = 0),
                (this.havedict = !1),
                (this.flags = 0),
                (this.dmax = 0),
                (this.check = 0),
                (this.total = 0),
                (this.head = null),
                (this.wbits = 0),
                (this.wsize = 0),
                (this.whave = 0),
                (this.wnext = 0),
                (this.window = null),
                (this.hold = 0),
                (this.bits = 0),
                (this.length = 0),
                (this.offset = 0),
                (this.extra = 0),
                (this.lencode = null),
                (this.distcode = null),
                (this.lenbits = 0),
                (this.distbits = 0),
                (this.ncode = 0),
                (this.nlen = 0),
                (this.ndist = 0),
                (this.have = 0),
                (this.next = null),
                (this.lens = new i.Buf16(320)),
                (this.work = new i.Buf16(288)),
                (this.lendyn = null),
                (this.distdyn = null),
                (this.sane = 0),
                (this.back = 0),
                (this.was = 0);
            }
            function x(k) {
              var L;
              return k && k.state
                ? ((L = k.state),
                  (k.total_in = k.total_out = L.total = 0),
                  (k.msg = ""),
                  L.wrap && (k.adler = 1 & L.wrap),
                  (L.mode = _),
                  (L.last = 0),
                  (L.havedict = 0),
                  (L.dmax = 32768),
                  (L.head = null),
                  (L.hold = 0),
                  (L.bits = 0),
                  (L.lencode = L.lendyn = new i.Buf32(l)),
                  (L.distcode = L.distdyn = new i.Buf32(m)),
                  (L.sane = 1),
                  (L.back = -1),
                  w)
                : d;
            }
            function T(k) {
              var L;
              return k && k.state
                ? (((L = k.state).wsize = 0),
                  (L.whave = 0),
                  (L.wnext = 0),
                  x(k))
                : d;
            }
            function S(k, L) {
              var n, B;
              return k && k.state
                ? ((B = k.state),
                  L < 0
                    ? ((n = 0), (L = -L))
                    : ((n = 1 + (L >> 4)), L < 48 && (L &= 15)),
                  L && (L < 8 || 15 < L)
                    ? d
                    : (B.window !== null && B.wbits !== L && (B.window = null),
                      (B.wrap = n),
                      (B.wbits = L),
                      T(k)))
                : d;
            }
            function R(k, L) {
              var n, B;
              return k
                ? ((B = new b()),
                  ((k.state = B).window = null),
                  (n = S(k, L)) !== w && (k.state = null),
                  n)
                : d;
            }
            var F,
              j,
              I = !0;
            function H(k) {
              if (I) {
                var L;
                for (
                  F = new i.Buf32(512), j = new i.Buf32(32), L = 0;
                  L < 144;

                )
                  k.lens[L++] = 8;
                for (; L < 256; ) k.lens[L++] = 9;
                for (; L < 280; ) k.lens[L++] = 7;
                for (; L < 288; ) k.lens[L++] = 8;
                for (
                  v(E, k.lens, 0, 288, F, 0, k.work, { bits: 9 }), L = 0;
                  L < 32;

                )
                  k.lens[L++] = 5;
                v(y, k.lens, 0, 32, j, 0, k.work, { bits: 5 }), (I = !1);
              }
              (k.lencode = F),
                (k.lenbits = 9),
                (k.distcode = j),
                (k.distbits = 5);
            }
            function Q(k, L, n, B) {
              var et,
                W = k.state;
              return (
                W.window === null &&
                  ((W.wsize = 1 << W.wbits),
                  (W.wnext = 0),
                  (W.whave = 0),
                  (W.window = new i.Buf8(W.wsize))),
                B >= W.wsize
                  ? (i.arraySet(W.window, L, n - W.wsize, W.wsize, 0),
                    (W.wnext = 0),
                    (W.whave = W.wsize))
                  : (B < (et = W.wsize - W.wnext) && (et = B),
                    i.arraySet(W.window, L, n - B, et, W.wnext),
                    (B -= et)
                      ? (i.arraySet(W.window, L, n - B, B, 0),
                        (W.wnext = B),
                        (W.whave = W.wsize))
                      : ((W.wnext += et),
                        W.wnext === W.wsize && (W.wnext = 0),
                        W.whave < W.wsize && (W.whave += et))),
                0
              );
            }
            (h.inflateReset = T),
              (h.inflateReset2 = S),
              (h.inflateResetKeep = x),
              (h.inflateInit = function (k) {
                return R(k, 15);
              }),
              (h.inflateInit2 = R),
              (h.inflate = function (k, L) {
                var n,
                  B,
                  et,
                  W,
                  rt,
                  X,
                  tt,
                  z,
                  O,
                  J,
                  V,
                  q,
                  ot,
                  ct,
                  it,
                  st,
                  ut,
                  ht,
                  gt,
                  ft,
                  r,
                  D,
                  M,
                  g,
                  p = 0,
                  C = new i.Buf8(4),
                  P = [
                    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                    1, 15,
                  ];
                if (
                  !k ||
                  !k.state ||
                  !k.output ||
                  (!k.input && k.avail_in !== 0)
                )
                  return d;
                (n = k.state).mode === 12 && (n.mode = 13),
                  (rt = k.next_out),
                  (et = k.output),
                  (tt = k.avail_out),
                  (W = k.next_in),
                  (B = k.input),
                  (X = k.avail_in),
                  (z = n.hold),
                  (O = n.bits),
                  (J = X),
                  (V = tt),
                  (D = w);
                t: for (;;)
                  switch (n.mode) {
                    case _:
                      if (n.wrap === 0) {
                        n.mode = 13;
                        break;
                      }
                      for (; O < 16; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if (2 & n.wrap && z === 35615) {
                        (C[(n.check = 0)] = 255 & z),
                          (C[1] = (z >>> 8) & 255),
                          (n.check = s(n.check, C, 2, 0)),
                          (O = z = 0),
                          (n.mode = 2);
                        break;
                      }
                      if (
                        ((n.flags = 0),
                        n.head && (n.head.done = !1),
                        !(1 & n.wrap) || (((255 & z) << 8) + (z >> 8)) % 31)
                      ) {
                        (k.msg = "incorrect header check"), (n.mode = 30);
                        break;
                      }
                      if ((15 & z) != 8) {
                        (k.msg = "unknown compression method"), (n.mode = 30);
                        break;
                      }
                      if (
                        ((O -= 4), (r = 8 + (15 & (z >>>= 4))), n.wbits === 0)
                      )
                        n.wbits = r;
                      else if (r > n.wbits) {
                        (k.msg = "invalid window size"), (n.mode = 30);
                        break;
                      }
                      (n.dmax = 1 << r),
                        (k.adler = n.check = 1),
                        (n.mode = 512 & z ? 10 : 12),
                        (O = z = 0);
                      break;
                    case 2:
                      for (; O < 16; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if (((n.flags = z), (255 & n.flags) != 8)) {
                        (k.msg = "unknown compression method"), (n.mode = 30);
                        break;
                      }
                      if (57344 & n.flags) {
                        (k.msg = "unknown header flags set"), (n.mode = 30);
                        break;
                      }
                      n.head && (n.head.text = (z >> 8) & 1),
                        512 & n.flags &&
                          ((C[0] = 255 & z),
                          (C[1] = (z >>> 8) & 255),
                          (n.check = s(n.check, C, 2, 0))),
                        (O = z = 0),
                        (n.mode = 3);
                    case 3:
                      for (; O < 32; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      n.head && (n.head.time = z),
                        512 & n.flags &&
                          ((C[0] = 255 & z),
                          (C[1] = (z >>> 8) & 255),
                          (C[2] = (z >>> 16) & 255),
                          (C[3] = (z >>> 24) & 255),
                          (n.check = s(n.check, C, 4, 0))),
                        (O = z = 0),
                        (n.mode = 4);
                    case 4:
                      for (; O < 16; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      n.head &&
                        ((n.head.xflags = 255 & z), (n.head.os = z >> 8)),
                        512 & n.flags &&
                          ((C[0] = 255 & z),
                          (C[1] = (z >>> 8) & 255),
                          (n.check = s(n.check, C, 2, 0))),
                        (O = z = 0),
                        (n.mode = 5);
                    case 5:
                      if (1024 & n.flags) {
                        for (; O < 16; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (n.length = z),
                          n.head && (n.head.extra_len = z),
                          512 & n.flags &&
                            ((C[0] = 255 & z),
                            (C[1] = (z >>> 8) & 255),
                            (n.check = s(n.check, C, 2, 0))),
                          (O = z = 0);
                      } else n.head && (n.head.extra = null);
                      n.mode = 6;
                    case 6:
                      if (
                        1024 & n.flags &&
                        (X < (q = n.length) && (q = X),
                        q &&
                          (n.head &&
                            ((r = n.head.extra_len - n.length),
                            n.head.extra ||
                              (n.head.extra = new Array(n.head.extra_len)),
                            i.arraySet(n.head.extra, B, W, q, r)),
                          512 & n.flags && (n.check = s(n.check, B, q, W)),
                          (X -= q),
                          (W += q),
                          (n.length -= q)),
                        n.length)
                      )
                        break t;
                      (n.length = 0), (n.mode = 7);
                    case 7:
                      if (2048 & n.flags) {
                        if (X === 0) break t;
                        for (
                          q = 0;
                          (r = B[W + q++]),
                            n.head &&
                              r &&
                              n.length < 65536 &&
                              (n.head.name += String.fromCharCode(r)),
                            r && q < X;

                        );
                        if (
                          (512 & n.flags && (n.check = s(n.check, B, q, W)),
                          (X -= q),
                          (W += q),
                          r)
                        )
                          break t;
                      } else n.head && (n.head.name = null);
                      (n.length = 0), (n.mode = 8);
                    case 8:
                      if (4096 & n.flags) {
                        if (X === 0) break t;
                        for (
                          q = 0;
                          (r = B[W + q++]),
                            n.head &&
                              r &&
                              n.length < 65536 &&
                              (n.head.comment += String.fromCharCode(r)),
                            r && q < X;

                        );
                        if (
                          (512 & n.flags && (n.check = s(n.check, B, q, W)),
                          (X -= q),
                          (W += q),
                          r)
                        )
                          break t;
                      } else n.head && (n.head.comment = null);
                      n.mode = 9;
                    case 9:
                      if (512 & n.flags) {
                        for (; O < 16; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        if (z !== (65535 & n.check)) {
                          (k.msg = "header crc mismatch"), (n.mode = 30);
                          break;
                        }
                        O = z = 0;
                      }
                      n.head &&
                        ((n.head.hcrc = (n.flags >> 9) & 1),
                        (n.head.done = !0)),
                        (k.adler = n.check = 0),
                        (n.mode = 12);
                      break;
                    case 10:
                      for (; O < 32; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      (k.adler = n.check = u(z)), (O = z = 0), (n.mode = 11);
                    case 11:
                      if (n.havedict === 0)
                        return (
                          (k.next_out = rt),
                          (k.avail_out = tt),
                          (k.next_in = W),
                          (k.avail_in = X),
                          (n.hold = z),
                          (n.bits = O),
                          2
                        );
                      (k.adler = n.check = 1), (n.mode = 12);
                    case 12:
                      if (L === 5 || L === 6) break t;
                    case 13:
                      if (n.last) {
                        (z >>>= 7 & O), (O -= 7 & O), (n.mode = 27);
                        break;
                      }
                      for (; O < 3; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      switch (((n.last = 1 & z), (O -= 1), 3 & (z >>>= 1))) {
                        case 0:
                          n.mode = 14;
                          break;
                        case 1:
                          if ((H(n), (n.mode = 20), L !== 6)) break;
                          (z >>>= 2), (O -= 2);
                          break t;
                        case 2:
                          n.mode = 17;
                          break;
                        case 3:
                          (k.msg = "invalid block type"), (n.mode = 30);
                      }
                      (z >>>= 2), (O -= 2);
                      break;
                    case 14:
                      for (z >>>= 7 & O, O -= 7 & O; O < 32; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if ((65535 & z) != ((z >>> 16) ^ 65535)) {
                        (k.msg = "invalid stored block lengths"), (n.mode = 30);
                        break;
                      }
                      if (
                        ((n.length = 65535 & z),
                        (O = z = 0),
                        (n.mode = 15),
                        L === 6)
                      )
                        break t;
                    case 15:
                      n.mode = 16;
                    case 16:
                      if ((q = n.length)) {
                        if ((X < q && (q = X), tt < q && (q = tt), q === 0))
                          break t;
                        i.arraySet(et, B, W, q, rt),
                          (X -= q),
                          (W += q),
                          (tt -= q),
                          (rt += q),
                          (n.length -= q);
                        break;
                      }
                      n.mode = 12;
                      break;
                    case 17:
                      for (; O < 14; ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if (
                        ((n.nlen = 257 + (31 & z)),
                        (z >>>= 5),
                        (O -= 5),
                        (n.ndist = 1 + (31 & z)),
                        (z >>>= 5),
                        (O -= 5),
                        (n.ncode = 4 + (15 & z)),
                        (z >>>= 4),
                        (O -= 4),
                        286 < n.nlen || 30 < n.ndist)
                      ) {
                        (k.msg = "too many length or distance symbols"),
                          (n.mode = 30);
                        break;
                      }
                      (n.have = 0), (n.mode = 18);
                    case 18:
                      for (; n.have < n.ncode; ) {
                        for (; O < 3; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (n.lens[P[n.have++]] = 7 & z), (z >>>= 3), (O -= 3);
                      }
                      for (; n.have < 19; ) n.lens[P[n.have++]] = 0;
                      if (
                        ((n.lencode = n.lendyn),
                        (n.lenbits = 7),
                        (M = { bits: n.lenbits }),
                        (D = v(0, n.lens, 0, 19, n.lencode, 0, n.work, M)),
                        (n.lenbits = M.bits),
                        D)
                      ) {
                        (k.msg = "invalid code lengths set"), (n.mode = 30);
                        break;
                      }
                      (n.have = 0), (n.mode = 19);
                    case 19:
                      for (; n.have < n.nlen + n.ndist; ) {
                        for (
                          ;
                          (st =
                            ((p = n.lencode[z & ((1 << n.lenbits) - 1)]) >>>
                              16) &
                            255),
                            (ut = 65535 & p),
                            !((it = p >>> 24) <= O);

                        ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        if (ut < 16)
                          (z >>>= it), (O -= it), (n.lens[n.have++] = ut);
                        else {
                          if (ut === 16) {
                            for (g = it + 2; O < g; ) {
                              if (X === 0) break t;
                              X--, (z += B[W++] << O), (O += 8);
                            }
                            if (((z >>>= it), (O -= it), n.have === 0)) {
                              (k.msg = "invalid bit length repeat"),
                                (n.mode = 30);
                              break;
                            }
                            (r = n.lens[n.have - 1]),
                              (q = 3 + (3 & z)),
                              (z >>>= 2),
                              (O -= 2);
                          } else if (ut === 17) {
                            for (g = it + 3; O < g; ) {
                              if (X === 0) break t;
                              X--, (z += B[W++] << O), (O += 8);
                            }
                            (O -= it),
                              (r = 0),
                              (q = 3 + (7 & (z >>>= it))),
                              (z >>>= 3),
                              (O -= 3);
                          } else {
                            for (g = it + 7; O < g; ) {
                              if (X === 0) break t;
                              X--, (z += B[W++] << O), (O += 8);
                            }
                            (O -= it),
                              (r = 0),
                              (q = 11 + (127 & (z >>>= it))),
                              (z >>>= 7),
                              (O -= 7);
                          }
                          if (n.have + q > n.nlen + n.ndist) {
                            (k.msg = "invalid bit length repeat"),
                              (n.mode = 30);
                            break;
                          }
                          for (; q--; ) n.lens[n.have++] = r;
                        }
                      }
                      if (n.mode === 30) break;
                      if (n.lens[256] === 0) {
                        (k.msg = "invalid code -- missing end-of-block"),
                          (n.mode = 30);
                        break;
                      }
                      if (
                        ((n.lenbits = 9),
                        (M = { bits: n.lenbits }),
                        (D = v(E, n.lens, 0, n.nlen, n.lencode, 0, n.work, M)),
                        (n.lenbits = M.bits),
                        D)
                      ) {
                        (k.msg = "invalid literal/lengths set"), (n.mode = 30);
                        break;
                      }
                      if (
                        ((n.distbits = 6),
                        (n.distcode = n.distdyn),
                        (M = { bits: n.distbits }),
                        (D = v(
                          y,
                          n.lens,
                          n.nlen,
                          n.ndist,
                          n.distcode,
                          0,
                          n.work,
                          M
                        )),
                        (n.distbits = M.bits),
                        D)
                      ) {
                        (k.msg = "invalid distances set"), (n.mode = 30);
                        break;
                      }
                      if (((n.mode = 20), L === 6)) break t;
                    case 20:
                      n.mode = 21;
                    case 21:
                      if (6 <= X && 258 <= tt) {
                        (k.next_out = rt),
                          (k.avail_out = tt),
                          (k.next_in = W),
                          (k.avail_in = X),
                          (n.hold = z),
                          (n.bits = O),
                          f(k, V),
                          (rt = k.next_out),
                          (et = k.output),
                          (tt = k.avail_out),
                          (W = k.next_in),
                          (B = k.input),
                          (X = k.avail_in),
                          (z = n.hold),
                          (O = n.bits),
                          n.mode === 12 && (n.back = -1);
                        break;
                      }
                      for (
                        n.back = 0;
                        (st =
                          ((p = n.lencode[z & ((1 << n.lenbits) - 1)]) >>> 16) &
                          255),
                          (ut = 65535 & p),
                          !((it = p >>> 24) <= O);

                      ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if (st && !(240 & st)) {
                        for (
                          ht = it, gt = st, ft = ut;
                          (st =
                            ((p =
                              n.lencode[
                                ft + ((z & ((1 << (ht + gt)) - 1)) >> ht)
                              ]) >>>
                              16) &
                            255),
                            (ut = 65535 & p),
                            !(ht + (it = p >>> 24) <= O);

                        ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (z >>>= ht), (O -= ht), (n.back += ht);
                      }
                      if (
                        ((z >>>= it),
                        (O -= it),
                        (n.back += it),
                        (n.length = ut),
                        st === 0)
                      ) {
                        n.mode = 26;
                        break;
                      }
                      if (32 & st) {
                        (n.back = -1), (n.mode = 12);
                        break;
                      }
                      if (64 & st) {
                        (k.msg = "invalid literal/length code"), (n.mode = 30);
                        break;
                      }
                      (n.extra = 15 & st), (n.mode = 22);
                    case 22:
                      if (n.extra) {
                        for (g = n.extra; O < g; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (n.length += z & ((1 << n.extra) - 1)),
                          (z >>>= n.extra),
                          (O -= n.extra),
                          (n.back += n.extra);
                      }
                      (n.was = n.length), (n.mode = 23);
                    case 23:
                      for (
                        ;
                        (st =
                          ((p = n.distcode[z & ((1 << n.distbits) - 1)]) >>>
                            16) &
                          255),
                          (ut = 65535 & p),
                          !((it = p >>> 24) <= O);

                      ) {
                        if (X === 0) break t;
                        X--, (z += B[W++] << O), (O += 8);
                      }
                      if (!(240 & st)) {
                        for (
                          ht = it, gt = st, ft = ut;
                          (st =
                            ((p =
                              n.distcode[
                                ft + ((z & ((1 << (ht + gt)) - 1)) >> ht)
                              ]) >>>
                              16) &
                            255),
                            (ut = 65535 & p),
                            !(ht + (it = p >>> 24) <= O);

                        ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (z >>>= ht), (O -= ht), (n.back += ht);
                      }
                      if (((z >>>= it), (O -= it), (n.back += it), 64 & st)) {
                        (k.msg = "invalid distance code"), (n.mode = 30);
                        break;
                      }
                      (n.offset = ut), (n.extra = 15 & st), (n.mode = 24);
                    case 24:
                      if (n.extra) {
                        for (g = n.extra; O < g; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        (n.offset += z & ((1 << n.extra) - 1)),
                          (z >>>= n.extra),
                          (O -= n.extra),
                          (n.back += n.extra);
                      }
                      if (n.offset > n.dmax) {
                        (k.msg = "invalid distance too far back"),
                          (n.mode = 30);
                        break;
                      }
                      n.mode = 25;
                    case 25:
                      if (tt === 0) break t;
                      if (((q = V - tt), n.offset > q)) {
                        if ((q = n.offset - q) > n.whave && n.sane) {
                          (k.msg = "invalid distance too far back"),
                            (n.mode = 30);
                          break;
                        }
                        (ot =
                          q > n.wnext
                            ? ((q -= n.wnext), n.wsize - q)
                            : n.wnext - q),
                          q > n.length && (q = n.length),
                          (ct = n.window);
                      } else (ct = et), (ot = rt - n.offset), (q = n.length);
                      for (
                        tt < q && (q = tt), tt -= q, n.length -= q;
                        (et[rt++] = ct[ot++]), --q;

                      );
                      n.length === 0 && (n.mode = 21);
                      break;
                    case 26:
                      if (tt === 0) break t;
                      (et[rt++] = n.length), tt--, (n.mode = 21);
                      break;
                    case 27:
                      if (n.wrap) {
                        for (; O < 32; ) {
                          if (X === 0) break t;
                          X--, (z |= B[W++] << O), (O += 8);
                        }
                        if (
                          ((V -= tt),
                          (k.total_out += V),
                          (n.total += V),
                          V &&
                            (k.adler = n.check =
                              n.flags
                                ? s(n.check, et, V, rt - V)
                                : o(n.check, et, V, rt - V)),
                          (V = tt),
                          (n.flags ? z : u(z)) !== n.check)
                        ) {
                          (k.msg = "incorrect data check"), (n.mode = 30);
                          break;
                        }
                        O = z = 0;
                      }
                      n.mode = 28;
                    case 28:
                      if (n.wrap && n.flags) {
                        for (; O < 32; ) {
                          if (X === 0) break t;
                          X--, (z += B[W++] << O), (O += 8);
                        }
                        if (z !== (4294967295 & n.total)) {
                          (k.msg = "incorrect length check"), (n.mode = 30);
                          break;
                        }
                        O = z = 0;
                      }
                      n.mode = 29;
                    case 29:
                      D = 1;
                      break t;
                    case 30:
                      D = -3;
                      break t;
                    case 31:
                      return -4;
                    case 32:
                    default:
                      return d;
                  }
                return (
                  (k.next_out = rt),
                  (k.avail_out = tt),
                  (k.next_in = W),
                  (k.avail_in = X),
                  (n.hold = z),
                  (n.bits = O),
                  (n.wsize ||
                    (V !== k.avail_out &&
                      n.mode < 30 &&
                      (n.mode < 27 || L !== 4))) &&
                  Q(k, k.output, k.next_out, V - k.avail_out)
                    ? ((n.mode = 31), -4)
                    : ((J -= k.avail_in),
                      (V -= k.avail_out),
                      (k.total_in += J),
                      (k.total_out += V),
                      (n.total += V),
                      n.wrap &&
                        V &&
                        (k.adler = n.check =
                          n.flags
                            ? s(n.check, et, V, k.next_out - V)
                            : o(n.check, et, V, k.next_out - V)),
                      (k.data_type =
                        n.bits +
                        (n.last ? 64 : 0) +
                        (n.mode === 12 ? 128 : 0) +
                        (n.mode === 20 || n.mode === 15 ? 256 : 0)),
                      ((J == 0 && V === 0) || L === 4) && D === w && (D = -5),
                      D)
                );
              }),
              (h.inflateEnd = function (k) {
                if (!k || !k.state) return d;
                var L = k.state;
                return L.window && (L.window = null), (k.state = null), w;
              }),
              (h.inflateGetHeader = function (k, L) {
                var n;
                return k && k.state && 2 & (n = k.state).wrap
                  ? (((n.head = L).done = !1), w)
                  : d;
              }),
              (h.inflateSetDictionary = function (k, L) {
                var n,
                  B = L.length;
                return k && k.state
                  ? (n = k.state).wrap !== 0 && n.mode !== 11
                    ? d
                    : n.mode === 11 && o(1, L, B, 0) !== n.check
                    ? -3
                    : Q(k, L, B, B)
                    ? ((n.mode = 31), -4)
                    : ((n.havedict = 1), w)
                  : d;
              }),
              (h.inflateInfo = "pako inflate (from Nodeca project)");
          },
          {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./inffast": 48,
            "./inftrees": 50,
          },
        ],
        50: [
          function (e, a, h) {
            var i = e("../utils/common"),
              o = [
                3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
                51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
              ],
              s = [
                16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
                19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
              ],
              f = [
                1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
                385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
                16385, 24577, 0, 0,
              ],
              v = [
                16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
                23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
              ];
            a.exports = function (E, y, w, d, _, l, m, u) {
              var b,
                x,
                T,
                S,
                R,
                F,
                j,
                I,
                H,
                Q = u.bits,
                k = 0,
                L = 0,
                n = 0,
                B = 0,
                et = 0,
                W = 0,
                rt = 0,
                X = 0,
                tt = 0,
                z = 0,
                O = null,
                J = 0,
                V = new i.Buf16(16),
                q = new i.Buf16(16),
                ot = null,
                ct = 0;
              for (k = 0; k <= 15; k++) V[k] = 0;
              for (L = 0; L < d; L++) V[y[w + L]]++;
              for (et = Q, B = 15; 1 <= B && V[B] === 0; B--);
              if ((B < et && (et = B), B === 0))
                return (
                  (_[l++] = 20971520), (_[l++] = 20971520), (u.bits = 1), 0
                );
              for (n = 1; n < B && V[n] === 0; n++);
              for (et < n && (et = n), k = X = 1; k <= 15; k++)
                if (((X <<= 1), (X -= V[k]) < 0)) return -1;
              if (0 < X && (E === 0 || B !== 1)) return -1;
              for (q[1] = 0, k = 1; k < 15; k++) q[k + 1] = q[k] + V[k];
              for (L = 0; L < d; L++) y[w + L] !== 0 && (m[q[y[w + L]]++] = L);
              if (
                ((F =
                  E === 0
                    ? ((O = ot = m), 19)
                    : E === 1
                    ? ((O = o), (J -= 257), (ot = s), (ct -= 257), 256)
                    : ((O = f), (ot = v), -1)),
                (k = n),
                (R = l),
                (rt = L = z = 0),
                (T = -1),
                (S = (tt = 1 << (W = et)) - 1),
                (E === 1 && 852 < tt) || (E === 2 && 592 < tt))
              )
                return 1;
              for (;;) {
                for (
                  j = k - rt,
                    H =
                      m[L] < F
                        ? ((I = 0), m[L])
                        : m[L] > F
                        ? ((I = ot[ct + m[L]]), O[J + m[L]])
                        : ((I = 96), 0),
                    b = 1 << (k - rt),
                    n = x = 1 << W;
                  (_[R + (z >> rt) + (x -= b)] = (j << 24) | (I << 16) | H | 0),
                    x !== 0;

                );
                for (b = 1 << (k - 1); z & b; ) b >>= 1;
                if (
                  (b !== 0 ? ((z &= b - 1), (z += b)) : (z = 0),
                  L++,
                  --V[k] == 0)
                ) {
                  if (k === B) break;
                  k = y[w + m[L]];
                }
                if (et < k && (z & S) !== T) {
                  for (
                    rt === 0 && (rt = et), R += n, X = 1 << (W = k - rt);
                    W + rt < B && !((X -= V[W + rt]) <= 0);

                  )
                    W++, (X <<= 1);
                  if (
                    ((tt += 1 << W),
                    (E === 1 && 852 < tt) || (E === 2 && 592 < tt))
                  )
                    return 1;
                  _[(T = z & S)] = (et << 24) | (W << 16) | (R - l) | 0;
                }
              }
              return (
                z !== 0 && (_[R + z] = ((k - rt) << 24) | (64 << 16) | 0),
                (u.bits = et),
                0
              );
            };
          },
          { "../utils/common": 41 },
        ],
        51: [
          function (e, a, h) {
            a.exports = {
              2: "need dictionary",
              1: "stream end",
              0: "",
              "-1": "file error",
              "-2": "stream error",
              "-3": "data error",
              "-4": "insufficient memory",
              "-5": "buffer error",
              "-6": "incompatible version",
            };
          },
          {},
        ],
        52: [
          function (e, a, h) {
            var i = e("../utils/common"),
              o = 0,
              s = 1;
            function f(p) {
              for (var C = p.length; 0 <= --C; ) p[C] = 0;
            }
            var v = 0,
              E = 29,
              y = 256,
              w = y + 1 + E,
              d = 30,
              _ = 19,
              l = 2 * w + 1,
              m = 15,
              u = 16,
              b = 7,
              x = 256,
              T = 16,
              S = 17,
              R = 18,
              F = [
                0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                4, 4, 4, 5, 5, 5, 5, 0,
              ],
              j = [
                0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                9, 10, 10, 11, 11, 12, 12, 13, 13,
              ],
              I = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
              H = [
                16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                15,
              ],
              Q = new Array(2 * (w + 2));
            f(Q);
            var k = new Array(2 * d);
            f(k);
            var L = new Array(512);
            f(L);
            var n = new Array(256);
            f(n);
            var B = new Array(E);
            f(B);
            var et,
              W,
              rt,
              X = new Array(d);
            function tt(p, C, P, N, A) {
              (this.static_tree = p),
                (this.extra_bits = C),
                (this.extra_base = P),
                (this.elems = N),
                (this.max_length = A),
                (this.has_stree = p && p.length);
            }
            function z(p, C) {
              (this.dyn_tree = p), (this.max_code = 0), (this.stat_desc = C);
            }
            function O(p) {
              return p < 256 ? L[p] : L[256 + (p >>> 7)];
            }
            function J(p, C) {
              (p.pending_buf[p.pending++] = 255 & C),
                (p.pending_buf[p.pending++] = (C >>> 8) & 255);
            }
            function V(p, C, P) {
              p.bi_valid > u - P
                ? ((p.bi_buf |= (C << p.bi_valid) & 65535),
                  J(p, p.bi_buf),
                  (p.bi_buf = C >> (u - p.bi_valid)),
                  (p.bi_valid += P - u))
                : ((p.bi_buf |= (C << p.bi_valid) & 65535), (p.bi_valid += P));
            }
            function q(p, C, P) {
              V(p, P[2 * C], P[2 * C + 1]);
            }
            function ot(p, C) {
              for (var P = 0; (P |= 1 & p), (p >>>= 1), (P <<= 1), 0 < --C; );
              return P >>> 1;
            }
            function ct(p, C, P) {
              var N,
                A,
                Y = new Array(m + 1),
                G = 0;
              for (N = 1; N <= m; N++) Y[N] = G = (G + P[N - 1]) << 1;
              for (A = 0; A <= C; A++) {
                var Z = p[2 * A + 1];
                Z !== 0 && (p[2 * A] = ot(Y[Z]++, Z));
              }
            }
            function it(p) {
              var C;
              for (C = 0; C < w; C++) p.dyn_ltree[2 * C] = 0;
              for (C = 0; C < d; C++) p.dyn_dtree[2 * C] = 0;
              for (C = 0; C < _; C++) p.bl_tree[2 * C] = 0;
              (p.dyn_ltree[2 * x] = 1),
                (p.opt_len = p.static_len = 0),
                (p.last_lit = p.matches = 0);
            }
            function st(p) {
              8 < p.bi_valid
                ? J(p, p.bi_buf)
                : 0 < p.bi_valid && (p.pending_buf[p.pending++] = p.bi_buf),
                (p.bi_buf = 0),
                (p.bi_valid = 0);
            }
            function ut(p, C, P, N) {
              var A = 2 * C,
                Y = 2 * P;
              return p[A] < p[Y] || (p[A] === p[Y] && N[C] <= N[P]);
            }
            function ht(p, C, P) {
              for (
                var N = p.heap[P], A = P << 1;
                A <= p.heap_len &&
                (A < p.heap_len &&
                  ut(C, p.heap[A + 1], p.heap[A], p.depth) &&
                  A++,
                !ut(C, N, p.heap[A], p.depth));

              )
                (p.heap[P] = p.heap[A]), (P = A), (A <<= 1);
              p.heap[P] = N;
            }
            function gt(p, C, P) {
              var N,
                A,
                Y,
                G,
                Z = 0;
              if (p.last_lit !== 0)
                for (
                  ;
                  (N =
                    (p.pending_buf[p.d_buf + 2 * Z] << 8) |
                    p.pending_buf[p.d_buf + 2 * Z + 1]),
                    (A = p.pending_buf[p.l_buf + Z]),
                    Z++,
                    N === 0
                      ? q(p, A, C)
                      : (q(p, (Y = n[A]) + y + 1, C),
                        (G = F[Y]) !== 0 && V(p, (A -= B[Y]), G),
                        q(p, (Y = O(--N)), P),
                        (G = j[Y]) !== 0 && V(p, (N -= X[Y]), G)),
                    Z < p.last_lit;

                );
              q(p, x, C);
            }
            function ft(p, C) {
              var P,
                N,
                A,
                Y = C.dyn_tree,
                G = C.stat_desc.static_tree,
                Z = C.stat_desc.has_stree,
                K = C.stat_desc.elems,
                at = -1;
              for (p.heap_len = 0, p.heap_max = l, P = 0; P < K; P++)
                Y[2 * P] !== 0
                  ? ((p.heap[++p.heap_len] = at = P), (p.depth[P] = 0))
                  : (Y[2 * P + 1] = 0);
              for (; p.heap_len < 2; )
                (Y[2 * (A = p.heap[++p.heap_len] = at < 2 ? ++at : 0)] = 1),
                  (p.depth[A] = 0),
                  p.opt_len--,
                  Z && (p.static_len -= G[2 * A + 1]);
              for (C.max_code = at, P = p.heap_len >> 1; 1 <= P; P--)
                ht(p, Y, P);
              for (
                A = K;
                (P = p.heap[1]),
                  (p.heap[1] = p.heap[p.heap_len--]),
                  ht(p, Y, 1),
                  (N = p.heap[1]),
                  (p.heap[--p.heap_max] = P),
                  (p.heap[--p.heap_max] = N),
                  (Y[2 * A] = Y[2 * P] + Y[2 * N]),
                  (p.depth[A] =
                    (p.depth[P] >= p.depth[N] ? p.depth[P] : p.depth[N]) + 1),
                  (Y[2 * P + 1] = Y[2 * N + 1] = A),
                  (p.heap[1] = A++),
                  ht(p, Y, 1),
                  2 <= p.heap_len;

              );
              (p.heap[--p.heap_max] = p.heap[1]),
                (function (nt, dt) {
                  var kt,
                    bt,
                    Et,
                    lt,
                    Tt,
                    Ft,
                    yt = dt.dyn_tree,
                    Rt = dt.max_code,
                    Xt = dt.stat_desc.static_tree,
                    Yt = dt.stat_desc.has_stree,
                    Zt = dt.stat_desc.extra_bits,
                    Dt = dt.stat_desc.extra_base,
                    Ct = dt.stat_desc.max_length,
                    At = 0;
                  for (lt = 0; lt <= m; lt++) nt.bl_count[lt] = 0;
                  for (
                    yt[2 * nt.heap[nt.heap_max] + 1] = 0, kt = nt.heap_max + 1;
                    kt < l;
                    kt++
                  )
                    Ct <
                      (lt = yt[2 * yt[2 * (bt = nt.heap[kt]) + 1] + 1] + 1) &&
                      ((lt = Ct), At++),
                      (yt[2 * bt + 1] = lt),
                      Rt < bt ||
                        (nt.bl_count[lt]++,
                        (Tt = 0),
                        Dt <= bt && (Tt = Zt[bt - Dt]),
                        (Ft = yt[2 * bt]),
                        (nt.opt_len += Ft * (lt + Tt)),
                        Yt && (nt.static_len += Ft * (Xt[2 * bt + 1] + Tt)));
                  if (At !== 0) {
                    do {
                      for (lt = Ct - 1; nt.bl_count[lt] === 0; ) lt--;
                      nt.bl_count[lt]--,
                        (nt.bl_count[lt + 1] += 2),
                        nt.bl_count[Ct]--,
                        (At -= 2);
                    } while (0 < At);
                    for (lt = Ct; lt !== 0; lt--)
                      for (bt = nt.bl_count[lt]; bt !== 0; )
                        Rt < (Et = nt.heap[--kt]) ||
                          (yt[2 * Et + 1] !== lt &&
                            ((nt.opt_len += (lt - yt[2 * Et + 1]) * yt[2 * Et]),
                            (yt[2 * Et + 1] = lt)),
                          bt--);
                  }
                })(p, C),
                ct(Y, at, p.bl_count);
            }
            function r(p, C, P) {
              var N,
                A,
                Y = -1,
                G = C[1],
                Z = 0,
                K = 7,
                at = 4;
              for (
                G === 0 && ((K = 138), (at = 3)),
                  C[2 * (P + 1) + 1] = 65535,
                  N = 0;
                N <= P;
                N++
              )
                (A = G),
                  (G = C[2 * (N + 1) + 1]),
                  (++Z < K && A === G) ||
                    (Z < at
                      ? (p.bl_tree[2 * A] += Z)
                      : A !== 0
                      ? (A !== Y && p.bl_tree[2 * A]++, p.bl_tree[2 * T]++)
                      : Z <= 10
                      ? p.bl_tree[2 * S]++
                      : p.bl_tree[2 * R]++,
                    (Y = A),
                    (at =
                      (Z = 0) === G
                        ? ((K = 138), 3)
                        : A === G
                        ? ((K = 6), 3)
                        : ((K = 7), 4)));
            }
            function D(p, C, P) {
              var N,
                A,
                Y = -1,
                G = C[1],
                Z = 0,
                K = 7,
                at = 4;
              for (G === 0 && ((K = 138), (at = 3)), N = 0; N <= P; N++)
                if (
                  ((A = G), (G = C[2 * (N + 1) + 1]), !(++Z < K && A === G))
                ) {
                  if (Z < at) for (; q(p, A, p.bl_tree), --Z != 0; );
                  else
                    A !== 0
                      ? (A !== Y && (q(p, A, p.bl_tree), Z--),
                        q(p, T, p.bl_tree),
                        V(p, Z - 3, 2))
                      : Z <= 10
                      ? (q(p, S, p.bl_tree), V(p, Z - 3, 3))
                      : (q(p, R, p.bl_tree), V(p, Z - 11, 7));
                  (Y = A),
                    (at =
                      (Z = 0) === G
                        ? ((K = 138), 3)
                        : A === G
                        ? ((K = 6), 3)
                        : ((K = 7), 4));
                }
            }
            f(X);
            var M = !1;
            function g(p, C, P, N) {
              V(p, (v << 1) + (N ? 1 : 0), 3),
                (function (A, Y, G, Z) {
                  st(A),
                    Z && (J(A, G), J(A, ~G)),
                    i.arraySet(A.pending_buf, A.window, Y, G, A.pending),
                    (A.pending += G);
                })(p, C, P, !0);
            }
            (h._tr_init = function (p) {
              M ||
                ((function () {
                  var C,
                    P,
                    N,
                    A,
                    Y,
                    G = new Array(m + 1);
                  for (A = N = 0; A < E - 1; A++)
                    for (B[A] = N, C = 0; C < 1 << F[A]; C++) n[N++] = A;
                  for (n[N - 1] = A, A = Y = 0; A < 16; A++)
                    for (X[A] = Y, C = 0; C < 1 << j[A]; C++) L[Y++] = A;
                  for (Y >>= 7; A < d; A++)
                    for (X[A] = Y << 7, C = 0; C < 1 << (j[A] - 7); C++)
                      L[256 + Y++] = A;
                  for (P = 0; P <= m; P++) G[P] = 0;
                  for (C = 0; C <= 143; ) (Q[2 * C + 1] = 8), C++, G[8]++;
                  for (; C <= 255; ) (Q[2 * C + 1] = 9), C++, G[9]++;
                  for (; C <= 279; ) (Q[2 * C + 1] = 7), C++, G[7]++;
                  for (; C <= 287; ) (Q[2 * C + 1] = 8), C++, G[8]++;
                  for (ct(Q, w + 1, G), C = 0; C < d; C++)
                    (k[2 * C + 1] = 5), (k[2 * C] = ot(C, 5));
                  (et = new tt(Q, F, y + 1, w, m)),
                    (W = new tt(k, j, 0, d, m)),
                    (rt = new tt(new Array(0), I, 0, _, b));
                })(),
                (M = !0)),
                (p.l_desc = new z(p.dyn_ltree, et)),
                (p.d_desc = new z(p.dyn_dtree, W)),
                (p.bl_desc = new z(p.bl_tree, rt)),
                (p.bi_buf = 0),
                (p.bi_valid = 0),
                it(p);
            }),
              (h._tr_stored_block = g),
              (h._tr_flush_block = function (p, C, P, N) {
                var A,
                  Y,
                  G = 0;
                0 < p.level
                  ? (p.strm.data_type === 2 &&
                      (p.strm.data_type = (function (Z) {
                        var K,
                          at = 4093624447;
                        for (K = 0; K <= 31; K++, at >>>= 1)
                          if (1 & at && Z.dyn_ltree[2 * K] !== 0) return o;
                        if (
                          Z.dyn_ltree[18] !== 0 ||
                          Z.dyn_ltree[20] !== 0 ||
                          Z.dyn_ltree[26] !== 0
                        )
                          return s;
                        for (K = 32; K < y; K++)
                          if (Z.dyn_ltree[2 * K] !== 0) return s;
                        return o;
                      })(p)),
                    ft(p, p.l_desc),
                    ft(p, p.d_desc),
                    (G = (function (Z) {
                      var K;
                      for (
                        r(Z, Z.dyn_ltree, Z.l_desc.max_code),
                          r(Z, Z.dyn_dtree, Z.d_desc.max_code),
                          ft(Z, Z.bl_desc),
                          K = _ - 1;
                        3 <= K && Z.bl_tree[2 * H[K] + 1] === 0;
                        K--
                      );
                      return (Z.opt_len += 3 * (K + 1) + 5 + 5 + 4), K;
                    })(p)),
                    (A = (p.opt_len + 3 + 7) >>> 3),
                    (Y = (p.static_len + 3 + 7) >>> 3) <= A && (A = Y))
                  : (A = Y = P + 5),
                  P + 4 <= A && C !== -1
                    ? g(p, C, P, N)
                    : p.strategy === 4 || Y === A
                    ? (V(p, 2 + (N ? 1 : 0), 3), gt(p, Q, k))
                    : (V(p, 4 + (N ? 1 : 0), 3),
                      (function (Z, K, at, nt) {
                        var dt;
                        for (
                          V(Z, K - 257, 5),
                            V(Z, at - 1, 5),
                            V(Z, nt - 4, 4),
                            dt = 0;
                          dt < nt;
                          dt++
                        )
                          V(Z, Z.bl_tree[2 * H[dt] + 1], 3);
                        D(Z, Z.dyn_ltree, K - 1), D(Z, Z.dyn_dtree, at - 1);
                      })(
                        p,
                        p.l_desc.max_code + 1,
                        p.d_desc.max_code + 1,
                        G + 1
                      ),
                      gt(p, p.dyn_ltree, p.dyn_dtree)),
                  it(p),
                  N && st(p);
              }),
              (h._tr_tally = function (p, C, P) {
                return (
                  (p.pending_buf[p.d_buf + 2 * p.last_lit] = (C >>> 8) & 255),
                  (p.pending_buf[p.d_buf + 2 * p.last_lit + 1] = 255 & C),
                  (p.pending_buf[p.l_buf + p.last_lit] = 255 & P),
                  p.last_lit++,
                  C === 0
                    ? p.dyn_ltree[2 * P]++
                    : (p.matches++,
                      C--,
                      p.dyn_ltree[2 * (n[P] + y + 1)]++,
                      p.dyn_dtree[2 * O(C)]++),
                  p.last_lit === p.lit_bufsize - 1
                );
              }),
              (h._tr_align = function (p) {
                V(p, 2, 3),
                  q(p, x, Q),
                  (function (C) {
                    C.bi_valid === 16
                      ? (J(C, C.bi_buf), (C.bi_buf = 0), (C.bi_valid = 0))
                      : 8 <= C.bi_valid &&
                        ((C.pending_buf[C.pending++] = 255 & C.bi_buf),
                        (C.bi_buf >>= 8),
                        (C.bi_valid -= 8));
                  })(p);
              });
          },
          { "../utils/common": 41 },
        ],
        53: [
          function (e, a, h) {
            a.exports = function () {
              (this.input = null),
                (this.next_in = 0),
                (this.avail_in = 0),
                (this.total_in = 0),
                (this.output = null),
                (this.next_out = 0),
                (this.avail_out = 0),
                (this.total_out = 0),
                (this.msg = ""),
                (this.state = null),
                (this.data_type = 2),
                (this.adler = 0);
            };
          },
          {},
        ],
        54: [
          function (e, a, h) {
            (function (i) {
              (function (o, s) {
                if (!o.setImmediate) {
                  var f,
                    v,
                    E,
                    y,
                    w = 1,
                    d = {},
                    _ = !1,
                    l = o.document,
                    m = Object.getPrototypeOf && Object.getPrototypeOf(o);
                  (m = m && m.setTimeout ? m : o),
                    (f =
                      {}.toString.call(o.process) === "[object process]"
                        ? function (T) {
                            process.nextTick(function () {
                              b(T);
                            });
                          }
                        : (function () {
                            if (o.postMessage && !o.importScripts) {
                              var T = !0,
                                S = o.onmessage;
                              return (
                                (o.onmessage = function () {
                                  T = !1;
                                }),
                                o.postMessage("", "*"),
                                (o.onmessage = S),
                                T
                              );
                            }
                          })()
                        ? ((y = "setImmediate$" + Math.random() + "$"),
                          o.addEventListener
                            ? o.addEventListener("message", x, !1)
                            : o.attachEvent("onmessage", x),
                          function (T) {
                            o.postMessage(y + T, "*");
                          })
                        : o.MessageChannel
                        ? (((E = new MessageChannel()).port1.onmessage =
                            function (T) {
                              b(T.data);
                            }),
                          function (T) {
                            E.port2.postMessage(T);
                          })
                        : l && "onreadystatechange" in l.createElement("script")
                        ? ((v = l.documentElement),
                          function (T) {
                            var S = l.createElement("script");
                            (S.onreadystatechange = function () {
                              b(T),
                                (S.onreadystatechange = null),
                                v.removeChild(S),
                                (S = null);
                            }),
                              v.appendChild(S);
                          })
                        : function (T) {
                            setTimeout(b, 0, T);
                          }),
                    (m.setImmediate = function (T) {
                      typeof T != "function" && (T = new Function("" + T));
                      for (
                        var S = new Array(arguments.length - 1), R = 0;
                        R < S.length;
                        R++
                      )
                        S[R] = arguments[R + 1];
                      var F = { callback: T, args: S };
                      return (d[w] = F), f(w), w++;
                    }),
                    (m.clearImmediate = u);
                }
                function u(T) {
                  delete d[T];
                }
                function b(T) {
                  if (_) setTimeout(b, 0, T);
                  else {
                    var S = d[T];
                    if (S) {
                      _ = !0;
                      try {
                        (function (R) {
                          var F = R.callback,
                            j = R.args;
                          switch (j.length) {
                            case 0:
                              F();
                              break;
                            case 1:
                              F(j[0]);
                              break;
                            case 2:
                              F(j[0], j[1]);
                              break;
                            case 3:
                              F(j[0], j[1], j[2]);
                              break;
                            default:
                              F.apply(s, j);
                          }
                        })(S);
                      } finally {
                        u(T), (_ = !1);
                      }
                    }
                  }
                }
                function x(T) {
                  T.source === o &&
                    typeof T.data == "string" &&
                    T.data.indexOf(y) === 0 &&
                    b(+T.data.slice(y.length));
                }
              })(typeof self == "undefined" ? (i === void 0 ? this : i) : self);
            }).call(
              this,
              typeof Ot != "undefined"
                ? Ot
                : typeof self != "undefined"
                ? self
                : typeof window != "undefined"
                ? window
                : {}
            );
          },
          {},
        ],
      },
      {},
      [10]
    )(10);
  });
})(Wt);
var oe = Wt.exports;
const me = Gt(oe),
  he = {},
  le = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: he },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  ge = Kt(le);
export {
  Lt as D,
  St as F,
  jt as I,
  Mt as L,
  _t as M,
  It as O,
  vt as T,
  Nt as X,
  me as _,
  pe as a,
  mt as b,
  zt as c,
  pt as g,
  fe as i,
  U as o,
  ge as r,
  de as t,
};
//# sourceMappingURL=___vite-browser-external_commonjs-proxy-CFiMv3HM.js.map
