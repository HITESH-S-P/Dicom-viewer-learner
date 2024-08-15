import { a as U, c as Y } from "./_commonjsHelpers-Chg3vePA.js";
import { r as z } from "./jquery-DqLxBIFi.js";
import { r as B } from "./imaios-vendors-script-BiBqyJBa.js";
function J(p, N) {
  for (var h = 0; h < N.length; h++) {
    const d = N[h];
    if (typeof d != "string" && !Array.isArray(d)) {
      for (const g in d)
        if (g !== "default" && !(g in p)) {
          const t = Object.getOwnPropertyDescriptor(d, g);
          t &&
            Object.defineProperty(
              p,
              g,
              t.get ? t : { enumerable: !0, get: () => d[g] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(p, Symbol.toStringTag, { value: "Module" })
  );
}
var P = { exports: {} };
/*!
 * Bootstrap collapse.js v4.6.0 (https://getbootstrap.com/)
 * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */ (function (p, N) {
  (function (h, d) {
    p.exports = d(z(), B());
  })(Y, function (h, d) {
    function g(n) {
      return n && typeof n == "object" && "default" in n ? n : { default: n };
    }
    var t = g(h),
      u = g(d);
    function L(n, i) {
      for (var r = 0; r < i.length; r++) {
        var e = i[r];
        (e.enumerable = e.enumerable || !1),
          (e.configurable = !0),
          "value" in e && (e.writable = !0),
          Object.defineProperty(n, e.key, e);
      }
    }
    function x(n, i, r) {
      return i && L(n.prototype, i), r && L(n, r), n;
    }
    function S() {
      return (
        (S =
          Object.assign ||
          function (n) {
            for (var i = 1; i < arguments.length; i++) {
              var r = arguments[i];
              for (var e in r)
                Object.prototype.hasOwnProperty.call(r, e) && (n[e] = r[e]);
            }
            return n;
          }),
        S.apply(this, arguments)
      );
    }
    var m = "collapse",
      F = "4.6.0",
      c = "bs.collapse",
      E = "." + c,
      V = ".data-api",
      H = t.default.fn[m],
      O = { toggle: !0, parent: "" },
      M = { toggle: "boolean", parent: "(string|element)" },
      R = "show" + E,
      Q = "shown" + E,
      $ = "hide" + E,
      G = "hidden" + E,
      W = "click" + E + V,
      _ = "show",
      y = "collapse",
      D = "collapsing",
      I = "collapsed",
      j = "width",
      k = "height",
      K = ".show, .collapsing",
      w = '[data-toggle="collapse"]',
      A = (function () {
        function n(r, e) {
          (this._isTransitioning = !1),
            (this._element = r),
            (this._config = this._getConfig(e)),
            (this._triggerArray = [].slice.call(
              document.querySelectorAll(
                '[data-toggle="collapse"][href="#' +
                  r.id +
                  '"],' +
                  ('[data-toggle="collapse"][data-target="#' + r.id + '"]')
              )
            ));
          for (
            var a = [].slice.call(document.querySelectorAll(w)),
              l = 0,
              s = a.length;
            l < s;
            l++
          ) {
            var o = a[l],
              f = u.default.getSelectorFromElement(o),
              v = [].slice
                .call(document.querySelectorAll(f))
                .filter(function (C) {
                  return C === r;
                });
            f !== null &&
              v.length > 0 &&
              ((this._selector = f), this._triggerArray.push(o));
          }
          (this._parent = this._config.parent ? this._getParent() : null),
            this._config.parent ||
              this._addAriaAndCollapsedClass(this._element, this._triggerArray),
            this._config.toggle && this.toggle();
        }
        var i = n.prototype;
        return (
          (i.toggle = function () {
            t.default(this._element).hasClass(_) ? this.hide() : this.show();
          }),
          (i.show = function () {
            var e = this;
            if (
              !(this._isTransitioning || t.default(this._element).hasClass(_))
            ) {
              var a, l;
              if (
                (this._parent &&
                  ((a = [].slice
                    .call(this._parent.querySelectorAll(K))
                    .filter(function (T) {
                      return typeof e._config.parent == "string"
                        ? T.getAttribute("data-parent") === e._config.parent
                        : T.classList.contains(y);
                    })),
                  a.length === 0 && (a = null)),
                !(
                  a &&
                  ((l = t.default(a).not(this._selector).data(c)),
                  l && l._isTransitioning)
                ))
              ) {
                var s = t.default.Event(R);
                if (
                  (t.default(this._element).trigger(s), !s.isDefaultPrevented())
                ) {
                  a &&
                    (n._jQueryInterface.call(
                      t.default(a).not(this._selector),
                      "hide"
                    ),
                    l || t.default(a).data(c, null));
                  var o = this._getDimension();
                  t.default(this._element).removeClass(y).addClass(D),
                    (this._element.style[o] = 0),
                    this._triggerArray.length &&
                      t
                        .default(this._triggerArray)
                        .removeClass(I)
                        .attr("aria-expanded", !0),
                    this.setTransitioning(!0);
                  var f = function () {
                      t
                        .default(e._element)
                        .removeClass(D)
                        .addClass(y + " " + _),
                        (e._element.style[o] = ""),
                        e.setTransitioning(!1),
                        t.default(e._element).trigger(Q);
                    },
                    v = o[0].toUpperCase() + o.slice(1),
                    C = "scroll" + v,
                    b = u.default.getTransitionDurationFromElement(
                      this._element
                    );
                  t
                    .default(this._element)
                    .one(u.default.TRANSITION_END, f)
                    .emulateTransitionEnd(b),
                    (this._element.style[o] = this._element[C] + "px");
                }
              }
            }
          }),
          (i.hide = function () {
            var e = this;
            if (
              !(this._isTransitioning || !t.default(this._element).hasClass(_))
            ) {
              var a = t.default.Event($);
              if (
                (t.default(this._element).trigger(a), !a.isDefaultPrevented())
              ) {
                var l = this._getDimension();
                (this._element.style[l] =
                  this._element.getBoundingClientRect()[l] + "px"),
                  u.default.reflow(this._element),
                  t
                    .default(this._element)
                    .addClass(D)
                    .removeClass(y + " " + _);
                var s = this._triggerArray.length;
                if (s > 0)
                  for (var o = 0; o < s; o++) {
                    var f = this._triggerArray[o],
                      v = u.default.getSelectorFromElement(f);
                    if (v !== null) {
                      var C = t.default(
                        [].slice.call(document.querySelectorAll(v))
                      );
                      C.hasClass(_) ||
                        t.default(f).addClass(I).attr("aria-expanded", !1);
                    }
                  }
                this.setTransitioning(!0);
                var b = function () {
                  e.setTransitioning(!1),
                    t.default(e._element).removeClass(D).addClass(y).trigger(G);
                };
                this._element.style[l] = "";
                var T = u.default.getTransitionDurationFromElement(
                  this._element
                );
                t.default(this._element)
                  .one(u.default.TRANSITION_END, b)
                  .emulateTransitionEnd(T);
              }
            }
          }),
          (i.setTransitioning = function (e) {
            this._isTransitioning = e;
          }),
          (i.dispose = function () {
            t.default.removeData(this._element, c),
              (this._config = null),
              (this._parent = null),
              (this._element = null),
              (this._triggerArray = null),
              (this._isTransitioning = null);
          }),
          (i._getConfig = function (e) {
            return (
              (e = S({}, O, e)),
              (e.toggle = !!e.toggle),
              u.default.typeCheckConfig(m, e, M),
              e
            );
          }),
          (i._getDimension = function () {
            var e = t.default(this._element).hasClass(j);
            return e ? j : k;
          }),
          (i._getParent = function () {
            var e = this,
              a;
            u.default.isElement(this._config.parent)
              ? ((a = this._config.parent),
                typeof this._config.parent.jquery != "undefined" &&
                  (a = this._config.parent[0]))
              : (a = document.querySelector(this._config.parent));
            var l =
                '[data-toggle="collapse"][data-parent="' +
                this._config.parent +
                '"]',
              s = [].slice.call(a.querySelectorAll(l));
            return (
              t.default(s).each(function (o, f) {
                e._addAriaAndCollapsedClass(n._getTargetFromElement(f), [f]);
              }),
              a
            );
          }),
          (i._addAriaAndCollapsedClass = function (e, a) {
            var l = t.default(e).hasClass(_);
            a.length &&
              t.default(a).toggleClass(I, !l).attr("aria-expanded", l);
          }),
          (n._getTargetFromElement = function (e) {
            var a = u.default.getSelectorFromElement(e);
            return a ? document.querySelector(a) : null;
          }),
          (n._jQueryInterface = function (e) {
            return this.each(function () {
              var a = t.default(this),
                l = a.data(c),
                s = S({}, O, a.data(), typeof e == "object" && e ? e : {});
              if (
                (!l &&
                  s.toggle &&
                  typeof e == "string" &&
                  /show|hide/.test(e) &&
                  (s.toggle = !1),
                l || ((l = new n(this, s)), a.data(c, l)),
                typeof e == "string")
              ) {
                if (typeof l[e] == "undefined")
                  throw new TypeError('No method named "' + e + '"');
                l[e]();
              }
            });
          }),
          x(n, null, [
            {
              key: "VERSION",
              get: function () {
                return F;
              },
            },
            {
              key: "Default",
              get: function () {
                return O;
              },
            },
          ]),
          n
        );
      })();
    return (
      t.default(document).on(W, w, function (n) {
        n.currentTarget.tagName === "A" && n.preventDefault();
        var i = t.default(this),
          r = u.default.getSelectorFromElement(this),
          e = [].slice.call(document.querySelectorAll(r));
        t.default(e).each(function () {
          var a = t.default(this),
            l = a.data(c),
            s = l ? "toggle" : i.data();
          A._jQueryInterface.call(a, s);
        });
      }),
      (t.default.fn[m] = A._jQueryInterface),
      (t.default.fn[m].Constructor = A),
      (t.default.fn[m].noConflict = function () {
        return (t.default.fn[m] = H), A._jQueryInterface;
      }),
      A
    );
  });
})(P);
var q = P.exports;
const X = U(q),
  re = J({ __proto__: null, default: X }, [q]);
export { re as c };
//# sourceMappingURL=collapse-DPvAc_Aa.js.map
