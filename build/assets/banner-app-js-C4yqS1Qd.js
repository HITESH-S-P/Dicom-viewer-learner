window.addEventListener("DOMContentLoaded", function () {
  const l = document.getElementById("later-btn");
  l.onclick = function () {
    d();
  };
  function a() {
    return navigator.userAgent.toLowerCase().indexOf("android") > -1;
  }
  function s() {
    return navigator.userAgent.toLowerCase().indexOf("huawei") > -1;
  }
  function u() {
    return navigator.userAgent.toLowerCase().indexOf("xiaomi") > -1;
  }
  function p() {
    let e;
    try {
      e = window.location.pathname.split("/")[1] === "cn";
    } catch (f) {
      e = !1;
    }
    return e;
  }
  function i() {
    const e = navigator.userAgent.toLowerCase();
    return (
      (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) ||
      e.indexOf("ipad") > -1 ||
      e.indexOf("iphone") > -1 ||
      e.indexOf("ipod") > -1
    );
  }
  function d() {
    localStorage.setItem("last-seen-mobile-popup", Date.now());
    const e = document.getElementById("you-should-use-mobile-app");
    e !== null && (e.style.display = "none");
  }
  function c() {
    const e = localStorage.getItem("last-seen-mobile-popup");
    if (e !== null && Date.now() - e < 36e5) return;
    let t = "Google Play Store",
      n = window.appArray.android,
      o = document.getElementById("cta-download-app-link");
    if (a() || i()) {
      a()
        ? p() &&
          (s()
            ? window.appArray.huawei.length &&
              ((n = window.appArray.huawei), (t = "huawei"))
            : u()
            ? window.appArray.xiaomi.length &&
              ((n = window.appArray.xiaomi), (t = "xiaomi"))
            : window.appArray.apk.length &&
              ((n = window.appArray.apk), (t = "apk")))
        : i() &&
          window.appArray.apple.length &&
          ((n = window.appArray.apple), (t = "Apple Store")),
        o.setAttribute("href", n),
        o.setAttribute("data-ga4-param-target", t);
      const r = document.getElementById("you-should-use-mobile-app");
      r !== null && (r.style.display = "block");
    } else o.setAttribute("href", n), o.setAttribute("data-ga4-param-target", t);
  }
  c();
});
//# sourceMappingURL=banner-app-js-C4yqS1Qd.js.map
