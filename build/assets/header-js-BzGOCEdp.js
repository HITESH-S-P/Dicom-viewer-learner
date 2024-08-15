import { o as f } from "./imaios-global-D0pGfse-.js";
import "./sha256-C6hLnjrm.js";
import "./_commonjsHelpers-Chg3vePA.js";
f(() => {
  function l(e) {
    const t = e.id,
      r = document.querySelector(`[aria-labelledby="${t}"]`);
    e.parentElement.addEventListener("mouseenter", () => {
      setTimeout(() => {
        c(e.parentElement) && u(e, r);
      }, L());
    }),
      e.parentElement.addEventListener("mouseout", () => {
        setTimeout(() => {
          c(e.parentElement) || o(e);
        }, E);
      }),
      e.addEventListener("keyup", (i) => {
        ["enter", " ", "space"].includes(i.key) && (d(e) ? o(e) : u(e, r));
      }),
      r.addEventListener("animationend", (i) => {
        i.animationName === "dropdown-slide-up" && r.classList.remove(s);
      });
  }
  const a = "open",
    s = "closing",
    p = 500,
    m = 100,
    E = 500;
  let n = null;
  function L() {
    return n !== null ? m : p;
  }
  function d(e) {
    return n === e;
  }
  function u(e, t) {
    n !== null && e !== n && o(n),
      e.setAttribute("aria-expanded", "true"),
      t.classList.add(a),
      (n = e);
  }
  function o(e) {
    if (!d(e)) return;
    const t = document.querySelector(`[aria-labelledby="${n.id}"]`);
    e.setAttribute("aria-expanded", "false"),
      t.classList.remove(a),
      t.classList.add(s),
      (n = null);
  }
  function c(e) {
    return e.parentElement.querySelector(":hover") === e;
  }
  document.querySelectorAll(".mega-dropdown-toggle .nav-link").forEach(l);
});
//# sourceMappingURL=header-js-BzGOCEdp.js.map
