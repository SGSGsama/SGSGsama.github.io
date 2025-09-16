/**
 * Fingerprint Pro v3.12.0 - Copyright (c) FingerprintJS, Inc, 2025 (https://fingerprint.com)
 */

function setTimeOutRun(n, e) {
  return new Promise((r) => tryRunFunc(r, n, e));
}


function tryRunFunc(arg1, time, ...args) {
  const r = Date.now() + time;
  let o = 0;
  const i = () => {
    o = setTimeout(() => {
      Date.now() < r ? i() : arg1(...args);
    }, r - Date.now());
  };
  return (i(), () => clearTimeout(o));
}
function runCallbackWhenPageFocused(callback, time_latency, ...args) {
  const Document = document,
    i = "visibilitychange",
    u = () => (Document.hidden ? s() : c()),
    { start: c, stop: s } = (function (n, e, r, ...Document) {
      let i,
        u = false,
        c = n,
        s = 0;
      const a = () => {
        u ||
          i ||
          ((s = Date.now()),
            (i = tryRunFunc(() => {
              ((u = true), r(...Document));
            }, c)));
      };
      return (
        e && a(),
        {
          start: a,
          stop: () => {
            !u && i && (i(), (i = void 0), (c -= Date.now() - s));
          },
        }
      );
    })(time_latency, !Document.hidden, () => {
      (Document.removeEventListener(i, u), callback(...args));
    });
  return (
    Document.addEventListener(i, u),
    () => {
      (Document.removeEventListener(i, u), s());
    }
  );
}
function runCallbackWhenPageFocusedPromise(time, args) {
  return new Promise((r) => runCallbackWhenPageFocused(r, time, args));
}
async function o(n, t) {
  try {
    return await n();
  } catch (e) {
    return (console.error(e), t);
  }
}
function i(n, t) {
  return new Promise((e, r) => {
    let o = false;
    null == t ||
      t.then(
        () => (o = true),
        () => (o = true),
      );
    ("function" == typeof n ? i(Promise.resolve(), t).then(n) : n).then(
      (n) => {
        o || e(n);
      },
      (n) => {
        o || r(n);
      },
    );
  });
}
function addEmptyErrHandle(n) {
  return (n.then(void 0, () => { }), n);
}
async function prepareRace(aPromise, func) {
  let res, r, o;
  try {
    res = func().then(
      (n) => (r = [true, n]),
      (n) => (r = [false, n]),
    );
  } catch (u) {
    r = [false, u];
  }
  const i = aPromise.then(
    (n) => (o = [true, n]),
    (n) => (o = [false, n]),
  );
  return (
    await Promise.race([res, i]),
    () => {
      if (r) {
        if (r[0]) return r[1];
        throw r[1];
      }
      if (o) {
        if (o[0]) return o[1];
        throw o[1];
      }
      throw new Error("96375");
    }
  );
}
function s() {
  let n, t;
  const e = new Promise((e, r) => {
    ((n = e), (t = r));
  });
  return ((e.resolve = n), (e.reject = t), e);
}
function a(n) {
  return new Promise((t, e) => {
    n(t, e).then(
      () => e(new Error("Action didn't call `resolve` or `reject`")),
      e,
    );
  });
}
function isErr(n) {
  return (
    n instanceof Error || (null !== n && "object" == typeof n && "name" in n)
  );
}
function f(n, t) {
  let e = 0;
  return () => Math.random() * Math.min(t, n * Math.pow(2, e++));
}
function convertToIUint8Array(n) {
  return n instanceof ArrayBuffer
    ? new Uint8Array(n)
    : new Uint8Array(n.buffer, n.byteOffset, n.byteLength);
}
function addEventListenerWrapper(Dom, type, listener, options) {
  return (Dom.addEventListener(type, listener, options), () => Dom.removeEventListener(type, listener, options));
}
const h = "0123456789abcdef",
  p = 65535;
function indexOfArrayInString(n, arr) {
  if (0 == arr.length || arr.length > n.length) return -1;
  for (let e = 0; e < n.length; e++) {
    let r = 0;
    for (let o = 0; o < arr.length; o++) {
      if (n[e + o] !== arr[o]) {
        r = 0;
        break;
      }
      r++;
    }
    if (r == arr.length) return e;
  }
  return -1;
}
function convertToUint8Array(n) {
  const uint8arr = new Uint8Array(n.length);
  for (let e = 0; e < n.length; e++) {
    const r = n.charCodeAt(e);
    if (r > 127) return new TextEncoder().encode(n);
    uint8arr[e] = r;
  }
  return uint8arr;
}
function convertToString(n) {
  if ("function" == typeof TextDecoder) {
    const t = new TextDecoder().decode(n);
    if (t) return t;
  }
  const t = convertToIUint8Array(n);
  return decodeURIComponent(escape(String.fromCharCode.apply(null, t)));
}
function countOfNotNullObj_(Arr) {
  return Arr.reduce((n, t) => n + (t ? 1 : 0), 0);
}
function E(n, t) {
  return (n - t + 256) % 256;
}
function R(n) {
  const t = convertToIUint8Array(n),
    e = Math.ceil(t.length / p),
    r = [];
  for (let o = 0; o < e; o++) {
    const n = o * p,
      e = t.slice(n, Math.min(n + p, t.length));
    r.push(String.fromCharCode.apply(null, e));
  }
  return btoa(r.join(""));
}
function base64Encode(n) {
  const t = atob(n),
    e = t.length,
    r = new Uint8Array(e);
  for (let o = 0; o < e; o++) r[o] = t.charCodeAt(o);
  return r;
}
function I(n) {
  return R(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
let keyArr;
function getHash(str) {
  return getHash_(convertToUint8Array(str));
}
function getHash_(str) {
  const t = convertToIUint8Array(str);
  keyArr =
    keyArr ||
    (function () {
      let n;
      const t = new Uint32Array(256);
      for (let e = 0; e < 256; e++) {
        n = e;
        for (let t = 0; t < 8; t++)
          n = 1 & n ? 3988292384 ^ (n >>> 1) : n >>> 1;
        t[e] = n;
      }
      return t;
    })();
  let e = -1;
  for (let r = 0; r < t.length; r++) e = (e >>> 8) ^ keyArr[255 & (e ^ t[r])];
  return (-1 ^ e) >>> 0;
}
function C(n) {
  return void 0 === n ? void 0 : `${n}`;
}
function P(n, t) {
  if (void 0 !== n) {
    if (!Array.isArray(n))
      throw new TypeError(
        `Expected ${t} to be an array, a ${(function (n) {
          return "object" == typeof n
            ? n
              ? Object.prototype.toString.call(n)
              : "null"
            : typeof n;
        })(n)} is given`,
      );
    return n.map(String);
  }
}
function T(n) {
  const t = new Uint8Array(n.length / 2);
  for (let e = 0; e < n.length; e += 2)
    t[e / 2] = parseInt(n[e] + n[e + 1], 16);
  return t;
}
function getObjectKeys(n) {
  if (n instanceof Array) return n.map(getObjectKeys);
  if (n && "object" == typeof n) {
    const t = {};
    for (const e of Object.keys(n)) t[e] = getObjectKeys(n[e]);
    return t;
  }
  return n;
}
function sleep(n, t) {
  return new Promise((e) => setTimeout(e, n, t));
}
function hasKey_then(n) {
  return !!n && "function" == typeof n.then;
}
function j(n, t) {
  try {
    const e = n();
    hasKey_then(e)
      ? e.then(
        (n) => t(true, n),
        (n) => t(false, n),
      )
      : t(true, e);
  } catch (e) {
    t(false, e);
  }
}
async function V(stage_workers, func, e = 16) {
  const r = Array(stage_workers.length);
  let o = Date.now();
  for (let i = 0; i < stage_workers.length; ++i) {
    r[i] = func(stage_workers[i], i);
    const u = Date.now();
    u >= o + e &&
      ((o = u),
        await new Promise((n) => {
          const t = new MessageChannel();
          ((t.port1.onmessage = () => n()), t.port2.postMessage(null));
        }));
  }
  return r;
}
function justRunPromise(n) {
  return (n.then(void 0, () => { }), n);
}
function parseInt_(n) {
  return parseInt(n);
}
function StrToFloat(n) {
  return parseFloat(n);
}
function checkNaN(num, defaultValue) {
  return "number" == typeof num && isNaN(num) ? defaultValue : num;
}
function countOfNotNullObj(Arr) {
  return Arr.reduce((n, t) => n + (t ? 1 : 0), 0);
}
function H(n, t) {
  const e = n[0] >>> 16,
    r = 65535 & n[0],
    o = n[1] >>> 16,
    i = 65535 & n[1],
    u = t[0] >>> 16,
    c = 65535 & t[0],
    s = t[1] >>> 16;
  let a = 0,
    l = 0,
    f = 0,
    d = 0;
  ((d += i + (65535 & t[1])),
    (f += d >>> 16),
    (d &= 65535),
    (f += o + s),
    (l += f >>> 16),
    (f &= 65535),
    (l += r + c),
    (a += l >>> 16),
    (l &= 65535),
    (a += e + u),
    (a &= 65535),
    (n[0] = (a << 16) | l),
    (n[1] = (f << 16) | d));
}
function G(n, t) {
  const e = n[0] >>> 16,
    r = 65535 & n[0],
    o = n[1] >>> 16,
    i = 65535 & n[1],
    u = t[0] >>> 16,
    c = 65535 & t[0],
    s = t[1] >>> 16,
    a = 65535 & t[1];
  let l = 0,
    f = 0,
    d = 0,
    m = 0;
  ((m += i * a),
    (d += m >>> 16),
    (m &= 65535),
    (d += o * a),
    (f += d >>> 16),
    (d &= 65535),
    (d += i * s),
    (f += d >>> 16),
    (d &= 65535),
    (f += r * a),
    (l += f >>> 16),
    (f &= 65535),
    (f += o * s),
    (l += f >>> 16),
    (f &= 65535),
    (f += i * c),
    (l += f >>> 16),
    (f &= 65535),
    (l += e * a + r * s + o * c + i * u),
    (l &= 65535),
    (n[0] = (l << 16) | f),
    (n[1] = (d << 16) | m));
}
function U(n, t) {
  const e = n[0];
  32 === (t %= 64)
    ? ((n[0] = n[1]), (n[1] = e))
    : t < 32
      ? ((n[0] = (e << t) | (n[1] >>> (32 - t))),
        (n[1] = (n[1] << t) | (e >>> (32 - t))))
      : ((t -= 32),
        (n[0] = (n[1] << t) | (e >>> (32 - t))),
        (n[1] = (e << t) | (n[1] >>> (32 - t))));
}
function B(n, t) {
  0 !== (t %= 64) &&
    (t < 32
      ? ((n[0] = n[1] >>> (32 - t)), (n[1] = n[1] << t))
      : ((n[0] = n[1] << (t - 32)), (n[1] = 0)));
}
function $(n, t) {
  ((n[0] ^= t[0]), (n[1] ^= t[1]));
}
const Y = [4283543511, 3981806797],
  X = [3301882366, 444984403];
function J(n) {
  const t = [0, n[0] >>> 1];
  ($(n, t),
    G(n, Y),
    (t[1] = n[0] >>> 1),
    $(n, t),
    G(n, X),
    (t[1] = n[0] >>> 1),
    $(n, t));
}
const z = [2277735313, 289559509],
  q = [1291169091, 658871167],
  K = [0, 5],
  Q = [0, 1390208809],
  nn = [0, 944331445];
function tn(n) {
  return "function" != typeof n;
}
function runStageTasks(stage, context, aArray, optimize) {
  const stage_workers = Object.keys(stage).filter(
    (n) =>
      !(function (n, t) {
        for (let e = 0, r = n.length; e < r; ++e) if (n[e] === t) return true;
        return false;
      })(aArray, n),
  ),
    i = justRunPromise(
      V(
        stage_workers,
        (e) =>
          (function (worker, ContextToWorker) {
            const e = justRunPromise(
              new Promise((e) => {
                const r = Date.now();
                j(worker.bind(null, ContextToWorker), (...n) => {
                  const t = Date.now() - r;
                  if (!n[0]) return e(() => ({ error: n[1], duration: t }));
                  const o = n[1];
                  if (tn(o)) return e(() => ({ value: o, duration: t }));
                  e(
                    () =>
                      new Promise((n) => {
                        const e = Date.now();
                        j(o, (...r) => {
                          const o = t + Date.now() - e;
                          if (!r[0]) return n({ error: r[1], duration: o });
                          n({ value: r[1], duration: o });
                        });
                      }),
                  );
                });
              }),
            );
            return function () {
              return e.then((n) => n());
            };
          })(stage[e], context),
        optimize,
      ),
    );
  return async function () {
    const n = await i,
      t = await V(n, (n) => justRunPromise(n()), optimize),
      e = await Promise.all(t),
      u = {};
    for (let r = 0; r < stage_workers.length; ++r) u[stage_workers[r]] = e[r];
    return u;
  };
}
function do_a_then_pass_res_to_b(funcA, funcB) {
  const e = (n) =>
    tn(n)
      ? funcB(n)
      : () => {
        const e = n();
        return hasKey_then(e) ? e.then(funcB) : funcB(e);
      };

  return (t) => {
    const r = funcA(t);
    return hasKey_then(r) ? r.then(e) : e(r);
  };
}
function collectSomeKeys8_related_to_IE() {
  const n = window,
    t = navigator;
  return (
    countOfNotNullObj([
      "MSCSSMatrix" in n,
      "msSetImmediate" in n,
      "msIndexedDB" in n,
      "msMaxTouchPoints" in t,
      "msPointerEnabled" in t,
    ]) >= 4
  );
}
function collectSomeKeys9_related_to_Edge() {
  const n = window,
    t = navigator;
  return (
    countOfNotNullObj([
      "msWriteProfilerMark" in n,
      "MSStream" in n,
      "msLaunchUri" in t,
      "msSaveBlob" in t,
    ]) >= 3 && !collectSomeKeys8_related_to_IE()
  );
}
function collectSomeKeys10_related_to_chrome() {
  const n = window,
    t = navigator;
  return (
    countOfNotNullObj([
      "webkitPersistentStorage" in t,
      "webkitTemporaryStorage" in t,
      0 === (t.vendor || "").indexOf("Google"),
      "webkitResolveLocalFileSystemURL" in n,
      "BatteryManager" in n,
      "webkitMediaStream" in n,
      "webkitSpeechGrammar" in n,
    ]) >= 5
  );
}
function collectSomeKeys6_related_to_Apple() {
  const n = window;
  return (
    countOfNotNullObj([
      "ApplePayError" in n,
      "CSSPrimitiveValue" in n,
      "Counter" in n,
      0 === navigator.vendor.indexOf("Apple"),
      "RGBColor" in n,
      "WebKitMediaKeys" in n,
    ]) >= 4
  );
}
function collectSomeKeys7_related_to_safari() {
  const n = window,
    { HTMLElement: t, Document: e } = n;
  return (
    countOfNotNullObj([
      "safari" in n,
      !("ongestureend" in n),
      !("TouchEvent" in n),
      !("orientation" in n),
      t && !("autocapitalize" in t.prototype),
      e && "pointerLockElement" in e.prototype,
    ]) >= 4
  );
}
function collectSomeKeys1_related_to_firefox() { // 检查下下面几个元素是否至少存在4个
  var n, t;
  const windowObj = window;
  return (
    countOfNotNullObj([
      "buildID" in navigator,
      "MozAppearance" in
      (null !== // 获取<html>根元素，如果有就访问style属性
        (t =
          null === (n = document.documentElement) || void 0 === n
            ? void 0
            : n.style) && void 0 !== t
        ? t
        : {}),
      "onmozfullscreenchange" in windowObj,
      "mozInnerScreenX" in windowObj,
      "CSSMozDocumentRule" in windowObj,
      "CanvasCaptureMediaStream" in windowObj,
    ]) >= 4
  );
}
function checkHasFullScreenElement() {
  const n = document;
  return (
    n.fullscreenElement ||
    n.msFullscreenElement ||
    n.mozFullScreenElement ||
    n.webkitFullscreenElement ||
    null
  );
}
function test_mobile() {
  const is_chrome = collectSomeKeys10_related_to_chrome(),
    is_firefox = collectSomeKeys1_related_to_firefox(),
    Window = window,
    Navigator = navigator,
    connection = "connection";
  return is_chrome
    ? countOfNotNullObj([
      !("SharedWorker" in Window),
      Navigator[connection] && "ontypechange" in Navigator[connection],
      !("sinkId" in new Audio()),
    ]) >= 2
    : !!is_firefox &&
    countOfNotNullObj([
      "onorientationchange" in Window,
      "orientation" in Window,
      /android/i.test(Navigator.appVersion),
    ]) >= 2;
}
function test_new_webAPI() {
  const Navigator = navigator,
    Window = window,
    audioPrototype = Audio.prototype,
    { visualViewport: visualViewport } = Window;
  return (
    countOfNotNullObj([
      "srLatency" in audioPrototype,
      "srChannelCount" in audioPrototype,
      "devicePosture" in Navigator,
      visualViewport && "segments" in visualViewport,
      "getTextInformation" in Image.prototype,
    ]) >= 3
  );
}
function audio_data_collector() {
  const windowObj = window,
    OfflineAudioContext = windowObj.OfflineAudioContext || windowObj.webkitOfflineAudioContext;
  if (!OfflineAudioContext) return -2;
  if ( // safari
    collectSomeKeys6_related_to_Apple() &&
    !collectSomeKeys7_related_to_safari() &&
    !(function () {
      const n = window;
      return (
        countOfNotNullObj([
          "DOMRectList" in n,
          "RTCPeerConnectionIceEvent" in n,
          "SVGGeometryElement" in n,
          "ontransitioncancel" in n,
        ]) >= 3
      );
    })()
  )
    return -1;
  const testAudioData = new OfflineAudioContext(1, 5e3, 44100),
    r = testAudioData.createOscillator();
  ((r.type = "triangle"), (r.frequency.value = 1e4));
  const o = testAudioData.createDynamicsCompressor();
  ((o.threshold.value = -50),
    (o.knee.value = 40),
    (o.ratio.value = 12),
    (o.attack.value = 0),
    (o.release.value = 0.25),
    r.connect(o),
    o.connect(testAudioData.destination),
    r.start(0));
  const [i, u] = (function (testAudioData) {
    const t = 3,
      e = 500,
      r = 500,
      o = 5e3;
    let i = () => { };
    const u = new Promise((resolve, reject) => {
      let s = false,
        a = 0,
        l = 0;
      testAudioData.oncomplete = (n) => resolve(n.renderedBuffer);
      const f = () => {
        setTimeout(() => reject(throw_err("timeout")), Math.min(r, l + o - Date.now()));
      },
        d = () => {
          try {
            const r = testAudioData.startRendering();
            switch ((hasKey_then(r) && justRunPromise(r), testAudioData.state)) {
              case "running":
                ((l = Date.now()), s && f());
                break;
              case "suspended":
                (document.hidden || a++,
                  s && a >= t ? reject(throw_err("suspended")) : setTimeout(d, e));
            }
          } catch (r) {
            reject(r);
          }
        };
      (convertToIUint8Array(),
        (i = () => {
          s || ((s = true), l > 0 && f());
        }));
    });
    return [u, i];
  })(testAudioData),

    c = justRunPromise(
      i.then(
        (n) =>
          (function (n) {
            let t = 0;
            for (let e = 0; e < n.length; ++e) t += Math.abs(n[e]);
            return t;
          })(n.getChannelData(0).subarray(4500)),
        (n) => {
          if ("timeout" === n.name || "suspended" === n.name) return -3;
          throw n;
        },
      ),
    );
  return () => (u(), c);
}
function throw_err(name) {
  const t = new Error(name);
  return ((t.name = name), t);
}
async function getSandBoxAndRunFunc(func, HtmlCode, e = 50) {
  var r, o, i;
  const Document = document;
  for (; !Document.body;) await sleep(e);
  const aIframe = Document.createElement("iframe");
  try {
    for (
      await new Promise((resolve, reject) => {
        let r = false;
        const o = () => {
          ((r = true), resolve());
        };
        ((aIframe.onload = o),
          (aIframe.onerror = (n) => {
            ((r = true), reject(n));
          }));
        const { style: i } = aIframe;
        (i.setProperty("display", "block", "important"),
          (i.position = "absolute"),
          (i.top = "0"),
          (i.left = "0"),
          (i.visibility = "hidden"),
          HtmlCode && ("srcdoc" in aIframe) ? (aIframe.srcdoc = HtmlCode) : (aIframe.src = "about:blank"),
          Document.body.appendChild(aIframe));
        const s = () => {
          var n, t;
          r ||
            ("complete" ===
              (null ===
                (t =
                  null === (n = aIframe.contentWindow) || void 0 === n
                    ? void 0
                    : n.document) || void 0 === t
                ? void 0
                : t.readyState)
              ? o()
              : setTimeout(s, 10));
        };
        s();
      });
      !(null ===
        (o =
          null === (r = aIframe.contentWindow) || void 0 === r
            ? void 0
            : r.document) || void 0 === o
        ? void 0
        : o.body);

    )
      await sleep(e);
    return await func(aIframe, aIframe.contentWindow);
  } finally {
    null === (i = aIframe.parentNode) || void 0 === i || i.removeChild(aIframe);
  }
}
function CSSElementCreator(ElementKeys) {
  const [t, e] = (function (ElementKeys) {
    var t, e;
    const err = `Unexpected syntax '${ElementKeys}'`,
      o = /^\s*([a-z-]*)(.*)$/i.exec(ElementKeys),
      i = o[1] || void 0,
      u = {},
      c = /([.:#][\w-]+|\[.+?\])/gi,
      s = (n, t) => {
        ((u[n] = u[n] || []), u[n].push(t));
      };
    for (; ;) {
      const n = c.exec(o[2]);
      if (!n) break;
      const i = n[0];
      switch (i[0]) {
        case ".":
          s("class", i.slice(1));
          break;
        case "#":
          s("id", i.slice(1));
          break;
        case "[": {
          const n =
            /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(i);
          if (!n) throw new Error(err);
          s(
            n[1],
            null !== (e = null !== (t = n[4]) && void 0 !== t ? t : n[5]) &&
              void 0 !== e
              ? e
              : "",
          );
          break;
        }
        default:
          throw new Error(err);
      }
    }
    return [i, u];
  })(ElementKeys),
    r = document.createElement(null != t ? t : "div");
  for (const o of Object.keys(e)) {
    const n = e[o].join(" ");
    "style" === o ? wn(r.style, n) : r.setAttribute(o, n);
  }
  return r;
}
function wn(n, t) {
  for (const e of t.split(";")) {
    const t = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(e);
    if (t) {
      const [, e, r, , o] = t;
      n.setProperty(e, r, o || "");
    }
  }
}
function draw_canvas_test(n) {
  let t,
    e,
    r = false;
  const [canvas, canvas_2d] = (function () {
    const canvas = document.createElement("canvas");
    return ((canvas.width = 1), (canvas.height = 1), [canvas, canvas.getContext("2d")]);
  })();

  return (
    !(function (n, t) {
      return !(!t || !n.toDataURL);
    })(canvas, canvas_2d)
      ? (t = e = "unsupported")
      : ((r = (function (n) {
        return (
          n.rect(0, 0, 10, 10),
          n.rect(2, 2, 6, 6),
          !n.isPointInPath(5, 5, "evenodd")
        );
      })(canvas_2d)),
        n
          ? (t = e = "skipped")
          : ([t, e] = (function (n, t) {
            !(function (n, t) {
              ((n.width = 240),
                (n.height = 60),
                (t.textBaseline = "alphabetic"),
                (t.fillStyle = "#f60"),
                t.fillRect(100, 1, 62, 20),
                (t.fillStyle = "#069"),
                (t.font = '11pt "Times New Roman"'));
              const e = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`;
              (t.fillText(e, 2, 15),
                (t.fillStyle = "rgba(102, 204, 0, 0.2)"),
                (t.font = "18pt Arial"),
                t.fillText(e, 4, 45));
            })(n, t);
            const e = bn(n),
              r = bn(n);
            if (e !== r) return ["unstable", "unstable"];
            !(function (n, t) {
              ((n.width = 122),
                (n.height = 110),
                (t.globalCompositeOperation = "multiply"));
              for (const [e, r, o] of [
                ["#f2f", 40, 40],
                ["#2ff", 80, 40],
                ["#ff2", 60, 80],
              ])
                ((t.fillStyle = e),
                  t.beginPath(),
                  t.arc(r, o, 40, 0, 2 * Math.PI, true),
                  t.closePath(),
                  t.fill());
              ((t.fillStyle = "#f9c"),
                t.arc(60, 60, 60, 0, 2 * Math.PI, true),
                t.arc(60, 60, 20, 0, 2 * Math.PI, true),
                t.fill("evenodd"));
            })(n, t);
            const o = bn(n);
            return [o, e];
          })(canvas, canvas_2d))),
    { winding: r, geometry: t, text: e }
  );
}
function bn(n) {
  return n.toDataURL();
}
function get_H_W() {
  const screen_ = screen,
    t = (n) => checkNaN(parseInt_(n), null),
    e = [t(screen_.width), t(screen_.height)];
  return (e.sort().reverse(), e);
}
let ScreenSizeInfoCache, Sn;
function getCheckScreenSizeFunc() {
  return (
    (function () {
      if (void 0 !== Sn) return;
      const n = () => {
        const ScreenSizeInfo = getScreenSizeInfo();
        checkAllFalse(ScreenSizeInfo) ? (Sn = setTimeout(n, 2500)) : ((ScreenSizeInfoCache = ScreenSizeInfo), (Sn = void 0));
      };
      n();
    })(),
    async () => {
      let ScreenSizeInfo = getScreenSizeInfo();
      if (checkAllFalse(ScreenSizeInfo)) {
        if (ScreenSizeInfoCache) return [...ScreenSizeInfoCache];
        checkHasFullScreenElement() &&
          (await (function () {
            const documentObj = document;
            return (
              documentObj.exitFullscreen ||
              documentObj.msExitFullscreen ||
              documentObj.mozCancelFullScreen ||
              documentObj.webkitExitFullscreen
            ).call(documentObj);
          })(),
            (ScreenSizeInfo = getScreenSizeInfo()));
      }
      return (checkAllFalse(ScreenSizeInfo) || (ScreenSizeInfoCache = ScreenSizeInfo), ScreenSizeInfo);
    }
  );
}
function getScreenSizeInfo() {
  const screenObj = screen;
  return [
    checkNaN(StrToFloat(screenObj.availTop), null),
    checkNaN(StrToFloat(screenObj.width) - StrToFloat(screenObj.availWidth) - checkNaN(StrToFloat(screenObj.availLeft), 0), null),
    checkNaN(StrToFloat(screenObj.height) - StrToFloat(screenObj.availHeight) - checkNaN(StrToFloat(screenObj.availTop), 0), null),
    checkNaN(StrToFloat(screenObj.availLeft), null),
  ];
}
function checkAllFalse(arr) {
  for (let t = 0; t < 4; ++t) if (arr[t]) return false;
  return true;
}
function setCSS1(n) {
  (n.style.setProperty("visibility", "hidden", "important"),
    n.style.setProperty("display", "block", "important"));
}
function Cn(n) {
  return matchMedia(`(inverted-colors: ${n})`).matches;
}
function Pn(n) {
  return matchMedia(`(forced-colors: ${n})`).matches;
}
function Tn(n) {
  return matchMedia(`(prefers-contrast: ${n})`).matches;
}
function On(n) {
  return matchMedia(`(prefers-reduced-motion: ${n})`).matches;
}
function _n(n) {
  return matchMedia(`(prefers-reduced-transparency: ${n})`).matches;
}
function xn(n) {
  return matchMedia(`(dynamic-range: ${n})`).matches;
}
const Nn = Math,
  jn = () => 0;
const testStr = "mmMwWLliI0fiflO&1",
  fontTest = {
    default: [],
    apple: [{ font: "-apple-system-body" }],
    serif: [{ fontFamily: "serif" }],
    sans: [{ fontFamily: "sans-serif" }],
    mono: [{ fontFamily: "monospace" }],
    min: [{ fontSize: "1px" }],
    system: [{ fontFamily: "system-ui" }],
  };
const webgl_const = /*#__PURE__*/ new Set([
  10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961,
  2962, 2963, 2964, 2965, 2966, 2967, 2968, 2978, 3024, 3042, 3088, 3089,
  3106, 3107, 32773, 32777, 32777, 32823, 32824, 32936, 32937, 32938, 32939,
  32968, 32969, 32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901, 33902,
  34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414, 3415, 34467, 34816,
  34817, 34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739,
  36003, 36004, 36005, 36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937,
  7938,
]),
  webgl_Extension_Const = /*#__PURE__*/ new Set([
    34047, 35723, 36063, 34852, 34853, 34854, 34229, 36392, 36795, 38449,
  ]),
  Dn = ["FRAGMENT_SHADER", "VERTEX_SHADER"],
  Zn = [
    "LOW_FLOAT",
    "MEDIUM_FLOAT",
    "HIGH_FLOAT",
    "LOW_INT",
    "MEDIUM_INT",
    "HIGH_INT",
  ],
  WEBGL_debug_renderer_info__ = "WEBGL_debug_renderer_info";
function get_webgl_context(cache) {
  if (cache.webgl) return cache.webgl.context;
  const test_canvas = document.createElement("canvas");
  let e;
  test_canvas.addEventListener("webglCreateContextError", () => (e = void 0));
  for (const o of ["webgl", "experimental-webgl"]) {
    try {
      e = test_canvas.getContext(o);
    } catch (r) { }
    if (e) break;
  }
  return ((cache.webgl = { context: e }), e);
}
function Un(n, t, e) {
  const r = n.getShaderPrecisionFormat(n[t], n[e]);
  return r ? [r.rangeMin, r.rangeMax, r.precision] : [];
}
function str_filter_only_A_Z_0_9_x_str(n) {
  return Object.keys(n.__proto__).filter(only_A_Z_0_9_x_str);
}
function only_A_Z_0_9_x_str(n) {
  return "string" == typeof n && !n.match(/[^A-Z0-9_x]/);
}
function collectSomeKeys1_related_to_firefox__() {
  return collectSomeKeys1_related_to_firefox();
}
function check_getParameter(n) {
  return "function" == typeof n.getParameter;
}
const AdBlocker_test_worker = async function ({ debug: context } = {}) {
  if (!collectSomeKeys6_related_to_Apple() && !test_mobile()) return;
  const someElementKeyList = (function () {
    const base64_decode = atob;
    return {
      abpIndo: [
        "#Iklan-Melayang",
        "#Kolom-Iklan-728",
        "#SidebarIklan-wrapper",
        '[title="ALIENBOLA" i]',
        base64_decode("I0JveC1CYW5uZXItYWRz"), // #Box-Banner-ads
      ],
      abpvn: [
        ".quangcao",
        "#mobileCatfish",
        base64_decode("LmNsb3NlLWFkcw=="),
        '[id^="bn_bottom_fixed_"]',
        "#pmadv",
      ],
      adBlockFinland: [
        ".mainostila",
        base64_decode("LnNwb25zb3JpdA=="),
        ".ylamainos",
        base64_decode("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"),
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd"),
      ],
      adBlockPersian: [
        "#navbar_notice_50",
        ".kadr",
        'TABLE[width="140px"]',
        "#divAgahi",
        base64_decode("YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd"),
      ],
      adBlockWarningRemoval: [
        "#adblock-honeypot",
        ".adblocker-root",
        ".wp_adblock_detect",
        base64_decode("LmhlYWRlci1ibG9ja2VkLWFk"),
        base64_decode("I2FkX2Jsb2NrZXI="),
      ],
      adGuardAnnoyances: [
        ".hs-sosyal",
        "#cookieconsentdiv",
        'div[class^="app_gdpr"]',
        ".as-oil",
        '[data-cypress="soft-push-notification-modal"]',
      ],
      adGuardBase: [
        ".BetterJsPopOverlay",
        base64_decode("I2FkXzMwMFgyNTA="),
        base64_decode("I2Jhbm5lcmZsb2F0MjI="),
        base64_decode("I2NhbXBhaWduLWJhbm5lcg=="),
        base64_decode("I0FkLUNvbnRlbnQ="),
      ],
      adGuardChinese: [
        base64_decode("LlppX2FkX2FfSA=="),
        base64_decode("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"),
        "#widget-quan",
        base64_decode("YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd"),
        base64_decode("YVtocmVmKj0iLjE5NTZobC5jb20vIl0="),
      ],
      adGuardFrench: [
        "#pavePub",
        base64_decode("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"),
        ".mobile_adhesion",
        ".widgetadv",
        base64_decode("LmFkc19iYW4="),
      ],
      adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
      adGuardJapanese: [
        "#kauli_yad_1",
        base64_decode("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="),
        base64_decode("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="),
        base64_decode("LmFkZ29vZ2xl"),
        base64_decode("Ll9faXNib29zdFJldHVybkFk"),
      ],
      adGuardMobile: [
        base64_decode("YW1wLWF1dG8tYWRz"),
        base64_decode("LmFtcF9hZA=="),
        'amp-embed[type="24smi"]',
        "#mgid_iframe1",
        base64_decode("I2FkX2ludmlld19hcmVh"),
      ],
      adGuardRussian: [
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="),
        base64_decode("LnJlY2xhbWE="),
        'div[id^="smi2adblock"]',
        base64_decode("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"),
        "#psyduckpockeball",
      ],
      adGuardSocial: [
        base64_decode("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="),
        base64_decode("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="),
        ".etsy-tweet",
        "#inlineShare",
        ".popup-social",
      ],
      adGuardSpanishPortuguese: [
        "#barraPublicidade",
        "#Publicidade",
        "#publiEspecial",
        "#queTooltip",
        ".cnt-publi",
      ],
      adGuardTrackingProtection: [
        "#qoo-counter",
        base64_decode("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="),
        base64_decode("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="),
        base64_decode("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="),
        "#top100counter",
      ],
      adGuardTurkish: [
        "#backkapat",
        base64_decode("I3Jla2xhbWk="),
        base64_decode("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="),
        base64_decode("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"),
        base64_decode("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=="),
      ],
      bulgarian: [
        base64_decode("dGQjZnJlZW5ldF90YWJsZV9hZHM="),
        "#ea_intext_div",
        ".lapni-pop-over",
        "#xenium_hot_offers",
      ],
      easyList: [
        ".yb-floorad",
        base64_decode("LndpZGdldF9wb19hZHNfd2lkZ2V0"),
        base64_decode("LnRyYWZmaWNqdW5reS1hZA=="),
        ".textad_headline",
        base64_decode("LnNwb25zb3JlZC10ZXh0LWxpbmtz"),
      ],
      easyListChina: [
        base64_decode("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="), // .appguide-wrap[onclick*="bcebos.com"]
        base64_decode("LmZyb250cGFnZUFkdk0="),
        "#taotaole",
        "#aafoot.top_box",
        ".cfa_popup",
      ],
      easyListCookie: [
        ".ezmob-footer",
        ".cc-CookieWarning",
        "[data-cookie-number]",
        base64_decode("LmF3LWNvb2tpZS1iYW5uZXI="),
        ".sygnal24-gdpr-modal-wrap",
      ],
      easyListCzechSlovak: [
        "#onlajny-stickers",
        base64_decode("I3Jla2xhbW5pLWJveA=="),
        base64_decode("LnJla2xhbWEtbWVnYWJvYXJk"),
        ".sklik",
        base64_decode("W2lkXj0ic2tsaWtSZWtsYW1hIl0="),
      ],
      easyListDutch: [
        base64_decode("I2FkdmVydGVudGll"),
        base64_decode("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="),
        ".adstekst",
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="),
        "#semilo-lrectangle",
      ],
      easyListGermany: [
        "#SSpotIMPopSlider",
        base64_decode("LnNwb25zb3JsaW5rZ3J1ZW4="),
        base64_decode("I3dlcmJ1bmdza3k="),
        base64_decode("I3Jla2xhbWUtcmVjaHRzLW1pdHRl"),
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0="),
      ],
      easyListItaly: [
        base64_decode("LmJveF9hZHZfYW5udW5jaQ=="),
        ".sb-box-pubbliredazionale",
        base64_decode("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"),
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"),
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=="),
      ],
      easyListLithuania: [
        base64_decode("LnJla2xhbW9zX3RhcnBhcw=="),
        base64_decode("LnJla2xhbW9zX251b3JvZG9z"),
        base64_decode("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"),
        base64_decode("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"),
        base64_decode("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd"),
      ],
      estonian: [base64_decode("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],
      fanboyAnnoyances: [
        "#ac-lre-player",
        ".navigate-to-top",
        "#subscribe_popup",
        ".newsletter_holder",
        "#back-top",
      ],
      fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
      fanboyEnhancedTrackers: [
        ".open.pushModal",
        "#issuem-leaky-paywall-articles-zero-remaining-nag",
        "#sovrn_container",
        'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
        ".BlockNag__Card",
      ],
      fanboySocial: [
        "#FollowUs",
        "#meteored_share",
        "#social_follow",
        ".article-sharer",
        ".community__social-desc",
      ],
      frellwitSwedish: [
        base64_decode("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="),
        base64_decode("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="),
        "article.category-samarbete",
        base64_decode("ZGl2LmhvbGlkQWRz"),
        "ul.adsmodern",
      ],
      greekAdBlock: [
        base64_decode("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"),
        base64_decode("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="),
        base64_decode(
          "QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd",
        ),
        "DIV.agores300",
        "TABLE.advright",
      ],
      hungarian: [
        "#cemp_doboz",
        ".optimonk-iframe-container",
        base64_decode("LmFkX19tYWlu"),
        base64_decode("W2NsYXNzKj0iR29vZ2xlQWRzIl0="),
        "#hirdetesek_box",
      ],
      iDontCareAboutCookies: [
        '.alert-info[data-block-track*="CookieNotice"]',
        ".ModuleTemplateCookieIndicator",
        ".o--cookies--container",
        "#cookies-policy-sticky",
        "#stickyCookieBar",
      ],
      icelandicAbp: [
        base64_decode(
          "QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==",
        ),
      ],
      latvian: [
        base64_decode(
          "YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0=",
        ),
        base64_decode(
          "YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==",
        ),
      ],
      listKr: [
        base64_decode("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="),
        base64_decode("I2xpdmVyZUFkV3JhcHBlcg=="),
        base64_decode("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="),
        base64_decode("aW5zLmZhc3R2aWV3LWFk"),
        ".revenue_unit_item.dable",
      ],
      listeAr: [
        base64_decode("LmdlbWluaUxCMUFk"),
        ".right-and-left-sponsers",
        base64_decode("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="),
        base64_decode("YVtocmVmKj0iYm9vcmFxLm9yZyJd"),
        base64_decode("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd"),
      ],
      listeFr: [
        base64_decode("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="),
        base64_decode("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="),
        base64_decode("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="),
        ".site-pub-interstitiel",
        'div[id^="crt-"][data-criteo-id]',
      ],
      officialPolish: [
        "#ceneo-placeholder-ceneo-12",
        base64_decode("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"),
        base64_decode(
          "YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ==",
        ),
        base64_decode("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="),
        base64_decode("ZGl2I3NrYXBpZWNfYWQ="),
      ],
      ro: [
        base64_decode("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"),
        base64_decode(
          "YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd",
        ),
        base64_decode(
          "YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0=",
        ),
        base64_decode("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd"),
        'a[href^="/url/"]',
      ],
      ruAd: [
        base64_decode("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"),
        base64_decode("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="),
        base64_decode("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="),
        "#pgeldiz",
        ".yandex-rtb-block",
      ],
      thaiAds: [
        "a[href*=macau-uta-popup]",
        base64_decode("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="),
        base64_decode("LmFkczMwMHM="),
        ".bumq",
        ".img-kosana",
      ],
      webAnnoyancesUltralist: [
        "#mod-social-share-2",
        "#social-tools",
        base64_decode("LmN0cGwtZnVsbGJhbm5lcg=="),
        ".zergnet-recommend",
        ".yt.btn-link.btn-md.btn",
      ],
    };
  })(),
    someElementKeyName = Object.keys(someElementKeyList),
    allKeys = [].concat(...someElementKeyName.map((n) => someElementKeyList[n])),
    o = await (async function (allKeys) {
      var t;
      const documentObj = document,
        testDiv = documentObj.createElement("div"),
        o = new Array(allKeys.length),
        i = {};
      setCSS1(testDiv);
      for (let u = 0; u < allKeys.length; ++u) {
        const testCSS_Element = CSSElementCreator(allKeys[u]);
        "DIALOG" === testCSS_Element.tagName && testCSS_Element.show();
        const i = documentObj.createElement("div");
        (setCSS1(i), i.appendChild(testCSS_Element), testDiv.appendChild(i), (o[u] = testCSS_Element));
      }
      for (; !documentObj.body;) await sleep(50);
      documentObj.body.appendChild(testDiv);
      try {
        for (let t = 0; t < allKeys.length; ++t)
          o[t].offsetParent || (i[allKeys[t]] = true);
      } finally {
        null === (t = testDiv.parentNode) || void 0 === t || t.removeChild(testDiv);
      }
      return i;
    })(allKeys);
  context &&
    (function (n, t) {
      let e = "DOM blockers debug:\n```";
      for (const r of Object.keys(n)) {
        e += `\n${r}:`;
        for (const o of n[r]) e += `\n  ${t[o] ? "🚫" : "➡️"} ${o}`;
      }
      console.log(`${e}\n\`\`\``);
    })(someElementKeyList, o);
  const i = someElementKeyName.filter((n) => {
    const e = someElementKeyList[n];
    return countOfNotNullObj(e.map((n) => o[n])) > 0.6 * e.length;
  });
  return (i.sort(), i);
},
  fontWidthTest = function () {
    return (function (func, width = 4e3) {
      return getSandBoxAndRunFunc((e, iframe) => {
        const document = iframe.document,
          body = document.body,
          style = body.style;
        ((style.width = `${width}px`),
          (style.webkitTextSizeAdjust = style.textSizeAdjust = "none"),
          collectSomeKeys10_related_to_chrome()
            ? (body.style.zoom = "" + 1 / iframe.devicePixelRatio)
            : collectSomeKeys6_related_to_Apple() && (body.style.zoom = "reset"));
        const c = document.createElement("div");
        return (
          (c.textContent = [...Array((width / 20) << 0)]
            .map(() => "word")
            .join(" ")),
          body.appendChild(c),
          func(document, body)
        );
      }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
    })((document, body) => {
      const e = {},
        widths = {};
      for (const fontTestCases of Object.keys(fontTest)) {
        const [r = {}, i = testStr] = fontTest[fontTestCases],
          testSpan = document.createElement("span");
        ((testSpan.textContent = i), (testSpan.style.whiteSpace = "nowrap"));
        for (const n of Object.keys(r)) {
          const t = r[n];
          void 0 !== t && (testSpan.style[n] = t);
        }
        ((e[fontTestCases] = testSpan), body.append(document.createElement("br"), testSpan));
      }
      for (const o of Object.keys(fontTest))
        widths[o] = e[o].getBoundingClientRect().width;
      return widths;
    });
  }
  ,
  get_oscpu = function () {
    return navigator.oscpu;
  },
  get_language = function () {
    const navigator_ = navigator,
      t = [],
      language = navigator_.language || navigator_.userLanguage || navigator_.browserLanguage || navigator_.systemLanguage;
    if ((void 0 !== language && t.push([language]), Array.isArray(navigator_.languages)))
      (collectSomeKeys10_related_to_chrome() &&
        (function () {  // modern chrome
          const Window = window;
          return (
            countOfNotNullObj([
              !("MediaSettingsRange" in Window),
              "RTCEncodedAudioFrame" in Window,
              "" + Window.Intl == "[object Intl]",
              "" + Window.Reflect == "[object Reflect]",
            ]) >= 3
          );
        })()) ||
        t.push(navigator_.languages);
    else if ("string" == typeof navigator_.languages) {
      const e = navigator_.languages;
      e && t.push(e.split(","));
    }
    return t;
  },
  colorDepth = function () {
    return window.screen.colorDepth;
  },
  deviceMemory = function () {
    return checkNaN(StrToFloat(navigator.deviceMemory), void 0);
  },
  hardwareConcurrency = function () {
    return checkNaN(parseInt_(navigator.hardwareConcurrency), void 0);
  },
  get_timezone = function () {
    var n;
    const Intl_DateTimeFormatConstructor =
      null === (n = window.Intl) || void 0 === n ? void 0 : n.DateTimeFormat;
    if (Intl_DateTimeFormatConstructor) {
      const n = new Intl_DateTimeFormatConstructor().resolvedOptions().timeZone;
      if (n) return n;
    }
    const e = -(function () {
      const n = new Date().getFullYear();
      return Math.max(
        StrToFloat(new Date(n, 0, 1).getTimezoneOffset()),
        StrToFloat(new Date(n, 6, 1).getTimezoneOffset()),
      );
    })();
    return `UTC${e >= 0 ? "+" : ""}${e}`;
  },
  has_sessionStorage = function () {
    try {
      return !!window.sessionStorage;
    } catch (n) {
      return true;
    }
  },
  has_localStorage = function () {
    try {
      return !!window.localStorage;
    } catch (n) {
      return true;
    }
  },
  has_openDatabase = function () {
    return !!window.openDatabase;
  },
  get_cpuClass = function () {
    return navigator.cpuClass; // chrome138无
  },
  is_ipad_or_iphone = function () {
    const { platform: n } = navigator;
    return "MacIntel" === n && collectSomeKeys6_related_to_Apple() && !collectSomeKeys7_related_to_safari()
      ? (function () {
        if ("iPad" === navigator.platform) return true;
        const n = screen,
          t = n.width / n.height;
        return (
          countOfNotNullObj([
            "MediaSource" in window,
            !!Element.prototype.webkitRequestFullscreen,
            t > 0.65 && t < 1.53,
          ]) >= 2
        );
      })()
        ? "iPad"
        : "iPhone"
      : n;
  },
  get_plugins = function () {
    const plugins = navigator.plugins;
    if (!plugins) return;
    const t = [];
    for (let e = 0; e < plugins.length; ++e) {
      const r = plugins[e];
      if (!r) continue;
      const o = [];
      for (let n = 0; n < r.length; ++n) {
        const t = r[n];
        o.push({ type: t.type, suffixes: t.suffixes });
      }
      t.push({ name: r.name, description: r.description, mimeTypes: o });
    }
    return t;
  },
  test_touch_event = function () {
    const navigator_ = navigator;
    let t,
      maxTouchPoints = 0;
    void 0 !== navigator_.maxTouchPoints
      ? (maxTouchPoints = parseInt_(navigator_.maxTouchPoints))
      : void 0 !== navigator_.msMaxTouchPoints && (maxTouchPoints = navigator_.msMaxTouchPoints);
    try {
      (document.createEvent("TouchEvent"), (t = true));
    } catch (r) {
      t = false;
    }
    return {
      maxTouchPoints: maxTouchPoints,
      touchEvent: t,
      touchStart: "ontouchstart" in window,
    };
  },
  get_vendor = function () {
    return navigator.vendor || "";
  },
  test_vendor_keys = function () {
    const n = [];
    for (const t of [
      "chrome",
      "safari",
      "__crWeb",
      "__gCrWeb",
      "yandex",
      "__yb",
      "__ybro",
      "__firefox__",
      "__edgeTrackingPreventionStatistics",
      "webkit",
      "oprt",
      "samsungAr",
      "ucweb",
      "UCShellJava",
      "puffinDevice",
    ]) {
      const e = window[t];
      e && "object" == typeof e && n.push(t);
    }
    return n.sort();
  },
  test_cookie = function () {
    const n = document;
    try {
      n.cookie = "cookietest=1; SameSite=Strict;";
      const t = -1 !== n.cookie.indexOf("cookietest=");
      return (
        (n.cookie =
          "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT"),
        t
      );
    } catch (t) {
      return false;
    }
  },
  test_color_gamut = function () { //色域
    for (const n of ["rec2020", "p3", "srgb"])
      if (matchMedia(`(color-gamut: ${n})`).matches) return n;
  },
  invert_color = function () { //反色
    return !!Cn("inverted") || (!Cn("none") && void 0);
  },
  force_color = function () { // 强制颜色设置
    return !!Pn("active") || (!Pn("none") && void 0);
  },
  monochrome = function () { // 单色深度
    if (matchMedia("(min-monochrome: 0)").matches) {
      for (let n = 0; n <= 100; ++n)
        if (matchMedia(`(max-monochrome: ${n})`).matches) return n;
      throw new Error("Too high value");
    }
  },
  perfer_contrast = function () { // css对比度偏好
    return Tn("no-preference")
      ? 0
      : Tn("high") || Tn("more")
        ? 1
        : Tn("low") || Tn("less")
          ? -1
          : Tn("forced")
            ? 10
            : void 0;
  },
  motion_set = function () { // 减少动画
    return !!On("reduce") || (!On("no-preference") && void 0);
  },
  transparency_set = function () { // 减少透明度
    return !!_n("reduce") || (!_n("no-preference") && void 0);
  },
  dynamic_range_set = function () { // 色彩范围
    return !!xn("high") || (!xn("standard") && void 0);
  },
  Math_func_test = function () {
    const n = Nn.acos || jn,
      t = Nn.acosh || jn,
      e = Nn.asin || jn,
      r = Nn.asinh || jn,
      o = Nn.atanh || jn,
      i = Nn.atan || jn,
      u = Nn.sin || jn,
      c = Nn.sinh || jn,
      s = Nn.cos || jn,
      a = Nn.cosh || jn,
      l = Nn.tan || jn,
      f = Nn.tanh || jn,
      d = Nn.exp || jn,
      m = Nn.expm1 || jn,
      v = Nn.log1p || jn;
    return {
      acos: n(0.12312423423423424),
      acosh: t(1e308),
      acoshPf: ((h = 1e154), Nn.log(h + Nn.sqrt(h * h - 1))),
      asin: e(0.12312423423423424),
      asinh: r(1),
      asinhPf: ((n) => Nn.log(n + Nn.sqrt(n * n + 1)))(1),
      atanh: o(0.5),
      atanhPf: ((n) => Nn.log((1 + n) / (1 - n)) / 2)(0.5),
      atan: i(0.5),
      sin: u(-1e300),
      sinh: c(1),
      sinhPf: ((n) => Nn.exp(n) - 1 / Nn.exp(n) / 2)(1),
      cos: s(10.000000000123),
      cosh: a(1),
      coshPf: ((n) => (Nn.exp(n) + 1 / Nn.exp(n)) / 2)(1),
      tan: l(-1e300),
      tanh: f(1),
      tanhPf: ((n) => (Nn.exp(2 * n) - 1) / (Nn.exp(2 * n) + 1))(1),
      exp: convertToIUint8Array(1),
      expm1: m(1),
      expm1Pf: ((n) => Nn.exp(n) - 1)(1),
      log1p: v(10),
      log1pPf: ((n) => Nn.log(1 + n))(10),
      powPI: ((n) => Nn.pow(Nn.PI, n))(-100),
    };
    var h;
  },
  pdfViewerEnabled = function () {
    return navigator.pdfViewerEnabled;
  },
  get_NaN_imply = function () {
    const n = new Float32Array(1),
      t = new Uint8Array(n.buffer);
    return ((n[0] = 1 / 0), (n[0] = n[0] - n[0]), t[3]);
  },
  test_attributionSourceId = function () {
    var n;
    const t = document.createElement("a"),
      e =
        null !== (n = t.attributionSourceId) && void 0 !== n
          ? n
          : t.attributionsourceid;
    return void 0 === e ? void 0 : String(e);
  },
  getAudioLatency = function () {
    if (!(test_mobile() || collectSomeKeys6_related_to_Apple())) return -2;
    if (!window.AudioContext) return -1;
    const n = new AudioContext().baseLatency;
    return null == n ? -1 : isFinite(n) ? n : -3;
  },
  get_locale = function () {
    if (!window.Intl) return -1;
    const n = window.Intl.DateTimeFormat;
    if (!n) return -2;
    const t = n().resolvedOptions().locale;
    return t || "" === t ? t : -3;
  },
  collect_webgl_context_info = function ({ cache: cache }) {
    var t, e, r, o, i, u;
    const webgl_context = get_webgl_context(cache);
    if (!webgl_context) return -1;
    if (!check_getParameter(webgl_context)) return -2;
    const s = collectSomeKeys1_related_to_firefox__() ? null : webgl_context.getExtension(WEBGL_debug_renderer_info__);
    return {
      version:
        (null === (t = webgl_context.getParameter(webgl_context.VERSION)) || void 0 === t
          ? void 0
          : t.toString()) || "",
      vendor:
        (null === (e = webgl_context.getParameter(webgl_context.VENDOR)) || void 0 === e
          ? void 0
          : e.toString()) || "",
      vendorUnmasked: s
        ? null === (r = webgl_context.getParameter(s.UNMASKED_VENDOR_WEBGL)) || void 0 === r
          ? void 0
          : r.toString()
        : "",
      renderer:
        (null === (o = webgl_context.getParameter(webgl_context.RENDERER)) || void 0 === o
          ? void 0
          : o.toString()) || "",
      rendererUnmasked: s
        ? null === (i = webgl_context.getParameter(s.UNMASKED_RENDERER_WEBGL)) ||
          void 0 === i
          ? void 0
          : i.toString()
        : "",
      shadingLanguageVersion:
        (null === (u = webgl_context.getParameter(webgl_context.SHADING_LANGUAGE_VERSION)) ||
          void 0 === u
          ? void 0
          : u.toString()) || "",
    };
  },
  get_webgl_infos = function ({ cache: n }) {
    const webgl_context = get_webgl_context(n);
    if (!webgl_context) return -1;
    if (!check_getParameter(webgl_context)) return -2;
    const webgl_SupportedExtensions = webgl_context.getSupportedExtensions(),
      webgl_ContextAttributes = webgl_context.getContextAttributes(),
      unsupportedExtensions = [],
      ContextAttributes_arr = [],
      parameters = [],
      extensionParameters = [],
      shaderPrecisions = [];
    if (webgl_ContextAttributes) for (const l of Object.keys(webgl_ContextAttributes)) ContextAttributes_arr.push(`${l}=${webgl_ContextAttributes[l]}`);
    const a = str_filter_only_A_Z_0_9_x_str(webgl_context);
    console.log(a);
    for (const l of a) {
      const n = webgl_context[l];
      parameters.push(`${l}=${n}${webgl_const.has(n) ? `=${webgl_context.getParameter(n)}` : ""}`);
    }
    if (webgl_SupportedExtensions)
      for (const l of webgl_SupportedExtensions) {
        if (
          (l === WEBGL_debug_renderer_info__ && collectSomeKeys1_related_to_firefox__()) ||
          ("WEBGL_polygon_mode" === l && (collectSomeKeys10_related_to_chrome() || collectSomeKeys6_related_to_Apple()))
        )
          continue;
        const webgl_Extension = webgl_context.getExtension(l);
        if (webgl_Extension)
          for (const e of str_filter_only_A_Z_0_9_x_str(webgl_Extension)) {
            const r = webgl_Extension[e];
            extensionParameters.push(`${e}=${r}${webgl_Extension_Const.has(r) ? `=${webgl_context.getParameter(r)}` : ""}`);
          }
        else unsupportedExtensions.push(l);
      }
    for (const l of Dn)
      for (const n of Zn) {
        const e = Un(webgl_context, l, n);
        shaderPrecisions.push(`${l}.${n}=${e.join(",")}`);
      }
    return (
      extensionParameters.sort(),
      parameters.sort(),
      {
        contextAttributes: ContextAttributes_arr,
        parameters: parameters,
        shaderPrecisions: shaderPrecisions,
        extensions: webgl_SupportedExtensions,
        extensionParameters: extensionParameters,
        unsupportedExtensions: unsupportedExtensions,
      }
    );
  };
function runWhenNotBusy(timeLantency = 50) {
  return (function (n, t = 1 / 0) {
    const { requestIdleCallback: requestIdleCallback } = window;
    return requestIdleCallback
      ? new Promise((n) => requestIdleCallback.call(window, () => n(), { timeout: t }))
      : sleep(Math.min(n, t));
  })(timeLantency, 2 * timeLantency);
}
const murmurHash3 = function (str, t) {
  const e = (function (str) {
    const t = new Uint8Array(str.length);
    for (let e = 0; e < str.length; e++) {
      const r = str.charCodeAt(e);
      if (r > 127) return new TextEncoder().encode(str);
      t[e] = r;
    }
    return t;
  })(str);
  t = t || 0;
  const r = [0, e.length],
    o = r[1] % 16,
    i = r[1] - o,
    u = [0, t],
    c = [0, t],
    s = [0, 0],
    a = [0, 0];
  let l;
  for (l = 0; l < i; l += 16)
    ((s[0] =
      e[l + 4] | (e[l + 5] << 8) | (e[l + 6] << 16) | (e[l + 7] << 24)),
      (s[1] = e[l] | (e[l + 1] << 8) | (e[l + 2] << 16) | (e[l + 3] << 24)),
      (a[0] =
        e[l + 12] | (e[l + 13] << 8) | (e[l + 14] << 16) | (e[l + 15] << 24)),
      (a[1] =
        e[l + 8] | (e[l + 9] << 8) | (e[l + 10] << 16) | (e[l + 11] << 24)),
      G(s, z),
      U(s, 31),
      G(s, q),
      $(u, s),
      U(u, 27),
      H(u, c),
      G(u, K),
      H(u, Q),
      G(a, q),
      U(a, 33),
      G(a, z),
      $(c, a),
      U(c, 31),
      H(c, u),
      G(c, K),
      H(c, nn));
  ((s[0] = 0), (s[1] = 0), (a[0] = 0), (a[1] = 0));
  const f = [0, 0];
  switch (o) {
    case 15:
      ((f[1] = e[l + 14]), B(f, 48), $(a, f));
    case 14:
      ((f[1] = e[l + 13]), B(f, 40), $(a, f));
    case 13:
      ((f[1] = e[l + 12]), B(f, 32), $(a, f));
    case 12:
      ((f[1] = e[l + 11]), B(f, 24), $(a, f));
    case 11:
      ((f[1] = e[l + 10]), B(f, 16), $(a, f));
    case 10:
      ((f[1] = e[l + 9]), B(f, 8), $(a, f));
    case 9:
      ((f[1] = e[l + 8]), $(a, f), G(a, q), U(a, 33), G(a, z), $(c, a));
    case 8:
      ((f[1] = e[l + 7]), B(f, 56), $(s, f));
    case 7:
      ((f[1] = e[l + 6]), B(f, 48), $(s, f));
    case 6:
      ((f[1] = e[l + 5]), B(f, 40), $(s, f));
    case 5:
      ((f[1] = e[l + 4]), B(f, 32), $(s, f));
    case 4:
      ((f[1] = e[l + 3]), B(f, 24), $(s, f));
    case 3:
      ((f[1] = e[l + 2]), B(f, 16), $(s, f));
    case 2:
      ((f[1] = e[l + 1]), B(f, 8), $(s, f));
    case 1:
      ((f[1] = e[l]), $(s, f), G(s, z), U(s, 31), G(s, q), $(u, s));
  }
  return (
    $(u, r),
    $(c, r),
    H(u, c),
    H(c, u),
    J(u),
    J(c),
    H(u, c),
    H(c, u),
    ("00000000" + (u[0] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (u[1] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (c[0] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (c[1] >>> 0).toString(16)).slice(-8)
  );
},
  Ot = /*#__PURE__*/ new Uint32Array(2);
function genSeed() {
  if (!crypto) return Math.random();
  crypto.getRandomValues(Ot);
  return (1048576 * Ot[0] + (1048575 & Ot[1])) / 4503599627370496;
}
function genRandomStr(len, charCodeTable, seed = genSeed) {
  let r = "";
  for (let i = 0; i < len; i++) r += charCodeTable.charAt(seed() * charCodeTable.length);
  return r;
}
function genRandomStrWrapper(len) {
  return genRandomStr(
    len,
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  );
}
function get_random_serial_str() {
  return [8, 4, 4, 4, 12].map((n) => genRandomStr(n, h)).join("-");
}
const Vt = /*#__PURE__*/ new Uint8Array(1);
function Mt() {
  return (crypto.getRandomValues(Vt), Vt[0]);
}
function Ft() {
  return new TypeError("Can't pick from nothing");
}
function Wt(n, t) {
  return Math.floor(genSeed() * (t - n + 1)) + n;
}
function Dt(n) {
  return Zt(n)
    ? (function (n) {
      if (0 === n.length) throw Ft();
      return n[Math.floor(genSeed() * n.length)];
    })(n)
    : (function (n) {
      const t = genSeed();
      let e = 0,
        r = 0;
      for (const [, o] of n) e += o;
      for (const [o, i] of n) {
        if (t >= r / e && t < (r + i) / e) return o;
        r += i;
      }
      throw Ft();
    })(Object.entries(n));
}
const Zt = Array.isArray;
var Ht = "3.12.0";
const Gt = { default: "endpoint" },
  Ut = { default: "tEndpoint" },
  Bt = { default: "tlsEndpoint" };
function $t(n) {
  return n ? { query: true, fragment: true } : void 0;
}
const Yt = "_vid";
function getEmptyArr_size128() {
  return { len: 0, arr: new Uint8Array(128) };
}
function zt(n, t) {
  (setArrLen(n, n.len + 1), (n.arr[n.len++] = t));
}
function appendToArr(wrappered_arr, str) {
  (setArrLen(wrappered_arr, wrappered_arr.len + str.length), wrappered_arr.arr.set(str, wrappered_arr.len), (wrappered_arr.len += str.length));
}
function Kt(n) {
  return n.arr.subarray(0, n.len);
}
function setArrLen(n, t) {
  if (n.arr.length < t) {
    const e = new Uint8Array(Math.max(2 * n.arr.length, t));
    (e.set(n.arr), (n.arr = e));
  }
}
function ne(n) {
  const t = getEmptyArr_size128(),
    e = new WeakSet(),
    r = (n) => {
      if ("string" == typeof n) {
        const e = n.replace(
          Ce,
          (n) =>
            "\\" +
            (EscapeCharactersMap[n] || "u" + n.charCodeAt(0).toString(16).padStart(4, "0")),
        );
        return (zt(t, json_chr1), appendToArr(t, convertToUint8Array(e)), void zt(t, json_chr1));
      }
      if ("number" == typeof n || true === n || false === n)
        return (
          (Number.isNaN(n) || n === 1 / 0 || n === -1 / 0) && (n = null),
          void appendToArr(t, convertToUint8Array(String(n)))
        );
      if ("object" == typeof n && n) {
        if (e.has(n)) throw new TypeError("Recursive input");
        e.add(n);
        const { toJSON: o } = n;
        if ("function" == typeof o) return void r(o.call(n));
        if (n instanceof Number || n instanceof String)
          return void r(n.valueOf());
        let i = true;
        const u = () => {
          i ? (i = false) : zt(t, json_chr2);
        };
        if (Array.isArray(n)) {
          zt(t, json_chr16);
          for (const t of n) (u(), r(t));
          zt(t, json_chr17);
        } else {
          zt(t, json_chr18);
          for (const [e, o] of Object.entries(n))
            ee(o) || (u(), r(e), zt(t, json_chr3), r(o));
          zt(t, json_chr19);
        }
        e.delete(n);
      } else appendToArr(t, A_null);
    };
  return (r(n), Kt(t));
}
// function JSON_parser(json_string) {
//   const arr = getEmptyArr_size128(),
//     input = convertToIUint8Array(json_string);
//   let cur_pos = 0;
//   const o = () => (
//     space_strip(),
//     input[cur_pos] === json_chr1 // cur == "
//       ? i()
//       : is_Num_(input[cur_pos])
//         ? u()
//         : stream_cmp(A_null)
//           ? ((cur_pos += A_null.length), null)
//           : stream_cmp(A_true)
//             ? ((cur_pos += A_true.length), true)
//             : stream_cmp(A_false)
//               ? ((cur_pos += A_false.length), false)
//               : input[cur_pos] === json_chr16 // [
//                 ? c()
//                 : input[cur_pos] === json_chr18 // {
//                   ? s()
//                   : throw_err()
//   ),
//     i = () => {
//       for (arr.len = 0; cur_pos++, input[cur_pos] !== json_chr1;) {
//         if (input[cur_pos] === json_chr8) { // cur == \
//           if ((cur_pos++, input[cur_pos] === json_chr11)) { // cur == u
//             const n = parseInt(convertToString(input.subarray(cur_pos + 1, cur_pos + 5)), 16);
//             (appendToArr(arr, convertToUint8Array(String.fromCharCode(n))), (cur_pos += 4));
//             continue;
//           }
//           const n = Le[input[cur_pos]];
//           if (n) {
//             zt(arr, n);
//             continue;
//           }
//           return throw_err();
//         }
//         if (void 0 === input[cur_pos]) return throw_err();
//         zt(arr, input[cur_pos]);
//       }
//       return (cur_pos++, convertToString(Kt(arr)));
//     },
//     u = () => {
//       const n = cur_pos;
//       for (
//         ;
//         input[cur_pos] === json_chr15 || input[cur_pos] === json_chr10 || input[cur_pos] === json_chr12 || input[cur_pos] === json_chr13 || is_Num_(input[cur_pos]);

//       )
//         cur_pos++;
//       return Number(convertToString(input.subarray(n, cur_pos)));
//     },
//     c = () => {
//       const n = [];
//       for (cur_pos++; ;) {
//         if ((space_strip(), input[cur_pos] === json_chr17)) {
//           cur_pos++;
//           break;
//         }
//         if (n.length) {
//           if (input[cur_pos] !== json_chr2) return throw_err();
//           cur_pos++;
//         }
//         n.push(o());
//       }
//       return n;
//     },
//     s = () => {
//       const n = {};
//       let t = true;
//       for (cur_pos++; ;) {
//         if ((space_strip(), input[cur_pos] === json_chr19)) {
//           cur_pos++;
//           break;
//         }
//         if (!t) {
//           if (input[cur_pos] !== json_chr2) return throw_err();
//           (cur_pos++, space_strip());
//         }
//         if (input[cur_pos] !== json_chr1) return throw_err();
//         const u = i();
//         if ((space_strip(), input[cur_pos] !== json_chr3)) return throw_err();
//         (cur_pos++,
//           Object.defineProperty(n, u, {
//             value: o(),
//             configurable: true,
//             enumerable: true,
//             writable: true,
//           }),
//           (t = false));
//       }
//       return n;
//     },
//     space_strip = () => {
//       for (; input[cur_pos] === json_chr4 || input[cur_pos] === json_chr7 || input[cur_pos] === json_chr6 || input[cur_pos] === json_chr5;) cur_pos++;
//     },
//     stream_cmp = (n) => {
//       for (let t = 0; t < n.length; t++) if (input[cur_pos + t] !== n[t]) return false;
//       return true;
//     },
//     throw_err = () => {
//       throw new SyntaxError(
//         "Unexpected " + (cur_pos < input.length ? `byte ${cur_pos}` : "end"),
//       );
//     },
//     m = o();
//   return (space_strip(), void 0 !== input[cur_pos] && throw_err(), m);
// }
const oe = 34,
  ie = 44,
  ue = 58,
  ce = 32,
  se = 9,
  ae = 13,
  le = 10,
  fe = 92,
  de = 48,
  me = 101,
  ve = 117,
  he = 69,
  pe = 43,
  ge = 45,
  we = 46,
  ye = 91,
  be = 93,
  Ee = 123,
  Re = 125,
  Se = /*#__PURE__*/ new Uint8Array([110, ve, 108, 108]),
  Ie = /*#__PURE__*/ new Uint8Array([116, 114, ve, me]),
  ke = /*#__PURE__*/ new Uint8Array([102, 97, 108, 115, me]),
  Ae = {
    '"': '"',
    "\\": "\\",
    "\b": "b",
    "\f": "f",
    "\n": "n",
    "\r": "r",
    "\t": "t",
  }
function JSON_parser(n) {
  const t = getEmptyArr_size128(),
    e = convertToIUint8Array(n);
  let r = 0;
  const o = () => (
    a(),
    e[r] === oe
      ? i()
      : is_Num_(e[r])
        ? u()
        : l(Se)
          ? ((r += Se.length), null)
          : l(Ie)
            ? ((r += Ie.length), !0)
            : l(ke)
              ? ((r += ke.length), !1)
              : e[r] === ye
                ? c()
                : e[r] === Ee
                  ? s()
                  : f()
  ),
    i = () => {
      for (t.len = 0; r++, e[r] !== oe;) {
        if (e[r] === fe) {
          if ((r++, e[r] === ve)) {
            const n = parseInt(convertToString(e.subarray(r + 1, r + 5)), 16);
            (qt(t, w(String.fromCharCode(n))), (r += 4));
            continue;
          }
          const n = Le[e[r]];
          if (n) {
            zt(t, n);
            continue;
          }
          return f();
        }
        if (void 0 === e[r]) return f();
        zt(t, e[r]);
      }
      return (r++, convertToString(Kt(t)));
    },
    u = () => {
      const n = r;
      for (
        ;
        e[r] === we || e[r] === me || e[r] === he || e[r] === pe || is_Num_(e[r]);

      )
        r++;
      return Number(convertToString(e.subarray(n, r)));
    },
    c = () => {
      const n = [];
      for (r++; ;) {
        if ((a(), e[r] === be)) {
          r++;
          break;
        }
        if (n.length) {
          if (e[r] !== ie) return f();
          r++;
        }
        n.push(o());
      }
      return n;
    },
    s = () => {
      const n = {};
      let t = !0;
      for (r++; ;) {
        if ((a(), e[r] === Re)) {
          r++;
          break;
        }
        if (!t) {
          if (e[r] !== ie) return f();
          (r++, a());
        }
        if (e[r] !== oe) return f();
        const u = i();
        if ((a(), e[r] !== ue)) return f();
        (r++,
          Object.defineProperty(n, u, {
            value: o(),
            configurable: !0,
            enumerable: !0,
            writable: !0,
          }),
          (t = !1));
      }
      return n;
    },
    a = () => {
      for (; e[r] === ce || e[r] === le || e[r] === ae || e[r] === se;) r++;
    },
    l = (n) => {
      for (let t = 0; t < n.length; t++) if (e[r + t] !== n[t]) return !1;
      return !0;
    },
    f = () => {
      throw new SyntaxError(
        "Unexpected " + (r < e.length ? `byte ${r}` : "end"),
      );
    },
    m = o();
  return (a(), void 0 !== e[r] && f(), m);
}
function ee(n) {
  return void 0 === n || "function" == typeof n || "symbol" == typeof n;
}
function is_Num_(n) {
  return (n >= json_chr9 && n < json_chr9 + 10) || n === json_chr14;
}
const json_chr1 = 34, // "
  json_chr2 = 44, // ,
  json_chr3 = 58, // :
  json_chr4 = 32, // ' '
  json_chr5 = 9,  // \t
  json_chr6 = 13, // \r
  json_chr7 = 10, // \n
  json_chr8 = 92, // \
  json_chr9 = 48, // 0
  json_chr10 = 49, // 1
  json_chr11 = 117, // u
  json_chr12 = 69, // E
  json_chr13 = 43, // +
  json_chr14 = 45, // -
  json_chr15 = 46, // .
  json_chr16 = 91, // [
  json_chr17 = 93, // ]
  json_chr18 = 123, // {
  json_chr19 = 125, // }
  A_null = /*#__PURE__*/ new Uint8Array([110, json_chr11, 108, 108]),
  A_true = /*#__PURE__*/ new Uint8Array([116, 114, json_chr11, json_chr10]),
  A_false = /*#__PURE__*/ new Uint8Array([102, 97, 108, 115, json_chr10]),
  EscapeCharactersMap = {
    '"': '"',
    "\\": "\\",
    "\b": "b",
    "\f": "f",
    "\n": "n",
    "\r": "r",
    "\t": "t",
  },
  Le = /*#__PURE__*/ (() => {
    const n = new Uint8Array(128);
    for (const [t, e] of Object.entries(EscapeCharactersMap))
      n[e.charCodeAt(0)] = t.charCodeAt(0);
    return n;
  })(),
  Ce = /[\x00-\x1F"\\]/g,
  Pe = "Client timeout",
  Te = "Network connection error",
  Oe = "Network request aborted",
  _e = "Response cannot be parsed",
  xe = "Blocked by CSP",
  Ne = "The endpoint parameter is not a valid URL",
  je = "Handle on demand agent data error";
function Ve(n, t, e = "...") {
  return n.length <= t ? n : `${n.slice(0, Math.max(0, t - e.length))}${e}`;
}
function Me(n) {
  let t = "";
  for (let e = 0; e < n.length; ++e)
    if (e > 0) {
      const r = n[e].toLowerCase();
      r !== n[e] ? (t += ` ${r}`) : (t += n[e]);
    } else t += n[e].toUpperCase();
  return t;
}
function split_with(n, t) {
  if ("" === t) return [n, []];
  const e = n.split(t);
  return [e[0], e.length > 1 ? e.slice(1) : []];
}
const We = /*#__PURE__*/ Me("WrongRegion"),
  De = /*#__PURE__*/ Me("SubscriptionNotActive"),
  Ze = /*#__PURE__*/ Me("UnsupportedVersion"),
  He = /*#__PURE__*/ Me("InstallationMethodRestricted"),
  Ge = /*#__PURE__*/ Me("HostnameRestricted"),
  Ue = /*#__PURE__*/ Me("IntegrationFailed"),
  Be = /*#__PURE__*/ Me("VisitorNotFound"),
  $e = /*#__PURE__*/ Me("NetworkRestricted"),
  Ye = /*#__PURE__*/ Me("InvalidProxyIntegrationSecret"),
  Xe = /*#__PURE__*/ Me("InvalidProxyIntegrationHeaders"),
  Je = /*#__PURE__*/ Me("ProxyIntegrationSecretEnvironmentMismatch");
function ze(n, t, e, r) {
  const o = r.bodyData;
  return void 0 === o
    ? or(r)
    : (function (n) {
      return (
        n instanceof Object && "2" === n.v && n.products instanceof Object
      );
    })(o)
      ? (function (n, t, e, r) {
        var o;
        const {
          notifications: i,
          requestId: u,
          sealedResult: c,
          error: s,
          products: a,
        } = n,
          l = (function (n) {
            const t = [];
            for (const e of Object.keys(n)) {
              const r = n[e];
              r && t.push(r);
            }
            return t;
          })(a);
        er(i);
        for (const m of l) er(m.notifications);
        if (s) return ErrExplainer_(s, u, c, e);
        for (const { error: m } of l) if (m) return ErrExplainer_(m, u, c, e);
        !(function (n, t, e) {
          var r;
          for (const o of t)
            null === (r = o.onGetResponse) || void 0 === r || r.call(o, n, e);
        })(n, t, r);
        const f =
          null === (o = a.identification) || void 0 === o ? void 0 : o.data,
          d = f
            ? {
              requestId: u,
              ...(void 0 === c ? {} : { sealedResult: c }),
              ...f.result,
            }
            : Qe(u, c, e);
        return { result: d };
      })(o, n, t, e)
      : or(r);
}
function ErrExplainer_(n, t, e, r) {
  switch (n.code) {
    case "NotAvailableForCrawlBots":
    case "NotAvailableForAIBots":
      return nr(t, e, true, r);
    case "NotAvailableWithoutUA":
      return nr(t, e, void 0, r);
    default:
      return { error: tr(ErrExplainer(n), t, n), stop: "VisitorNotFound" === n.code };
  }
}
function ErrExplainer({ code: n, message: t }) {
  var e;
  return void 0 === n
    ? t
    : null !==
      (e = (function (n) {
        switch (n) {
          case "TokenRequired":
            return "API key required";
          case "TokenNotFound":
            return "API key not found";
          case "TokenExpired":
            return "API key expired";
          case "RequestCannotBeParsed":
            return "Request cannot be parsed";
          case "Failed":
            return "Request failed";
          case "RequestTimeout":
            return "Request failed to process";
          case "TooManyRequests":
            return "Too many requests, rate limit exceeded";
          case "OriginNotAvailable":
            return "Not available for this origin";
          case "HeaderRestricted":
            return "Not available with restricted header";
          case "NotAvailableForCrawlBots":
            return "Not available for crawl bots";
          case "NotAvailableForAIBots":
            return "Not available for AI bots";
          case "NotAvailableWithoutUA":
            return "Not available when User-Agent is unspecified";
        }
      })(n)) && void 0 !== e
      ? e
      : Me(n);
}
function Qe(requestId, sealedResult, e) {
  const r = {
    requestId: requestId,
    visitorFound: false,
    visitorId: "",
    confidence: { score: 0.5, comment: "The real score is unknown" },
  };
  if ((void 0 !== sealedResult && (r.sealedResult = sealedResult), !e)) return r;
  const o = "n/a";
  return {
    ...r,
    incognito: false,
    browserName: o,
    browserVersion: o,
    device: o,
    iframe_promise: o,
    os: o,
    osVersion: o,
    firstSeenAt: { subscription: null, global: null },
    lastSeenAt: { subscription: null, global: null },
  };
}
function nr(n, t, e, r) {
  return {
    result: {
      ...Qe(n, t, r),
      bot: { probability: 1, ...(void 0 === e ? void 0 : { safe: e }) },
    },
  };
}
function tr(n, t, e) {
  const r = new Error(n);
  return (void 0 !== t && (r.requestId = t), void 0 !== e && (r.raw = e), r);
}
function er(n) {
  null == n || n.forEach(rr);
}
function rr({ level: n, message: t }) {
  "error" === n
    ? console.error(t)
    : "warning" === n
      ? console.warn(t)
      : console.log(t);
}
function or(n) {
  return {
    error: tr(_e, void 0, { httpStatusCode: n.status, bodyBase64: R(n.body) }),
  };
}
const ir = "[Fingerprint Pro]";
function cr(n = `${ir} `) {
  const t = {};
  return (e) => {
    switch (e.e) {
      case 15:
        t[e.getCallId] = e.body;
        break;
      case 18:
        console.log(`${n}Visitor id request`, t[e.getCallId]);
        break;
      case 19:
        console.log(`${n}Visitor id response`, e.body);
        break;
      case 16:
      case 17:
        delete t[e.getCallId];
    }
  };
}
async function runActionInSandbox(action, sandbox) {
  const { action_queue: action_queue, iframe_promise: iframe_promise } = sandbox;
  if (null === iframe_promise) throw new Error("Shared iframe is not available");
  var i;
  await Promise.race([
    iframe_promise,
    ((i = `Iframe initialization timed out, debugCounters: ${JSON.stringify(sandbox.dc)}`),
      runCallbackWhenPageFocusedPromise(2e3).then(() => Promise.reject(new Error(i)))),
  ]);
  const u = await new Promise((resolve, reject) => {
    const i = { action: action, resolve: resolve, reject: reject };
    (action_queue.push(i),
      (async function (sandbox) {
        const { action_queue: action_queue, ipq: e, si: r, sandbox_iframe_window: o } = sandbox;
        if (e || 0 === action_queue.length) return;
        sandbox.ipq = true;
        for (; action_queue.length > 0;) {
          const n = action_queue.shift();
          if (n)
            try {
              const t = await n.action(r, o);
              n.resolve(t);
            } catch (i) {
              n.reject(i);
            }
        }
        sandbox.ipq = false;
      })(sandbox));
  });
  return u;
}
async function initSandbox(sandbox, t = 50) {
  sandbox.iframe_promise = addEmptyErrHandle(
    (async function (iframe_sandbox, t) {
      var e, r;
      const { dc: dc } = iframe_sandbox,
        documentObj = document;
      for (; !documentObj.body;) (dc.adb++, await setTimeoutWrapper(t));
      const aIframe = documentObj.createElement("iframe");
      for (
        await new Promise((n, t) => {
          let e = false;
          const r = () => {
            ((e = true), n());
          };
          ((aIframe.onload = r),
            (aIframe.onerror = (n) => {
              ((e = true), t(n));
            }));
          const { style: style } = aIframe;
          (style.setProperty("display", "block", "important"),
            (style.position = "absolute"),
            (style.top = "0"),
            (style.left = "0"),
            (style.visibility = "hidden"),
            (aIframe.src = "about:blank"),
            documentObj.body.appendChild(aIframe));
          const s = () => {
            var n, t;
            (dc.crs++,
              e ||
              ("complete" ===
                (null ===
                  (t =
                    null === (n = aIframe.contentWindow) || void 0 === n
                      ? void 0
                      : n.document) || void 0 === t
                  ? void 0
                  : t.readyState)
                ? r()
                : setTimeout(s, 10)));
          };
          s();
        });
        !(null ===
          (r =
            null === (e = aIframe.contentWindow) || void 0 === e
              ? void 0
              : e.document) || void 0 === r
          ? void 0
          : r.body);

      )
        (dc.asib++, await setTimeoutWrapper(t));
      ((iframe_sandbox.si = aIframe), (iframe_sandbox.sandbox_iframe_window = aIframe.contentWindow));
    })(sandbox, t),
  );
}
function setTimeoutWrapper(n, t) {
  return new Promise((e) => setTimeout(e, n, t));
}
const fr = "__fpjs_pvid";
function dr() {
  const n = window,
    t = n[fr];
  return (n[fr] = "string" == typeof t ? t : genRandomStrWrapper(10));
}
function vr(n, t, e, r) {
  const o = document,
    i = "securitypolicyviolation";
  let u;
  const c = (t) => {
    const e = new URL(n, location.href),
      { blockedURI: r } = t;
    (r !== e.href && r !== e.protocol.slice(0, -1) && r !== e.origin) ||
      ((u = t), s());
  };
  o.addEventListener(i, c);
  const s = () => o.removeEventListener(i, c);
  return (
    null == r || r.then(s, s),
    Promise.resolve()
      .then(t)
      .then(
        (n) => (s(), n),
        (n) =>
          new Promise((n) => {
            const t = new MessageChannel();
            ((t.port1.onmessage = () => n()), t.port2.postMessage(null));
          }).then(() => {
            if ((s(), u)) return e(u);
            throw n;
          }),
      )
  );
}
function isDoucumentVisable() {
  return !document.hidden;
}
const pr = "stripped",
  gr = ["path", "query", "fragment"];
async function sha256Hash(n, t) {
  if (yr(t)) return n;
  const e = url_parser(n);
  return (
    await Promise.all(
      gr.map(async (n) => {
        const r = e[n];
        var o;
        t[n] &&
          r &&
          (e[n] = await (async function (n) {
            var t;
            if ("" === n) return "";
            const e =
              null === (t = window.crypto) || void 0 === t ? void 0 : t.subtle;
            if (!(null == e ? void 0 : e.digest)) return pr;
            return R(await e.digest("SHA-256", convertToUint8Array(n)))
              .replace(/=/g, "")
              .replace(/\+/g, "-")
              .replace(/\//g, "_");
          })("query" === n ? ((o = r), o.split("&").sort().join("&")) : r));
      }),
    ),
    merge_res(e)
  );
}
function yr(n) {
  return !(n && gr.some((t) => n[t]));
}
function url_parser(tls_endpoint) {
  const [t, e] = split_with(tls_endpoint, "#"),
    [r, o] = split_with(t, "?");
  let i, u;
  const c = /^((\w+:)?\/\/[^/]*)?((\/)(.*)|$)$/.exec(r);
  return (
    c
      ? ((i = (c[1] || "") + (c[4] || "")), (u = c[5] || ""))
      : ((i = ""), (u = r)),
    {
      origin: i,
      path: u,
      query: o.length ? o.join("?") : null,
      fragment: e.length ? e.join("#") : null,
    }
  );
}
function merge_res({ origin: n, path: t, query: e, fragment: r }) {
  return n + t + (null === e ? "" : `?${e}`) + (null === r ? "" : `#${r}`);
}
function Rr(n, t) {
  const e = url_parser(n);
  let r = e.origin + e.path;
  return (
    r && !r.endsWith("/") && (r += "/"),
    (r += t),
    (e.origin = ""),
    (e.path = r),
    merge_res(e)
  );
}
function Sr(url, t) {
  const e = url_parser(url);
  let { query: r } = e;
  for (const [o, i] of Object.entries(t))
    for (const n of Array.isArray(i) ? i : [i])
      r = `${r ? `${r}&` : ""}${o}=${Ir(n)}`;
  return ((e.query = r), merge_res(e));
}
function Ir(n) {
  return n.split("/").map(encodeURIComponent).join("/");
}
function kr(n) {
  return (t) => {
    const e = [],
      r = new Map();
    const o = window.setInterval(function () {
      const t = e.shift();
      if (t) {
        const [e, o] = t,
          i = addEmptyErrHandle(n(o));
        r.set(e, i);
      }
    }, 1);
    function i() {
      window.clearInterval(o);
    }
    return (t.then(i, i), [e, r, t]);
  };
}
function Ar(n) {
  const t = Math.random();
  return (
    (function (n, t, e) {
      const [r] = n;
      r.push([t, e]);
    })(n.container, t, n),
    (function (n, t, e) {
      let r;
      function o() {
        window.clearInterval(r);
      }
      const [, i, u] = n,
        c = new Promise((n, e) => {
          r = window.setInterval(function () {
            const r = i.get(t);
            if (r) return (i.delete(t), r.then(n, e));
          }, 1);
        });
      return (c.then(o, o), null == e || e.then(o, o), u.then(o, o), c);
    })(n.container, t, n.abort)
  );
}
const Lr = /*#__PURE__*/ kr(Cr);
function Cr(n) {
  return vr(
    n.url,
    () =>
      (function ({
        url: n,
        method: t = "get",
        body: e,
        headers: r,
        withCredentials: o = false,
        timeout: i,
        responseFormat: u,
        abort: c,
      }) {
        return new Promise((s, a) => {
          if (
            (function (n) {
              if (URL.prototype)
                try {
                  return (new URL(n, location.href), false);
                } catch (t) {
                  if (t instanceof Error && "TypeError" === t.name) return true;
                  throw t;
                }
            })(n)
          )
            throw Pr("InvalidURLError", "Invalid URL");
          const l = new XMLHttpRequest();
          try {
            l.open(t, n, true);
          } catch (f) {
            if (
              f instanceof Error &&
              /violate.+content security policy/i.test(f.message)
            )
              throw Tr();
            throw f;
          }
          if (
            ((l.withCredentials = o),
              (l.timeout = void 0 === i ? 0 : Math.max(i, 1)),
              "binary" === u && (l.responseType = "arraybuffer"),
              r)
          )
            for (const n of Object.keys(r)) l.setRequestHeader(n, r[n]);
          ((l.onload = () =>
            s(
              (function (n) {
                return {
                  body: n.response,
                  status: n.status,
                  statusText: n.statusText,
                  getHeader: (t) =>
                    (function (n, t) {
                      const e = new RegExp(
                        `^${((r = t), r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))}: (.*)$`,
                        "im",
                      ).exec(n);
                      var r;
                      return e ? e[1] : void 0;
                    })(n.getAllResponseHeaders(), t),
                };
              })(l),
            )),
            (l.ontimeout = () =>
              a(Pr("TimeoutError", "The request timed out"))),
            (l.onabort = () => a(Pr("AbortError", "The request is aborted"))),
            (l.onerror = () =>
              a(
                Pr(
                  "TypeError",
                  navigator.onLine ? "Connection error" : "Network offline",
                ),
              )),
            l.send(
              (function (n) {
                const t = () => {
                  try {
                    return (new Blob([]), false);
                  } catch (n) {
                    return true;
                  }
                };
                if (n instanceof ArrayBuffer) {
                  if (!t()) return new Uint8Array(n);
                } else if (
                  (null == n ? void 0 : n.buffer) instanceof ArrayBuffer &&
                  t()
                )
                  return n.buffer;
                return n;
              })(e),
            ),
            null == c ||
            c
              .catch(() => { })
              .then(() => {
                ((l.onabort = null), l.abort());
              }));
        });
      })(n),
    () => {
      throw Tr();
    },
    n.abort,
  );
}
function Pr(n, t) {
  const e = new Error(t);
  return ((e.name = n), e);
}
function Tr() {
  return Pr("CSPError", "The request is blocked by the CSP");
}
function xr(n, t, ...e) {
  n &&
    o(() => {
      const r = t(...e);
      void 0 !== r && n(r);
    });
}
async function Nr(n, t, e, r, o) {
  let i;
  xr(n, t);
  try {
    i = await o();
  } catch (u) {
    throw (xr(n, r, u), u);
  }
  return (xr(n, e, i), i);
}
function Vr(n) {
  const t = n;
  return !!t.getCallId && "string" == typeof t.getCallId;
}
function Mr(n) {
  const t = n;
  return !!t.collectCallId && "string" == typeof t.collectCallId;
}
function collectSomeKeys5_maybe_new_api() {
  const windowObj = window,
    navigatorObj = navigator;
  return (
    countOfNotNullObj_([
      "maxTouchPoints" in navigatorObj,
      "mediaCapabilities" in navigatorObj,
      "PointerEvent" in windowObj,
      "visualViewport" in windowObj,
      "onafterprint" in windowObj,
    ]) >= 4
  );
}
function collectSomeKeys4_related_to_modern_api() {
  var n;
  const windowObj = window;
  return (
    countOfNotNullObj_([
      "Iterator" in windowObj, // ES6
      windowObj.Error && "isError" in windowObj.Error,
      windowObj.Atomics && "pause" in windowObj.Atomics,
      (null === (n = windowObj.Document) || void 0 === n ? void 0 : n.prototype) &&
      "fragmentDirective" in windowObj.Document.prototype,
      windowObj.CSSRule && !("UNKNOWN_RULE" in windowObj.CSSRule),
      !("SVGDocument" in windowObj),
    ]) >= 4
  );
}
function collectSomeKeys3_new_api() {
  const windowObj = window;
  return (
    countOfNotNullObj_([
      !("PushManager" in windowObj),
      !("AudioBuffer" in windowObj),
      !("RTCPeerConnection" in windowObj),
      !("geolocation" in navigator),
      !("ServiceWorker" in windowObj),
    ]) >= 3
  );
}
function collectSomeKeys2_very_new_api() { // 这几个api都很新
  const windowObj = window;
  return (
    countOfNotNullObj_([
      "ClipboardItem" in windowObj,
      "PerformanceEventTiming" in windowObj,
      "RTCSctpTransport" in windowObj,
    ]) >= 2
  );
}
function Br(n, t, e, r, o = Mt) {
  const i = o() % (e + 1),
    u = convertToIUint8Array(n),
    c = 1 + t.length + 1 + i + r + u.length,
    s = new ArrayBuffer(c),
    a = new Uint8Array(s);
  let l = 0;
  const f = o();
  a[l++] = f;
  for (const d of t) a[l++] = f + d;
  a[l++] = f + i;
  for (let d = 0; d < i; ++d) a[l++] = o();
  const m = new Uint8Array(r);
  for (let d = 0; d < r; ++d) ((m[d] = o()), (a[l++] = m[d]));
  for (let d = 0; d < u.length; ++d) a[l++] = u[d] ^ m[d % r];
  return s;
}
function decode(u32Arr, Arr, e) {
  const r = () => {
    throw new Error("Invalid data");
  },
    o = convertToIUint8Array(u32Arr);
  o.length < Arr.length + 2 && r();
  for (let f = 0; f < Arr.length; ++f) E(o[1 + f], o[0]) !== Arr[f] && r();
  const i = 1 + Arr.length,
    u = E(o[i], o[0]);
  o.length < i + 1 + u + e && r();
  const c = i + 1 + u,
    s = c + e,
    a = new ArrayBuffer(o.length - s),
    l = new Uint8Array(a);
  for (let f = 0; f < l.length; ++f) l[f] = o[s + f] ^ o[c + (f % e)];
  return a;
}
function get_cookie_value(n) {
  const t = `${n}=`;
  for (const e of document.cookie.split(";")) {
    let n = 0;
    for (; " " === e[n] && n < e.length;) ++n;
    if (e.indexOf(t) === n) return e.slice(n + t.length);
  }
}
function Xr(n, t, e, r) {
  const o = `${n}=${t}`,
    i = `expires=${new Date(Date.now() + 24 * e * 60 * 60 * 1e3).toUTCString()}`,
    u = r ? `domain=${r}` : "";
  document.cookie = [o, "path=/", i, u, "SameSite=Lax"].join("; ");
}
function Jr(n, t, e) {
  (zr((t) => {
    !(function (n, t) {
      Xr(n, "", -1, t);
    })(n, t);
  }),
    e < 0 || zr((r) => (Xr(n, t, e, r), get_cookie_value(n) === t)));
}
function zr(n) {
  const t = location.hostname,
    e = collectSomeKeys1_related_to_firefox();
  (function (n, t) {
    let e = n.length - ("." === n.slice(-1) ? 1 : 0);
    do {
      if (
        ((e = e > 0 ? n.lastIndexOf(".", e - 1) : -1), true === t(n.slice(e + 1)))
      )
        return true;
    } while (e >= 0);
    return false;
  })(t, (r) => {
    if (!e || !/^([^.]{1,3}\.)*[^.]+\.?$/.test(r) || r === t) return n(r);
  }) || n();
}
function qr(n, t) {
  (Jr(t, n, 365), to(t, n));
}
function add_t(n) {
  return `${n}_t`;
}
function add_lr(n) {
  return `${n}_lr`;
}
function get_localStorage_value(n) {
  var t, e;
  try {
    return null !==
      (e =
        null ===
          (t =
            null === localStorage || void 0 === localStorage
              ? void 0
              : localStorage.getItem) || void 0 === t
          ? void 0
          : t.call(localStorage, n)) && void 0 !== e
      ? e
      : void 0;
  } catch (r) { }
}
function to(n, t) {
  var e;
  try {
    null ===
      (e =
        null === localStorage || void 0 === localStorage
          ? void 0
          : localStorage.setItem) ||
      void 0 === e ||
      e.call(localStorage, n, t);
  } catch (r) { }
}
function eo() {
  return `js/${Ht}`;
}
const ro = [3, 7];
function oo(n, t) {
  const e = add_lr(n);
  if (0 === t.size) return;
  const r = io(e).filter((n) => !t.has(n[0]));
  0 !== r.length
    ? to(e, JSON.stringify(r))
    : (function (n) {
      var t;
      try {
        null ===
          (t =
            null === localStorage || void 0 === localStorage
              ? void 0
              : localStorage.removeItem) ||
          void 0 === t ||
          t.call(localStorage, n);
      } catch (e) { }
    })(e);
}
function io(n) {
  const t = get_localStorage_value(n);
  if (!t) return [];
  try {
    const n = t ? JSON.parse(t) : [];
    return Array.isArray(n) ? n : [];
  } catch (e) {
    return [];
  }
}
function uo(n) {
  return "agentId" in n;
}
function co(n, t, e, r) {
  const o = (function* (n, t, e) {
    let r = 0,
      o = 0;
    for (; r < n.length && o < t.length;)
      e(n[r], t[o]) ? (yield n[r], r++) : (yield t[o], o++);
    for (; r < n.length; r++) yield n[r];
    for (; o < t.length; o++) yield t[o];
  })(
    n.map((n) => ({ t: ho(n.time), s: "visible" === n.state ? "v" : "h" })),
    t,
    (n, t) => n.t < t.t,
  ),
    i = [];
  let u;
  const c = () => {
    0 === i.length && void 0 !== u && i.push({ t: e, s: u });
  };
  for (; i.length < 100;) {
    const n = o.next();
    if (n.done) break;
    const t = n.value,
      s = t.t,
      a = t.s;
    if (s > r) break;
    s < e ? (u = a) : a !== u && (c(), i.push(t), (u = a));
  }
  return (c(), i);
}
function so(n) {
  const t = ao(n.map((n) => n.url).filter((n) => Boolean(n)));
  return n.map((e, r) => {
    const o = n.length > 1 && r < n.length - 1 && !("error" in e);
    return fo(
      e.url,
      ho(e.startedAt),
      ho(e.finishedAt),
      o ? "Unknown" : e.error,
      t[e.url],
    );
  });
}
function ao(n) {
  const t = {};
  return (
    new Set(n).forEach((n) => {
      const e = (function (n) {
        if (!URL.prototype) return n;
        try {
          return new URL(n, window.location.origin).toString();
        } catch (t) {
          return n;
        }
      })(n),
        r = performance.getEntriesByName(e, "resource");
      t[n] = r;
    }),
    t
  );
}
function lo(n, t, e, r, o, i) {
  var u;
  const c = [];
  for (const s of n) {
    const n = s.event;
    if (n.e !== e && n.e !== r && n.e !== o) continue;
    if (n.stage !== i) continue;
    (c[(u = n.tryNumber)] || (c[u] = {}))[n.e] = s;
  }
  return c
    .map((n) => {
      var i, u, c, s, a, l;
      const f = null === (i = n[e]) || void 0 === i ? void 0 : i.timestamp,
        d =
          null !==
            (c = null === (u = n[r]) || void 0 === u ? void 0 : u.timestamp) &&
            void 0 !== c
            ? c
            : null === (s = n[o]) || void 0 === s
              ? void 0
              : s.timestamp,
        m = null === (a = n[e]) || void 0 === a ? void 0 : a.event.url,
        v = null === (l = n[o]) || void 0 === l ? void 0 : l.event.error;
      return f && d && m ? fo(m, f, d, v, t[m]) : null;
    })
    .filter((n) => Boolean(n));
}
function fo(n, t, e, r, o) {
  const i = (function (n, t, e) {
    if (!n) return;
    let r;
    for (let o = n.length - 1; o >= 0; o--) {
      const i = n[o];
      if (i.startTime < t - 1) break;
      i.responseEnd <= e + 1 && (r = i);
    }
    return r;
  })(o, t, e);
  return {
    s: mo(null == i ? void 0 : i.startTime) || Math.round(t),
    e: mo(null == i ? void 0 : i.responseEnd) || Math.round(e),
    u: n || null,
    er: r ? String(r) : null,
    ds: mo(null == i ? void 0 : i.domainLookupStart),
    de: mo(null == i ? void 0 : i.domainLookupEnd),
    cs: mo(null == i ? void 0 : i.connectStart),
    css: mo(null == i ? void 0 : i.secureConnectionStart),
    ce: mo(null == i ? void 0 : i.connectEnd),
    qs: mo(null == i ? void 0 : i.requestStart),
    ss: mo(null == i ? void 0 : i.responseStart),
  };
}
function mo(n) {
  return "number" == typeof n ? (0 === n ? null : Math.round(n)) : null;
}
function vo(n) {
  var t;
  const e = null === (t = n[13]) || void 0 === t ? void 0 : t.event.result;
  if (!e) return {};
  const r = {};
  for (const o in e) r[o] = Math.round(e[o].duration);
  return r;
}
function ho(n) {
  var t;
  const e =
    null !== (t = performance.timeOrigin) && void 0 !== t
      ? t
      : Date.now() - performance.now();
  return Math.round(n.getTime() - e);
}
const module2 = function () {
  const n = (function (n) {
    const t = {},
      e = [],
      r = [];
    let o = false;
    const i = addEventListenerWrapper(document, "visibilitychange", logDocumentIsVisable);
    function logDocumentIsVisable() {
      r.push({ t: Math.round(performance.now()), s: isDoucumentVisable() ? "v" : "h" });
    }
    function c(n) {
      if (o) return;
      switch (
      (s({ timestamp: Math.round(performance.now()), event: n }), n.e)
      ) {
        case 9:
        case 18:
          e.push(n.url);
          break;
        case 4:
        case 5:
          a(n.agentId, n.getCallId, "get");
          break;
        case 22:
        case 23:
          a(n.agentId, n.collectCallId, "collect");
      }
    }
    function s(n) {
      const e = n.event;
      if (!uo(e)) return;
      const { agentId: r } = e;
      if (
        (t[r] || (t[r] = { commonEvents: [], getCalls: {}, collectCalls: {} }),
          Vr(e))
      ) {
        const { getCallId: o } = e;
        let i = t[r].getCalls[o];
        return (i || (i = []), i.push(n), void (t[r].getCalls[o] = i));
      }
      if (Mr(e)) {
        const { collectCallId: o } = e;
        let i = t[r].collectCalls[o];
        return (i || (i = []), i.push(n), void (t[r].collectCalls[o] = i));
      }
      t[r].commonEvents.push(n);
    }
    function a(o, i, u) {
      var c, s, a, l, f, d, m, v, h, p, g, w, y, b, E, R, S, I, k, A, L;
      const C = (function (n, t, e, r) {
        const o = [];
        n[t] &&
          (o.push(...n[t].commonEvents),
            "get" === r && e && o.push(...(n[t].getCalls[e] || [])),
            "collect" === r && e && o.push(...(n[t].collectCalls[e] || [])));
        return o;
      })(t, o, i, u),
        P = {};
      for (const n of C) {
        P[n.event.e] = n;
      }
      const T = null !== (c = P[4]) && void 0 !== c ? c : P[5],
        O = null !== (s = P[22]) && void 0 !== s ? s : P[23],
        _ = P[3] && T,
        x = P[21] && O,
        N = _ || x;
      if (!(P[0] && P[1] && P[12] && N)) return;
      const {
        token: j,
        apiKey: V = j,
        storageKey: M = Yt,
        modules: F,
        ldi: W,
        aggressiveOptimization: D = false,
        optimizeRepeatedVisits: Z = false,
      } = P[0].event.options;
      if (!V) return;
      const H = Math.min(
        P[0].timestamp,
        ho(
          null !== (a = null == W ? void 0 : W.attempts[0].startedAt) &&
            void 0 !== a
            ? a
            : new Date("8524-04-28"),
        ),
      ),
        G = null === (l = P[5]) || void 0 === l ? void 0 : l.event.error,
        U = null === (f = P[4]) || void 0 === f ? void 0 : f.event.result,
        B = null === (d = P[23]) || void 0 === d ? void 0 : d.event.error,
        $ = null !== (m = P[13]) && void 0 !== m ? m : P[14],
        Y = ao(e),
        X = {
          am: x ? "collect" : "get",
          v: "1",
          dt: new Date().toISOString(),
          ci: eo(),
          pi: dr(),
          ai: o,
          ri: genRandomStrWrapper(12),
          c: V,
          rid:
            null !==
              (h =
                null !== (v = null == U ? void 0 : U.requestId) && void 0 !== v
                  ? v
                  : null == G
                    ? void 0
                    : G.requestId) && void 0 !== h
              ? h
              : null,
          er:
            null !== (p = null == G ? void 0 : G.message) && void 0 !== p
              ? p
              : null,
          cr:
            null !== (g = null == B ? void 0 : B.message) && void 0 !== g
              ? g
              : null,
          mo: F.map((n) => n.key).filter((n) => Boolean(n)),
          sa: so(
            null !== (w = null == W ? void 0 : W.attempts) && void 0 !== w
              ? w
              : [],
          ),
          ls: P[0].timestamp,
          le: P[1].timestamp,
          ca: lo(C, Y, 9, 10, 11),
          ss: P[12].timestamp,
          se:
            null !== (y = null == $ ? void 0 : $.timestamp) && void 0 !== y
              ? y
              : null,
          sd: vo(P),
          gs:
            null !==
              (E =
                null === (b = P[3]) || void 0 === b ? void 0 : b.timestamp) &&
              void 0 !== E
              ? E
              : null,
          ge:
            null !== (R = null == T ? void 0 : T.timestamp) && void 0 !== R
              ? R
              : null,
          cs:
            null !==
              (I =
                null === (S = P[21]) || void 0 === S ? void 0 : S.timestamp) &&
              void 0 !== I
              ? I
              : null,
          ce:
            null !== (k = null == O ? void 0 : O.timestamp) && void 0 !== k
              ? k
              : null,
          fa: lo(C, Y, 18, 19, 20, 0),
          ia: lo(C, Y, 18, 19, 20, 1),
          vs: co(
            null !== (A = null == W ? void 0 : W.visibilityStates) &&
              void 0 !== A
              ? A
              : [],
            r,
            H,
            null !== (L = null == T ? void 0 : T.timestamp) && void 0 !== L
              ? L
              : null == O
                ? void 0
                : O.timestamp,
          ),
          ab: P[1].event.ab,
          ao: D,
          or: Z,
        };
      n(X, M);
    }
    return (
      logDocumentIsVisable(),
      {
        addEvent: c,
        destroy: () => {
          ((o = true), i());
        },
      }
    );
  })((n, t) => {
    !(function (n, t) {
      const e = add_lr(t),
        r = io(e) || [];
      r.splice(0, r.length - 2);
      const o = Br(ne(n), ro, 3, 7);
      (r.push([n.ri, R(o)]), to(e, JSON.stringify(r)));
    })(n, t);
  });
  let t = new Set();
  return {
    toRequest(n) {
      const e = (function (n) {
        const t = add_lr(n),
          e = io(t) || [],
          r = [];
        return (
          e.forEach((n) => {
            try {
              const t = JSON_parser(decode(base64Encode(n[1]), ro, 7));
              r.push(t);
            } catch (t) { }
          }),
          r
        );
      })(n);
      return ((t = new Set(e.map((n) => n.ri))), { lr: e });
    },
    onGetResponse(n, e) {
      oo(e, t);
    },
    onCollectResponse(n) {
      oo(n, t);
    },
    addEvent: n.addEvent,
    destroy: n.destroy,
  };
};
function ko(t, e, r, o = 1 / 0, u) {
  const c = { failedAttempts: [] },
    [s, a] = (function (n) {
      const t = (function (n) {
        const t = [...n];
        return {
          current: () => t[0],
          postpone() {
            const n = t.shift();
            void 0 !== n && t.push(n);
          },
          exclude() {
            t.shift();
          },
        };
      })(n),
        e = f(200, 1e4),
        r = new Set();
      return [
        t.current(),
        (n, o, i) => {
          let u;
          if (o)
            ((u = (function (n) {
              const t = n.getHeader("retry-after");
              if (!t) return;
              if (/^\s*\d+(\.\d+)?\s*$/.test(t)) return 1e3 * parseFloat(t);
              const e = new Date(t);
              return isNaN(e) ? void 0 : e.getTime() - Date.now();
            })(o)),
              void 0 !== u ? t.postpone() : t.exclude());
          else if (
            i instanceof Error &&
            ("CSPError" === i.name || "InvalidURLError" === i.name)
          )
            (t.exclude(), (u = 0));
          else {
            const e = Date.now() - n.getTime() < 50,
              o = t.current();
            (o && e && !r.has(o) && (r.add(o), (u = 0)), t.postpone());
          }
          const c = t.current();
          return void 0 === c
            ? void 0
            : [c, null != u ? u : n.getTime() + e() - Date.now()];
        },
      ];
    })(t),
    l = ((d = [
      null == u
        ? void 0
        : u.then(
          (n) => (c.aborted = { resolve: true, value: n }),
          (n) => (c.aborted = { resolve: false, error: n }),
        ),
      (async () => {
        if (void 0 === s) return;
        let t = s;
        for (let s = 0; s < o; ++s) {
          const o = new Date();
          let f, d;
          try {
            f = await i(() => e(t, s, u), u);
          } catch (l) {
            ((d = l),
              c.failedAttempts.push({ level: 0, endpoint: t, error: l }));
          }
          if (f) {
            const n = r(f);
            if ("result" in n) {
              c.result = n.result;
              break;
            }
            if (
              (c.failedAttempts.push({ level: 1, endpoint: t, error: n.error }),
                n.stop)
            )
              break;
          }
          const m = a(o, f, d);
          if (!m) break;
          (await i(setTimeOutRun(m[1]), u), (t = m[0]));
        }
      })(),
    ]),
      Promise.race(d.filter((n) => !!n))).then(() => c);
  var d;
  return { then: l.then.bind(l), current: c };
}
const Ao = /\(([^(^\s^}]+):(\d)+:(\d)+\)/i,
  Lo = /@([^(^\s^}]+):(\d)+:(\d)+/i;
function Co() {
  const n = new Error(),
    t = (function (n) {
      if (n.fileName) return n.fileName.split(" ")[0];
      return n.sourceURL ? n.sourceURL : null;
    })(n);
  if (t) return t;
  if (n.stack) {
    const t = (function (n) {
      const [t, e] = n.split("\n"),
        r = Ao.exec(e) || Lo.exec(t);
      return r ? r[1] : void 0;
    })(n.stack);
    if (t) return t;
  }
  return null;
}
function si(n) {
  const t = {};
  for (const e of Object.keys(n)) {
    const r = n[e];
    if (r) {
      const n = "error" in r ? ai(r.error) : r.value;
      t[e] = n;
    }
  }
  return t;
}
function ai(n) {
  return { e: li(n) };
}
function li(n) {
  let t;
  try {
    n && "object" == typeof n && "message" in n
      ? ((t = String(n.message)), "name" in n && (t = `${n.name}: ${t}`))
      : (t = String(n));
  } catch (n) {
    t = `Code 3017: ${n}`;
  }
  return Ve(t, 500);
}
function runner2(n) {
  return do_a_then_pass_res_to_b(n, (n) => ({ s: 0, v: n }));
}
function runner1(func, err_code) {
  return do_a_then_pass_res_to_b(func, (n) => ({ s: null == n ? err_code : 0, v: null != n ? n : null }));
}
function check_res_is_err_code(n) {
  return do_a_then_pass_res_to_b(n, (n) =>
    "number" == typeof n ? { s: n, v: null } : { s: 0, v: n },
  );
}
async function hi({
  modules: n,
  components: t = {},
  customComponent: e,
  apiKey: r,
  tls: o,
  tag: i,
  extendedResult: u,
  exposeComponents: c,
  linkedId: s,
  algorithm: a,
  imi: l,
  storageKey: f,
  products: d,
  urlHashing: m,
  ab: v,
  fast: h,
  requestId: p,
}) {
  const g = {
    c: r,
    t: pi(i),
    cbd: u ? 1 : void 0,
    lid: s,
    a: a,
    m: l.m,
    l: l.l,
    ec: c ? 1 : void 0,
    mo: n.map((n) => n.key).filter((n) => Boolean(n)),
    pr: d,
    s56: o,
    s67: e ? { s: 0, v: e } : { s: -1, v: null },
    sc: gi(),
    uh: wi(m),
    gt: 1,
    ab: v,
    hu: h ? 0 : p ? 1 : void 0,
    ri: p,
    ...si(t),
  };
  return (
    await Promise.all(
      n.map(async ({ toRequest: n }) => {
        n && Object.assign(g, await n(f, m));
      }),
    ),
    g
  );
}
function pi(n) {
  return n && "object" == typeof n ? n : null != n ? { tag: n } : void 0;
}
function gi() {
  const n = Co();
  return { u: n ? Ve(n, 1e3) : null };
}
function wi(n) {
  if (n)
    return {
      p: n.path ? 1 : void 0,
      q: n.query ? 1 : void 0,
      f: n.fragment ? 1 : void 0,
    };
}
async function yi(n) {
  if (!bi()) return [false, n];
  const [t, e] = (function () {
    try {
      return [true, new CompressionStream("deflate-raw")];
    } catch (n) {
      return [false, new CompressionStream("deflate")];
    }
  })(),
    r = await (async function (n, t) {
      const e = t.writable.getWriter();
      (e.write(n), e.close());
      const r = t.readable.getReader(),
        o = [];
      let i = 0;
      for (; ;) {
        const { value: n, done: t } = await r.read();
        if (t) break;
        (o.push(n), (i += n.byteLength));
      }
      if (1 === o.length) return o[0];
      const u = new Uint8Array(i);
      let c = 0;
      for (const s of o) (u.set(s, c), (c += s.byteLength));
      return u;
    })(n, e),
    o = t
      ? r
      : (function (n) {
        return new Uint8Array(n.buffer, n.byteOffset + 2, n.byteLength - 6);
      })(r);
  return [true, o];
}
function bi() {
  return "undefined" != typeof CompressionStream;
}
const Ei = [3, 13],
  Ri = [3, 14];
function Si(n, t) {
  return Br(n, t ? Ri : Ei, 3, 9);
}
function Ii(n, t) {
  return decode(n, t ? Ri : Ei, 9);
}
function ki(n) {
  return n.byteLength > 1024 && bi();
}
async function Ai(n, t, e, r, o) {
  if (0 === n.length) throw new TypeError("The list of endpoints is empty");
  const i = n.map((n) =>
    (function (n, { apiKey: t, integrations: e = [] }) {
      return Sr(n, { ci: eo(), q: t, ii: e });
    })(n, t),
  ),
    u = await hi(t),
    c = ne(u),
    s = t.fast ? 0 : 1;
  return await Nr(
    o,
    () => ({ e: 15, stage: s, body: u, isCompressed: ki(c) }),
    (n) => ({ e: 16, stage: s, result: n }),
    (n) => ({ e: 17, stage: s, error: n }),
    async () =>
      (function ({ result: n, failedAttempts: t, aborted: e }) {
        if (n) return n;
        const r = t[0];
        if (!r) throw e && !e.resolve ? e.error : new Error("aborted");
        const { level: o, error: i } = r;
        if (0 === o && i instanceof Error) {
          switch (i.name) {
            case "CSPError":
              throw new Error(xe);
            case "InvalidURLError":
              throw new Error(Ne);
            case "AbortError":
              throw new Error(Oe);
          }
          throw new Error(Te);
        }
        throw i;
      })(
        await ko(
          i,
          Li.bind(null, c, o, s, e),
          ze.bind(null, t.modules, !!t.extendedResult, t.storageKey),
          1 / 0,
          r,
        ),
      ),
  );
}
function Li(n, t, e, r, o, i, u) {
  return Nr(
    t,
    () => ({ e: 18, stage: e, tryNumber: i, url: o }),
    ({ status: n, getHeader: t, body: r, bodyData: o, wasSecret: u }) => ({
      e: 19,
      stage: e,
      tryNumber: i,
      status: n,
      retryAfter: t("retry-after"),
      body: null != o ? o : r,
      wasSecret: u,
    }),
    (n) => ({ e: 20, stage: e, tryNumber: i, error: n }),
    async () => {
      const t = await (async function ({ body: n, ...t }) {
        const [e, r] = ki(n) ? await yi(n) : [false, n],
          o = await Ar({ ...t, body: Si(r, e), responseFormat: "binary" });
        let i = o.body,
          u = false;
        try {
          ((i = Ii(i, false)), (u = true));
        } catch (c) { }
        return { ...o, body: i, wasSecret: u };
      })({
        url: o,
        method: "post",
        headers: { "Content-Type": "text/plain" },
        body: n,
        withCredentials: true,
        abort: u,
        container: r,
      });
      return (function (n) {
        let t;
        try {
          t = JSON_parser(n.body);
        } catch (e) { }
        return { ...n, bodyData: t };
      })(t);
    },
  );
}
function taskRunnerInit(modules, optimizeLevel, context) {
  const options = { ...context, cache: {} },
    [stage3, stage1_and_2] = (function (modules) {
      const stage1 = {},
        stage2 = {},
        stage3 = {};
      for (const { sources: i } of modules)
        i &&
          (Object.assign(stage1, i.stage1),
            Object.assign(stage2, i.stage2),
            Object.assign(stage3, i.stage3));
      const o = stage2;
      return (Object.assign(o, stage3), [stage1, o]);
    })(modules),
    opt = (function (n) {
      return n ? 1e5 : 50;
    })(optimizeLevel),
    taskPromises = runStageTasks(stage3, context, [], opt),
    taskPromises2 = addEmptyErrHandle(runWhenNotBusy(8).then(() => runStageTasks(stage1_and_2, context, [], opt)));
  return async () => {
    const [n, t] = await Promise.all([taskPromises(), taskPromises2.then((n) => n())]);
    !(function (n) {
      const { si: t, action_queue: e } = n;
      for (
        t && t.parentNode && t.parentNode.removeChild(t),
        n.si = null,
        n.sandbox_iframe_window = null,
        n.iframe_promise = null;
        e.length > 0;

      ) {
        const n = e.shift();
        n && n.reject(new Error("Iframe cleanup called"));
      }
      n.ipq = false;
    })(context.iframe_sandbox);
    const e = t;
    return (Object.assign(e, n), e);
  };
}
function getPropertyNameByHash(Obj, hash) {
  let e = Obj;
  for (; e;) {
    const propertyNames = Object.getOwnPropertyNames(e);
    for (let e = 0; e < propertyNames.length; e++) {
      const r = propertyNames[e];
      if (getHash(r) == hash) return r;
    }
    e = Object.getPrototypeOf(e);
  }
  return "";
}
function get_property_byHash_then_bind(obj, hash) {
  const e = obj[getPropertyNameByHash(obj, hash)];
  return "function" == typeof e ? e.bind(obj) : e;
}
function encrypted_msg_getter(u32Arr, idx) {
  let e;
  return (r) => (
    e ||
    (e = (function (n, t) {
      return JSON_parser(decode(new Uint32Array(n), [], t));
    })(u32Arr, idx)),
    getObjectKeys(e[r])
  );
}
function _i(arr, str_getter, e) { // e= 1 or 2
  if (arr.length !== str_getter.length || arr.length !== e.length)
    throw new Error(
      "Invalid encryption configuration: all input arrays must have the same length.",
    );
  const r = new Array(arr.length).fill(void 0);
  return (idx) => {
    var tmp;
    if (r.every((n) => null === n)) return null;
    console.log(arr);
    for (let u = 0; u < arr.length; u++) {
      console.log(str_getter[u]());
      console.log(e[u]);
      console.log("decoder: ", Enc_decoder(arr[u], str_getter[u], e[u]));
      if (
        null !== r[u] &&
        (r[u] || (r[u] = Enc_decoder(arr[u], str_getter[u], e[u])), null !== r[u])
      )
        return getObjectKeys(null === (tmp = r[u]) || void 0 === tmp ? void 0 : tmp[idx]);
    }
    return null;
  };
}
function Enc_decoder(buffer, input_str_getter, e) {
  const input = convertToUint8Array(input_str_getter());
  try {
    return JSON_parser(
      (function (u32Arr, input, e) {
        const r = convertToIUint8Array(u32Arr),
          o = new ArrayBuffer(r.length - e),
          i = new Uint8Array(o);
        for (let u = 0; u < r.length; ++u) i[u] = r[u] ^ input[u % input.length];
        console.log("decrypted: ", convertToString(o));
        return o;
      })(new Uint32Array(buffer), input, e),
    );
  } catch (o) {
    if (isErr(o) && "SyntaxError" === o.name) return null;
    throw o;
  }
}
var Ni = /*#__PURE__*/ encrypted_msg_getter(
  [
    3237452699, 2611787672, 3045311674, 2962332150, 4003383289, 4090353905,
    3805249708, 3028587956, 2899958253, 2946027702, 4002601983, 4204452091,
    4039413417, 3970602410, 3953912762, 2631244730, 3973421252, 2844251834,
    2861027766, 2946406891, 3050675130, 3806041579, 2961425392, 4023946731,
    3800865722, 4208313581, 2776941242, 3806041513, 4208313085, 2743259834,
    3806041513, 4208314361, 3012023994, 3968505257, 3045300922, 2799294954,
    4001684968, 2648037617,
  ],
  4,
);
const ji = [202, 206];
function Vi(n) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t) {
      return n < t;
    },
    r = function (n, t) {
      return n / t;
    },
    o = function (n, t, e) {
      return n(t, e);
    },
    i = function (n, t) {
      return n + t;
    },
    u = function (n, t) {
      return n + t;
    },
    c = function (n, t) {
      return n + t;
    },
    s = function (n, t) {
      return n - t;
    },
    a = function (n, t, e, r) {
      return n(t, e, r);
    },
    l = function (n, t) {
      return n(t);
    },
    f = function (n, t) {
      return n(t);
    },
    d = function (n, t) {
      return n + t;
    },
    m = function (n, t) {
      return n + t;
    },
    v = function (n, t) {
      return n + t;
    },
    h = function (n, t) {
      return n + t;
    },
    p = function (n, t) {
      return n(t);
    },
    g = function (n, t, e) {
      return n(t, e);
    },
    y = t(murmurHash3, n),
    b = new Uint8Array(16);
  for (let w = 0; e(w, y.length); w += 2)
    b[r(w, 2)] = o(parseInt, i(i(u(i("", y[w]), ""), y[c(w, 1)]), ""), 16);
  const E = t(R, b),
    S = a(Fi, b[o(parseInt, y[s(y.length, 1)], 16)], 8, 22),
    I = E.slice(0, Math.min(s(E.length, 2), S)),
    k = o(Wi, l(convertToUint8Array, I), ji),
    A = l(R, l(Di, f(getHash_, k))).slice(0, 2);
  return o(
    Rr,
    n,
    g(
      Mi,
      d(m(v(h("", I), ""), A), "")
        .replace(new RegExp(l(Ni, 1), "g"), "-")
        .replace(new RegExp(p(Ni, 2), "g"), "_"),
      b,
    ),
  );
}
function Mi(n, t) {
  const e = function (n, t) {
    return n < t;
  },
    r = function (n, t, e, r) {
      return n(t, e, r);
    },
    o = function (n, t) {
      return n & t;
    },
    i = function (n, t) {
      return n + t;
    };
  let u = 0,
    c = 0,
    s = "";
  for (; e(u, n.length);)
    ((c = r(Fi, t[o(u, 15)], 4, 7)),
      (s += n.slice(u, i(u, c))),
      (s += "/"),
      (u += c));
  return s.slice(0, -1);
}
function Fi(n, t, e) {
  const r = function (n, t) {
    return n + t;
  },
    o = function (n, t) {
      return n * t;
    },
    i = function (n, t) {
      return n / t;
    },
    u = function (n, t) {
      return n - t;
    };
  return r(t, Math.floor(o(i(n, 256), r(u(e, t), 1))));
}
function Wi(n, t) {
  const e = function (n, t) {
    return n < t;
  },
    r = function (n, t) {
      return n + t;
    },
    o = (function (n, t) {
      return n + t;
    })(n.length, t.length),
    i = new Uint8Array(o);
  for (let u = 0; e(u, n.length); u++) i[u] = n[u];
  for (let u = 0; e(u, t.length); u++) i[r(u, n.length)] = t[u];
  return i;
}
function Di(n) {
  const t = function (n, t) {
    return n >> t;
  },
    e = function (n, t) {
      return n >> t;
    };
  return new Uint8Array([
    (function (n, t) {
      return n >> t;
    })(n, 24),
    t(n, 16),
    e(n, 8),
    n,
  ]);
}
function Zi(n, t) {
  const e = function (n, t, e) {
    return n(t, e);
  };
  return (
    !!n &&
    (function (n, t) {
      return n === t;
    })(e(get_property_byHash_then_bind, n, 3814588639), e(get_property_byHash_then_bind, t, 3814588639))
  );
}
function Hi(n) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t) {
      return n !== t;
    },
    r = function (n, t) {
      return n + t;
    },
    o = function (n, t) {
      return n + t;
    },
    i = function (n, t) {
      return n + t;
    },
    u = function (n, t) {
      return n(t);
    };
  let c = t(Ni, 3);
  return (
    e(n, t(Ni, 4)) && (c = r(o(i(r("", n), "."), c), "")),
    r(i(u(Ni, 5), c), "/")
  );
}
function Gi(n) {
  const t = function (n, t) {
    return n + t;
  },
    e = function (n, t) {
      return n(t);
    };
  return t(
    t(
      "",
      (function (n, t) {
        return n(t);
      })(Ni, 6)[n],
    ),
    e(Ni, 7),
  );
}
const Ui = /*#__PURE__*/ (() => ({ noop: ["a", "b"] }))();
function excuteTask(modules, t, e, apiKey, i, c, storageKey, integrations, imi, urlHashing, ab, p, g) {
  const w = 1e4,
    configs = {
      modules: modules,
      apiKey: apiKey,
      integrations: integrations,
      imi: imi,
      storageKey: storageKey,
      ab: ab,
      urlHashing: urlHashing,
    };
  function b(n) {
    if (!g) return;
    const t = genRandomStrWrapper(8);
    switch (n) {
      case "get":
        return (function (n, t) {
          return (e) => {
            const r = { ...e, getCallId: t };
            return n(r);
          };
        })(g, t);
      case "collect":
        return (function (n, t) {
          return (e) => {
            const r = { ...e, collectCallId: t };
            return n(r);
          };
        })(g, t);
    }
  }
  const E = (n) =>
    runCallbackWhenPageFocusedPromise(null != n ? n : w).then(() => Promise.reject(new Error(Pe))),
    R = async (t, e, r) => {
      var o;
      const i = E(t.timeout);
      r(await S(t, i, e));
      for (const u of modules)
        null === (o = u.onCollectResponse) || void 0 === o || o.call(u, storageKey);
    },
    S = async ({ timeout: n = 1e4, tag: t, linkedId: e }, r, o) => {
      const i = addEmptyErrHandle(Promise.all([_(o), O(n, false, o)])),
        [c, s] = await Promise.race([r, i]),
        a = await hi({ ...configs, components: c, tag: t, tls: s, linkedId: C(e) });
      return await (async function (n, t, e) {
        const r = [eo(), t],
          o = ne(r),
          i = ne(n),
          [u, c] = ki(i) ? await yi(i) : [false, i],
          s = Si(c, u);
        return (
          xr(e, () => ({ e: 24, agentMetadata: r, body: n, isCompressed: u })),
          `${I(o)}:${I(s)}`
        );
      })(a, configs.integrations, o);
    },
    k = async (n, t, e) => {
      const r = s();
      try {
        const o = Lr(r),
          i = E(n.timeout),
          u = L(n, o, t),
          c = await A(o, i, t);
        c ? (e(c), await u(c.requestId, i)) : e(await u(void 0, i));
      } finally {
        r.resolve();
      }
    },
    A = async (n, t, e) => {
      if (!p) return;
      const r = await T();
      let o = false;
      t.catch(() => (o = true));
      try {
        return await Ai(i, { ...configs, tls: r, fast: true }, n, t, e);
      } catch (u) {
        if (o) throw u;
        return void ((isErr(u) && u.message === Be) || console.warn(u));
      }
    },
    L = (
      {
        timeout: n = 1e4,
        tag: t,
        linkedId: e,
        disableTls: r,
        extendedResult: o,
        exposeComponents: s,
        environment: a,
        products: l,
      },
      f,
      d,
    ) => {
      const m = addEmptyErrHandle(Promise.all([_(d), O(n, r, d)]));
      return async (n, r) => {
        const [u, v] = await Promise.race([r, m]);
        return await Ai(
          i,
          {
            ...configs,
            components: u,
            customComponent: a,
            tag: t,
            tls: v,
            linkedId: C(e),
            extendedResult: o,
            exposeComponents: s,
            algorithm: c,
            products: P(l, "products"),
            requestId: n,
          },
          f,
          r,
          d,
        );
      };
    },
    T = () => (null == e ? void 0 : e(0, 50, false, void 0)),
    O = (n, t, r) => (null == e ? void 0 : e(0.1 * n, 0.4 * n, t, r)),
    _ = async (n) => {
      try {
        const e = await t();
        return (xr(n, () => ({ e: 13, result: e })), e);
      } catch (e) {
        throw (xr(n, () => ({ e: 14, error: e })), e);
      }
    };
  return {
    get: (n = {}) => {
      const t = b("get");
      return Nr(
        t,
        () => ({ e: 3, options: n }),
        (n) => ({ e: 4, result: n }),
        (n) => ({ e: 5, error: n }),
        () => a((e) => k(n, t, e)),
      );
    },
    collect: (n = {}) => {
      const t = b("collect");
      return Nr(
        t,
        () => ({ e: 21, options: n }),
        (n) => ({ e: 22, result: n }),
        (n) => ({ e: 23, error: n }),
        () => a((e) => R(n, t, e)),
      );
    },
  };
}
function $i() {
  const n = /{(.*?)}/.exec(location.hash);
  return !!n && 3025844545 === getHash(n[1]);
}
const runService = async function (configs) {
  const t = (function (n) {
    const t = n.filter((n) => !!n);
    return t.length
      ? (...n) => {
        for (const e of t) o(() => e(...n));
      }
      : void 0;
  })([
    $i() && cr(),
    ...((null == configs ? void 0 : configs.modules) || []).map((n) => n.addEvent),
  ]),
    e =
      t &&
      (function (n, t) {
        return (e) => {
          const r = { ...e, agentId: t };
          return n(r);
        };
      })(t, genRandomStrWrapper(8)),
    [r] = await Nr(
      e,
      () => ({ e: 0, version: Ht, options: configs }),
      ([, n]) => ({ e: 1, ab: n }),
      (n) => ({ e: 2, error: n }),
      () => {
        var t;
        const {
          token: token,
          apiKey: apiKey = token,
          region: region = "us",
          tlsEndpoint: tlsEndpoint = Bt,
          disableTls: disableTls,
          storageKey: storageKey = Yt,
          endpoint: endpoint = Gt,
          te: te = Ut,
          integrationInfo: integrationInfo = [],
          algorithm: algorithm,
          imi: imi = { m: "s" },
          stripUrlParams: stripUrlParams,
          urlHashing: urlHashing = $t(stripUrlParams),
          modules: modules,
          abTests: abTests = {},
          externalABSelections: externalABSelections = {},
          optimizeRepeatedVisits: optimizeRepeatedVisits = false,
          aggressiveOptimization: aggressiveOptimization = false,
        } = configs;
        if (!apiKey || "string" != typeof apiKey) throw new Error("API key required");
        const E = (function (n, t, e) {
          const r = { ...e },
            o = Object.entries(n);
          for (const [u, c] of o) {
            const n = t[u];
            if (n)
              try {
                r[u] = Dt(n);
                continue;
              } catch (i) {
                console.error(i);
              }
            r[u] = Dt(c);
          }
          return r;
        })(
          (function (n) {
            const t = { ...Ui };
            for (const e of n) Object.assign(t, e.ab);
            return t;
          })(modules),
          abTests,
          externalABSelections,
        ),
          R = (function (n, t) {
            const e = function (n, t, e) {
              return n(t, e);
            },
              r = function (n, t) {
                return n(t);
              };
            return (Array.isArray(n) ? n : [n]).map((n) =>
              e(Zi, n, Gt) ? r(Hi, t) : r(String, n),
            );
          })(endpoint, region),
          S =
            null ===
              (t = (function (n) {
                for (const t of n) if (t.tls) return t.tls;
              })(modules)) || void 0 === t
              ? void 0
              : t(tlsEndpoint, R, apiKey, disableTls, void 0, e);
        xr(e, () => ({ e: 12 }));
        const I = (function (n, t) {
          const e = function (n, t) {
            return n(t);
          },
            r = function (n, t) {
              return n(t);
            };
          return ((o = n), Zi(o, Ut) ? e(Gi, t) : r(String, n));
          var o;
        })(te, region),
          sandbox = {
            action_queue: [],
            ipq: false,
            si: null,
            sandbox_iframe_window: null,
            iframe_promise: null,
            dc: { adb: 0, crs: 0, asib: 0 },
          };
        initSandbox(sandbox);
        return [
          excuteTask(
            modules,
            taskRunnerInit(modules, aggressiveOptimization, { urlHashing: urlHashing, ab: E, te: I, iframe_sandbox: sandbox }),
            S,
            apiKey,
            R,
            C(algorithm),
            storageKey,
            integrationInfo,
            imi,
            urlHashing,
            E,
            optimizeRepeatedVisits,
            e,
          ),
          E,
        ];
      },
    );
  return r;
},
  Xi = function (n, t = {}) {
    const { storageKey: e = Yt, do: r } = t;
    try {
      const t = (function (n) {
        const t = base64Encode(n);
        let e = t;
        try {
          e = Ii(t, false);
        } catch (r) { }
        try {
          return JSON_parser(e);
        } catch (o) { }
        return null;
      })(n);
      null !== t
        ? (t.visitorToken && qr(t.visitorToken, add_t(e)),
          er(t.notifications),
          xr(r, () => ({ e: 25, result: { response: t } })))
        : xr(r, () => ({
          e: 25,
          result: { error: new Error("Failed to decode response") },
        }));
    } catch (o) {
      throw (
        xr(r, () => ({
          e: 25,
          result: { error: o instanceof Error ? o : new Error(String(o)) },
        })),
        tr(je, void 0, o)
      );
    }
  },
  AdBlocker_test = /*#__PURE__*/ runner1(AdBlocker_test_worker, -1),
  font_width_test = /*#__PURE__*/ runner2(fontWidthTest),
  audio_data_collector_ = /*#__PURE__*/ do_a_then_pass_res_to_b(audio_data_collector, (n) =>
    -1 === n || -2 === n || -3 === n ? { s: n, v: null } : { s: 0, v: n },
  ),
  getScreenSize_worker = /*#__PURE__*/ do_a_then_pass_res_to_b(getCheckScreenSizeFunc, (n) => ({
    s: 0,
    v: n.map((n) => (null === n ? -1 : n)),
  })),
  oscpu = /*#__PURE__*/ runner1(get_oscpu, -1),
  language = /*#__PURE__*/ runner2(get_language),
  get_color_depth_ = /*#__PURE__*/ runner1(colorDepth, -1),
  get_deviceMemory = /*#__PURE__*/ runner1(deviceMemory, -1),
  get_H_W_ = /*#__PURE__*/ do_a_then_pass_res_to_b(get_H_W, (n) => ({
    s: 0,
    v: n.map((n) => (null === n ? -1 : n)),
  })),
  get_hardwareConcurrency = /*#__PURE__*/ runner1(hardwareConcurrency, -1),
  timezone = /*#__PURE__*/ runner2(get_timezone),
  sessionStorage_ = /*#__PURE__*/ runner2(has_sessionStorage),
  localStorage_ = /*#__PURE__*/ runner2(has_localStorage),
  openDatabase = /*#__PURE__*/ runner2(has_openDatabase),
  get_cpuClass_ = /*#__PURE__*/ runner1(get_cpuClass, -1),
  is_ipad_or_iphone_ = /*#__PURE__*/ runner1(is_ipad_or_iphone, -1),
  plugins = /*#__PURE__*/ runner1(get_plugins, -1),
  canvas_test_worker = /*#__PURE__*/ do_a_then_pass_res_to_b(
    () => draw_canvas_test(),
    (n) => {
      const { geometry: geometry, text: text } = n,
        r = "unsupported" === geometry ? -1 : "unstable" === geometry ? -2 : 0;
      return {
        s: r,
        v: { ...n, geometry: 0 === r ? murmurHash3(geometry) : "", text: 0 === r ? murmurHash3(text) : "" },
      };
    },
  ),
  touch_event = /*#__PURE__*/ runner2(test_touch_event),
  vendor = /*#__PURE__*/ runner2(get_vendor),
  vendor_keys = /*#__PURE__*/ runner2(test_vendor_keys),
  cookie = /*#__PURE__*/ runner2(test_cookie),
  color_gamut = /*#__PURE__*/ runner1(test_color_gamut, -1),
  invert_color_ = /*#__PURE__*/ runner1(invert_color, -1),
  force_color_ = /*#__PURE__*/ runner1(force_color, -1),
  monochrome_test = /*#__PURE__*/ runner1(monochrome, -1),
  perfer_contrast_ = /*#__PURE__*/ runner1(perfer_contrast, -1),
  motion_set_ = /*#__PURE__*/ runner1(motion_set, -1),
  transparency_set_ = /*#__PURE__*/ runner1(transparency_set, -1),
  dynamic_range_set_ = /*#__PURE__*/ runner1(dynamic_range_set, -1),
  Math_func_test_hash = /*#__PURE__*/ do_a_then_pass_res_to_b(Math_func_test, (n) => ({
    s: 0,
    v: murmurHash3(
      Object.keys(n)
        .map((t) => `${t}=${n[t]}`)
        .join(","),
    ),
  })),
  pdfViewerEnabled_ = /*#__PURE__*/ runner1(pdfViewerEnabled, -1),
  NaN_imply_ = /*#__PURE__*/ runner2(get_NaN_imply),
  attributionSourceId = /*#__PURE__*/ runner1(test_attributionSourceId, -1),
  getAudioLatency_ = /*#__PURE__*/ do_a_then_pass_res_to_b(getAudioLatency, (n) =>
    -1 === n || -2 === n || -3 === n ? { s: n, v: null } : { s: 0, v: n },
  ),
  webgl_context_info = /*#__PURE__*/ check_res_is_err_code(collect_webgl_context_info),
  webgl_infos = /*#__PURE__*/ do_a_then_pass_res_to_b(get_webgl_infos, (n) => {
    var t;
    if ("number" == typeof n) return { s: n, v: null };
    const e = ["32926", "32928"], // GL_CURRENT_PROGRAM,GL_CURRENT_PROGRAM
      r = n.parameters.map((n) => {
        const [t, r, o] = n.split("=", 3);
        return void 0 !== o || e.includes(r) ? `${t}(${r})=null` : `${t}=${r}`;
      }),
      o = n.extensionParameters.map((n) => {
        const [t, e, r] = n.split("=", 3);
        return void 0 !== r && "34047" !== e ? `${t}(${e})=${r}` : `${t}=${e}`;
      });
    return {
      s: 0,
      v: {
        contextAttributes: murmurHash3(n.contextAttributes.join("&")),
        parameters: murmurHash3(r.join("&")),
        parameters2: murmurHash3(n.parameters.join("&")),
        shaderPrecisions: murmurHash3(n.shaderPrecisions.join("&")),
        extensions: murmurHash3(
          (null === (t = n.extensions) || void 0 === t
            ? void 0
            : t.join(",")) || "",
        ),
        extensionParameters: murmurHash3(o.join(",")),
        extensionParameters2: murmurHash3(n.extensionParameters.join("&")),
        unsupportedExtensions: n.unsupportedExtensions,
      },
    };
  }),
  get_locale_ = /*#__PURE__*/ check_res_is_err_code(get_locale),
  run_IE_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys8_related_to_IE),
  run_Edge_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys9_related_to_Edge),
  run_Chrome_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys10_related_to_chrome),
  run_Apple_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys6_related_to_Apple),
  run_safari_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys7_related_to_safari),
  run_firefox_KEY_collector = /*#__PURE__*/ runner2(collectSomeKeys1_related_to_firefox),
  mobile = /*#__PURE__*/ runner2(test_mobile),
  new_api = /*#__PURE__*/ runner2(collectSomeKeys3_new_api),
  new_web_api = /*#__PURE__*/ runner2(test_new_webAPI);
function Brave_detect() {
  const Window = window;
  if (!collectSomeKeys10_related_to_chrome()) return ret(false);
  try {
    if (
      [66, 114, 97, 118, 101].map((n) => String.fromCharCode(n)).join("") in Window //Brave
    )
      return ret(true);
    const testCanvas = document.createElement("canvas");
    ((testCanvas.width = 4), (testCanvas.height = 4), (testCanvas.style.display = "inline"));
    const canvasData = testCanvas.toDataURL();
    if ("" === canvasData) return ret(true);
    const r = base64Encode(canvasData.split(",")[1]),
      o = indexOfArrayInString(r, [73, 68, 65, 84, 24]);
    if (-1 === o) return ret(false);
    const i = indexOfArrayInString(r, [73, 69, 78, 68]);
    if (-1 === i) return ret(false);
    const u = r.slice(o + 5, i);
    return ret(1321 !== u.reduce((n, t) => n + t, 0));
  } catch (t) {
    return ret(false);
  }
}
function ret(n) {
  return { s: 0, v: n };
}
function test_theme_color() {
  return match_media("dark")
    ? { s: 0, v: true }
    : match_media("light")
      ? { s: 0, v: false }
      : { s: -1, v: null };
}
function match_media(n) {
  return matchMedia(`(prefers-color-scheme: ${n})`).matches;
}
function getTime() {
  const now = Date.now();
  return { s: 0, v: [cc(now), cc(now - 6e4 * new Date().getTimezoneOffset())] };
}
function cc(n) {
  const t = Number(n);
  return isNaN(t) ? -1 : t;
}
const standard_font = ["monospace", "sans-serif", "serif"],
  test_font = [
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF",
  ];
async function Font_Test(n) {
  return { s: 0, v: await testFont(n) };
}
function testFont(context) {
  return runActionInSandbox((sandbox_iframe, { document: documentObj }) => {
    const Body = documentObj.body;
    Body.style.fontSize = "48px";
    const aTestDiv = documentObj.createElement("div");
    aTestDiv.style.setProperty("visibility", "hidden", "important");
    const offsetWidthRes = {},
      i = {},
      createSpanAndTestFont = (font) => {
        const atestSpan = documentObj.createElement("span"),
          { style: o } = atestSpan;
        return (
          (o.position = "absolute"),
          (o.top = "0"),
          (o.left = "0"),
          (o.fontFamily = font),
          (atestSpan.textContent = "mmMwWLliI0O&1"),
          aTestDiv.appendChild(atestSpan),
          atestSpan
        );
      },
      c = (n, t) => createSpanAndTestFont(`'${n}',${t}`),
      spans = standard_font.map(createSpanAndTestFont),
      a = (() => {
        const n = {};
        for (const t of test_font) n[t] = standard_font.map((n) => c(t, n));
        return n;
      })();
    Body.appendChild(aTestDiv);
    for (let f = 0; f < standard_font.length; f++)
      ((offsetWidthRes[standard_font[f]] = spans[f].offsetWidth), (i[standard_font[f]] = spans[f].offsetHeight));
    const l = test_font.filter((n) => {
      return (
        (t = a[n]),
        standard_font.some(
          (n, e) => t[e].offsetWidth !== offsetWidthRes[n] || t[e].offsetHeight !== i[n],
        )
      );
      var t;
    });
    return (Body.removeChild(aTestDiv), (Body.style.fontSize = ""), l);
  }, context.iframe_sandbox);
}
function measurePerformanceIntervals() {
  const { performance: performance } = window;
  if (!(null == performance ? void 0 : performance.now)) return { s: -1, v: null };
  let t = 1,
    e = 1,
    now = performance.now(),
    o = now;
  for (let i = 0; i < 5e4; i++)
    if ((now = o) < (o = performance.now())) {
      const n = o - now;
      n > t ? n < e && (e = n) : n < t && ((e = t), (t = n));
    }
  return { s: 0, v: [t, e] };
}
var mc = /*#__PURE__*/ encrypted_msg_getter(
  [1910186786, 4206938268, 3099470367, 511281317, 2493621742, 2512262268],
  6,
); // mc(0)= performance
function get_jsHeapSizeLimit() {
  var performance,
    memory,
    equal = function (n, t) {
      return n === t;
    },
    equal_ = function (n, t) {
      return n === t;
    },
    fun_2arg_func = function (n, t, e) {
      return n(t, e);
    };
  const i =
    equal(
      (memory =
        (function (n, t) {
          return n === t;
        })(
          (performance =
            window[
            (function (n, t) {
              return n(t);
            })(mc, 0)
            ]),
          null,
        ) || equal_(performance, void 0)
          ? void 0
          : fun_2arg_func(get_property_byHash_then_bind, performance, 3933025333)), // memory
      null,
    ) || equal_(memory, void 0)
      ? void 0
      : (console.log(memory), fun_2arg_func(get_property_byHash_then_bind, memory, 3098533860)); // jsHeapSizeLimit
  return equal(i, null) || equal(i, void 0) ? { s: -1, v: null } : { s: 0, v: i };
}
function draw_and_get_webgl_render_data({ cache: cache }) {
  const webgl_context = get_webgl_context(cache);
  return webgl_context
    ? ((function (webgl_context) {
      webgl_context.clearColor(0, 0, 1, 1);
      const t = webgl_context.createProgram();
      if (!t) return;
      function e(e, code) {
        const shader = webgl_context.createShader(35633 - e);
        t &&
          shader &&
          (webgl_context.shaderSource(shader, code), webgl_context.compileShader(shader), webgl_context.attachShader(t, shader));
      }
      (e(
        0,
        "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}",
      ),
        e(1, "void main(){gl_FragColor=vec4(1,0,0,1);}"),
        webgl_context.linkProgram(t),
        webgl_context.useProgram(t),
        webgl_context.enableVertexAttribArray(0));
      const r = webgl_context.getUniformLocation(t, "t"),
        o = webgl_context.createBuffer(),
        i = 34962;
      (webgl_context.bindBuffer(i, o),
        webgl_context.bufferData(i, new Float32Array([0, 1, -1, -1, 1, -1]), 35044),
        webgl_context.vertexAttribPointer(0, 2, 5126, false, 0, 0),
        webgl_context.clear(16384),
        webgl_context.uniform1f(r, 3.65),
        webgl_context.drawArrays(4, 0, 3));
    })(webgl_context),
      { s: 0, v: murmurHash3(webgl_context.canvas.toDataURL()) })
    : { s: -1, v: null };
}
function getVoiceInfoHash_worker_func(context) {
  return getVoiceInfoHash(context, CollectVoiceOnReturnHandler);
}
async function getVoiceInfoHash({ cache: Cache }, r) {
  const { speechSynthesis: speechSynthesis } = window;
  if ("function" != typeof (null == speechSynthesis ? void 0 : speechSynthesis.getVoices))
    return { s: -1, v: null };

  Cache.tts ||
    (Cache.tts = (async function (speechSynthesis) {
      const getSpeechSynthesisVoiceArr = () => speechSynthesis.getVoices();
      if (
        (function (speechSynthesis) {
          return !speechSynthesis.addEventListener || (collectSomeKeys1_related_to_firefox() && collectSomeKeys3_new_api());
        })(speechSynthesis) // 检查这几个特性是否存在
      )
        return { voiceArr: getSpeechSynthesisVoiceArr() };
      const res = { voiceArr: null };
      let i;
      try {
        await new Promise((resolve, reject) => {
          let s;
          const Localfunc = () => {
            const voiceArr = getSpeechSynthesisVoiceArr();
            voiceArr.length
              ? ((res.voiceArr = voiceArr), null == s || s(), (s = tryRunFunc(resolve, 50)))
              : s || (s = runCallbackWhenPageFocused(resolve, 600));
          };
          ((i = addEventListenerWrapper(speechSynthesis, "voiceschanged", () => {
            try {
              Localfunc();
            } catch (n) {
              reject(n);
            }
          })),
            Localfunc());
        });
      } finally {
        i && runCallbackWhenPageFocused(i, 1e4);
      }
      return res;
    })(speechSynthesis));
  const ttsInfo = await Cache.tts;
  return () => (ttsInfo.v ? r(ttsInfo.v) : { s: -2, v: null });
}
function CollectVoiceOnReturnHandler(n) {
  const t = (n) => n.replace(/([,\\])/g, "\\$1"),
    voiceInfos = n
      .map((voice) =>
        [
          t(voice.voiceURI),
          t(voice.name),
          t(voice.lang),
          voice.localService ? "1" : "0",
          voice.default ? "1" : "0",
        ].join(","),
      )
      .sort();
  return { haveVoice: n.length ? 0 : 1, res: murmurHash3(JSON.stringify(voiceInfos)) };
}
const platformInfoList = [
  "brands",
  "mobile",
  "platform",
  "platformVersion",
  "architecture",
  "bitness",
  "model",
  "uaFullVersion",
  "fullVersionList",
];
async function getPlatformInfoFromList() {
  var n;
  const { userAgentData: userAgentData } = navigator;
  if (!userAgentData || "object" != typeof userAgentData) return { s: -1, v: null };
  const e = {},
    fail_List = [];
  return (
    "function" == typeof userAgentData.getHighEntropyValues &&
    (await Promise.all(
      platformInfoList.map(async (platformInfoKey) => {
        try {
          const r = (await userAgentData.getHighEntropyValues([platformInfoKey]))[platformInfoKey];
          void 0 !== r &&
            (e[platformInfoKey] = "string" == typeof r ? r : JSON.stringify(r));
        } catch (o) {
          if (!(o instanceof Error && "NotAllowedError" === o.name)) throw o;
          fail_List.push(platformInfoKey);
        }
      }),
    )),
    {
      s: 0,
      res: {
        b: userAgentData.brands.map((n) => ({ b: n.brand, v: n.version })),
        m: userAgentData.mobile,
        p: null !== (n = userAgentData.platform) && void 0 !== n ? n : null,
        h: e,
        nah: fail_List,
      },
    }
  );
}
async function getIframeUrl({ urlHashing: context }) {
  const iframeUrlData = (function (windowObj) {
    var t, e;
    const r = [];
    let windowObj_ = windowObj;
    for (; ;)
      try {
        const n = null === (t = windowObj_.location) || void 0 === t ? void 0 : t.href,
          i = null === (e = windowObj_.document) || void 0 === e ? void 0 : e.referrer;
        if (void 0 === n || void 0 === i) return { s: 1, v: r };
        r.push({ l: n, f: i });
        const u = windowObj_.parent;
        if (!u || u === windowObj_) return { s: 0, v: r };
        windowObj_ = u;
      } catch (i) {
        if (checkSecErr(i)) return { s: 1, v: r };
        throw i;
      }
  })(window);
  return { ...iframeUrlData, v: await convertUrlToSHA256(iframeUrlData.v, context) };
}
async function convertUrlToSHA256(n, t) {
  return Promise.all(
    n.map(async (n) => {
      const [e, r] = await Promise.all([sha256Hash(n.l, t), sha256Hash(n.f, t)]);
      return { l: e, f: r };
    }),
  );
}
function checkSecErr(n) {
  if (!n || "object" != typeof n) return false;
  const t = n;
  return (
    !(
      (!collectSomeKeys8_related_to_IE() && !collectSomeKeys9_related_to_Edge()) ||
      ("Error" !== t.name && "TypeError" !== t.name) ||
      "Permission denied" !== t.message
    ) || "SecurityError" === t.name
  );
}
function get_origin() {
  return (function ({ location: location, origin: origin }) {
    const e = location.origin,
      r = location.ancestorOrigins;
    let o = null;
    if (r) {
      o = new Array(r.length);
      for (let n = 0; n < r.length; ++n) o[n] = r[n];
    }
    return {
      s: 0,
      v: { w: null == origin ? null : origin, l: null == e ? null : e, a: o },
    };
  })(window);
}
function get_eval_toString_length() {
  return { s: 0, v: eval.toString().length };
}
function test_webdriver() {
  const { webdriver: n } = navigator;
  return null === n
    ? { s: -1, v: null }
    : void 0 === n
      ? { s: -2, v: null }
      : { s: 0, v: n };
}
function test_storage_getDirectory() {
  const run2arg_func = function (n, t, e) {
    return n(t, e);
  },
    equal = function (n, t) {
      return n === t;
    },
    equal_ = function (n, t) {
      return n === t;
    },
    run2arg_func_ = function (n, t, e) {
      return n(t, e);
    };
  return run2arg_func_(
    prepareRace,
    (function (n, t, e) {
      return n(t, e);
    })(runCallbackWhenPageFocusedPromise, 250, { s: -2, v: null }),
    async () => {
      const storage = run2arg_func(get_property_byHash_then_bind, navigator, 1417288500); // storage
      return (equal(storage, null) || equal_(storage, void 0) ? void 0 : run2arg_func_(get_property_byHash_then_bind, storage, 3686698663)) // getDirectory
        ? await run2arg_func(get_property_byHash_then_bind, storage, 3686698663)().then(
          () => ({ s: 0, v: "" }),
          (n) => ({ s: 0, v: get_property_byHash_then_bind(n, 3065852031) }),
        )
        : { s: -1, v: null };
    },
  );
}
function maybeGetEncKey() {
  const n = new Image().style;

  console.log([getPropertyNameByHash((t = n), 2882756133), getPropertyNameByHash(t, 3858258232)])
  return reshuffleStr(
    [getPropertyNameByHash((t = n), 2882756133), getPropertyNameByHash(t, 3858258232)], // webkitTapHighlightColor  null
    [
      18, 23, 22, 11, 23, 17, 3, 20, 4, 22, 19, 11, 25, 13, 23, 22, 7, 7, 17,
      18, 4, 18, 11, 8, 11, 8, 3, 5, 2, 4, 3, 3, 5, 6, 5, 3, 1, 2, 2, 0, 0,
    ],
  );
  var t;
}
function Oc(n, t, e) {
  const r = getPropertyNameByHash(n, t);
  if (!r) return "";
  const o = base64Encode(e),
    i = Array(o.length);
  for (let u = 0; u < o.length; u++) i[u] = o[u] ^ r.charCodeAt(u % r.length);
  return String.fromCharCode.apply(null, i);
}
function reshuffleStr(Strs, arr) {
  const e = Strs.join(""),
    r = e.split(""),
    res = Array(e.length);
  for (let i = 0; i < res.length; ++i) res[i] = r.splice(arr[i % arr.length], 1);
  return res.join("");
}
var get_encryted_obj_key = /*#__PURE__*/ _i(
  [
    [
      290799128, 256122120, 104421910, 67116302, 755371265, 505093152,
      152897830, 504707661, 470222364, 504898635, 1531393810, 35461445,
      285283613, 151395398, 386279171, 454440300, 1259148302, 67715140,
      117915663, 1445400833, 70599515, 280581, 270008841, 369435995, 272236574,
      119803980, 704973062, 135268614, 184563807, 1026755337, 824180753,
      521019142, 404440330, 1310525212, 689393240, 992889883, 118162967, 75079,
      371069214, 14400, 67440946, 336725549, 100928582, 419697754, 37884160,
      822483751, 151655985, 440867606, 34934535, 1544297499, 69023765,
      1530421525, 521022789, 352788490, 152182535, 1095068179, 168111383,
      102371362, 1379942426, 218301962, 410405200, 674697750, 150995736,
      1460669954, 289295192, 422585355, 276197185, 1241580055, 503401029,
      169544981, 956309037, 1628772625, 269702473, 1481182751, 12887, 860704273,
      607786827, 1079856400, 370150428, 234881091, 407897606, 354309752,
      1157892134, 252333381, 1264080656, 304025857, 1627786793, 302143352,
      172563473, 34688007, 17172047, 337261841, 285893380, 117845831,
      1448695310, 152569103, 1095068178, 68628788, 120395278, 352653340,
      1245924639, 288361223, 2951185, 3425555,
    ],
  ],
  [maybeGetEncKey],
  [1],
);
function get_encryted_obj_key0_() {
  return get_encryted_obj_key(0);
}
function jc() {
  const run_func_arg1 = function (n, t) {
    return n(t);
  },
    a_is_instanceof_b = function (n, t) {
      return n instanceof t;
    },
    equal = function (n, t) {
      return n === t;
    },
    run_func_arg1_ = function (n, t) {
      return n(t);
    };
  if (
    !(function (n, t) {
      return n in t;
    })(run_func_arg1(get_encryted_obj_key, 1), window)
  )
    return false; // false
  try {
    return (new window[run_func_arg1(get_encryted_obj_key, 1)](), true);
  } catch (o) {
    if (a_is_instanceof_b(o, Error) && equal(o.name, run_func_arg1_(get_encryted_obj_key, 2))) return false;
    throw o;
  }
}
async function Vc(n) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t) {
      return n(t);
    },
    r = function (n, t) {
      return n(t);
    },
    o = function (n, t) {
      return n !== t;
    },
    [i, u, c] = t(Mc, n);
  return o(u, 0)
    ? { n: i, l: u }
    : await new Promise((n) => {
      const o = function (n, t) {
        return e(n, t);
      };
      c[r(get_encryted_obj_key, 3)](
        (r) => {
          t(n, { n: i, l: r[e(get_encryted_obj_key, 4)] });
        },
        () => {
          o(n, { n: i, l: -1 });
        },
      );
    });
}
function Mc(n) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t, e) {
      return n(t, e);
    },
    r = function (n, t) {
      return n(t);
    },
    o = function (n, t) {
      return n(t);
    },
    i = function (n, t) {
      return n(t);
    },
    u = function (n, t) {
      return n(t);
    },
    c = function (n, t) {
      return n(t);
    },
    s = function (n, t) {
      return n(t);
    },
    a = function (n, t) {
      return n instanceof t;
    },
    l = function (n, t) {
      return n === t;
    },
    f = function (n, t) {
      return n(t);
    },
    d = function (n, t) {
      return n !== t;
    },
    m = function (n, t) {
      return n === t;
    },
    v = function (n, t) {
      return n(t);
    },
    h = function (n, t) {
      return n(t);
    },
    p = function (n, t) {
      return n === t;
    },
    g = function (n, t) {
      return n(t);
    };
  var w;
  const [y] = n.split("/").slice(-1),
    b = new window[t(get_encryted_obj_key, 1)](),
    E = e(getPropertyNameByHash, new window[t(get_encryted_obj_key, 5)]("")[r(get_encryted_obj_key, 6)](""), 3626513111),
    R = document[o(get_encryted_obj_key, 7)](E);
  R[t(get_encryted_obj_key, 8)] = i(get_encryted_obj_key, 3);
  const S = new window[u(get_encryted_obj_key, 9)]([], n, c(get_encryted_obj_key, 10));
  try {
    b[t(get_encryted_obj_key, 11)][s(get_encryted_obj_key, 12)](S);
  } catch (I) {
    if (
      a(I, Error) &&
      l(I.name, f(get_encryted_obj_key, 2)) &&
      convertToIUint8Array(
        l((w = I[i(get_encryted_obj_key, 13)]), null) || m(w, void 0)
          ? void 0
          : w.indexOf(c(get_encryted_obj_key, 14)),
        -1,
      )
    )
      return [y, -3, null];
    throw I;
  }
  return (
    (R[i(get_encryted_obj_key, 15)] = b[v(get_encryted_obj_key, 15)]),
    l(typeof R[h(get_encryted_obj_key, 16)], o(get_encryted_obj_key, 17))
      ? [y, -4, null]
      : p(R[g(get_encryted_obj_key, 16)].length, 0)
        ? [y, -2, null]
        : [y, 0, R[c(get_encryted_obj_key, 16)][0]]
  );
}
var Fc = /*#__PURE__*/ encrypted_msg_getter(
  [
    752472786, 243421427, 1304376727, 44907654, 246431386, 1168077535, 16463263,
    1619723729, 1257995473, 1606171802, 1236083594, 66480798, 250966748,
    1912304588,
  ],
  4,
);
async function s79_worker() {
  const runFunc = function (n) {
    return n();
  },
    runFunc_with1arg = function (n, t) {
      return n(t);
    },
    runFunc_with2arg = function (n, t, e) {
      return n(t, e);
    },
    runFunc_with2arg_ = function (n, t, e) {
      return n(t, e);
    },
    i = (function (n) {
      return n();
    })(get_encryted_obj_key0_);
  return i
    ? runFunc(jc)
      ? await runFunc_with2arg_(prepareRace, runFunc_with2arg(runCallbackWhenPageFocusedPromise, 350, { s: -2, v: null }), async () => ({
        s: 0,
        v: await Promise.all(i.map(Vc)),
      }))
      : await runFunc_with2arg_(prepareRace, runFunc_with2arg(runCallbackWhenPageFocusedPromise, 350, { s: -1, v: null }), async () => ({
        s: -1,
        v: await Promise.all([runFunc_with1arg(Dc, i[0])]),
      }))
    : await runFunc_with2arg(prepareRace, runFunc_with2arg(runCallbackWhenPageFocusedPromise, 350, { s: -3, v: null }), async () => ({
      s: -3,
      v: await Promise.all([runFunc(Dc)]),
    }));
}
async function Dc(n = Fc(0)) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t) {
      return n + t;
    },
    r = function (n, t) {
      return n + t;
    },
    o = function (n, t) {
      return n + t;
    },
    i = function (n, t) {
      return n(t);
    },
    u = function (n, t, e) {
      return n(t, e);
    },
    c = function (n, t) {
      return n === t;
    },
    s = function (n, t) {
      return n(t);
    },
    a = function (n, t) {
      return n === t;
    },
    l = function (n, t) {
      return n === t;
    };
  var f, d;
  const [m] = n.split("/").slice(-1);
  try {
    const v = new window[t(Fc, 1)]([], n),
      h = new window[t(Fc, 2)](
        e(
          r(
            r(e(e(o(i(Fc, 3), u(get_property_byHash_then_bind, v, 4081332993) || ""), ""), m), t(Fc, 4)),
            u(get_property_byHash_then_bind, v, 3034174415),
          ),
          "",
        ),
      );
    return c(
      c((f = u(get_property_byHash_then_bind, h, 3518522040)), null) || c(f, void 0)
        ? void 0
        : f.substring(1),
      "",
    )
      ? { n: m, l: -2 }
      : {
        n: m,
        l: s(
          getHash,
          a((d = u(get_property_byHash_then_bind, h, 3518522040)), null) || l(d, void 0)
            ? void 0
            : d.substring(1),
        ),
      };
  } catch (v) {
    return { n: m, l: -1 };
  }
}
function test_doNotTrack() {
  const equal = function (n, t) {
    return n === t;
  },
    doNotTrack = (function (n, t, e) {
      return n(t, e);
    })(get_property_byHash_then_bind, navigator, 3087401394); // doNotTrack
  return equal(doNotTrack, void 0) || equal(doNotTrack, null) ? { s: -1, v: null } : { s: 0, v: doNotTrack };
}
function test_wasm() {
  const run_func = function (n, t, e) {
    return n(t, e);
  },
    equal = function (n, t) {
      return n === t;
    },
    run_func_ = function (n, t, e) {
      return n(t, e);
    },
    WebAssembly = run_func(get_property_byHash_then_bind, window, 4177808745); // WebAssembly
  if (!(equal(WebAssembly, null) || equal(WebAssembly, void 0) ? void 0 : run_func(get_property_byHash_then_bind, WebAssembly, 1108488788))) // validate
    return { s: -1, v: null };
  const o = [0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10],
    i = [
      [
        9, 1, 7, 0, 65, 0, 253, 15, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3,
        1, 0, 0, // v128.const
      ],
      [
        240, 67, 0, 0, 0, 12, 1, 10, 0, 252, 2, 3, 1, 1, 0, 0, 110, 26, 11, 161,
        10, // ref.null extern
      ],
      [6, 1, 4, 0, 18, 0, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0, 0], // i32.eqz
      [
        8, 1, 6, 0, 65, 0, 192, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0,
        0, // i64.extend_i32_u
      ],
      [
        7, 1, 5, 0, 208, 112, 26, 11, 0, 10, 4, 110, 97, 109, 101, 2, 3, 1, 0,
        0, // f32.const
      ],
    ];
  let u = 0;
  for (const c of i) {
    ((u <<= 1), (u |= run_func_(get_property_byHash_then_bind, WebAssembly, 1108488788)(Uint8Array.of(...o, ...c)) ? 1 : 0));
    console.log(u);
  }
  return { s: 0, v: u };
}
function get_random_seq() {
  const sub = function (n, t) {
    return n - t;
  },
    mul = function (n, t) {
      return n * t;
    },
    ge_than = function (n, t) {
      return n >= t;
    },
    equal = function (n, t) {
      return n === t;
    },
    mod = function (n, t) {
      return n % t;
    },
    or = function (n, t) {
      return n | t;
    },
    pow = function (n, t) {
      return n ** t;
    },
    c = [];
  let s = Math.random();
  for (let a = sub(mul(6, 4096), 1); ge_than(a, 0); --a)
    if (equal(mod(a, 4096), 0)) {
      const e = Math.random();
      (c.push(or(mul(sub(s, e), pow(2, 31)), 0)), (s = e));
    }
  return { s: 0, v: c };
}
function get_devicePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio;
  return null == devicePixelRatio ? { s: -1, v: null } : { s: 0, v: devicePixelRatio };
}
function get_language_() {
  const n = navigator.language;
  return n ? { s: 0, v: n } : { s: -1, v: null };
}
function get_language_again() {
  const n = navigator.languages;
  return n ? { s: 0, v: n } : { s: -1, v: null };
}
async function getstorageQuota() {
  const run_2arg_func___ = function (n, t, e) {
    return n(t, e);
  },
    equal = function (n, t) {
      return n === t;
    },
    run_2arg_func = function (n, t, e) {
      return n(t, e);
    },
    run_2arg_func_ = function (n, t, e) {
      return n(t, e);
    },
    not_equal = function (n, t) {
      return n !== t;
    },
    equal_ = function (n, t) {
      return n === t;
    },
    run_2arg_func__ = function (n, t, e) {
      return n(t, e);
    },
    s = navigator,
    storage = run_2arg_func___(get_property_byHash_then_bind, s, 1417288500), // 'storage'
    webkitTemporaryStorage = run_2arg_func___(get_property_byHash_then_bind, s, 2706846255); // webkitTemporaryStorage
  if (!webkitTemporaryStorage && !(equal(storage, null) || equal(storage, void 0) ? void 0 : run_2arg_func(get_property_byHash_then_bind, storage, 3538568711)))// estimate
    return { s: -1, v: null };
  if (webkitTemporaryStorage) {
    const e = await Promise.race([
      run_2arg_func_(setTimeOutRun, 250, void 0),
      new Promise((n) => {
        run_2arg_func___(get_property_byHash_then_bind, webkitTemporaryStorage, 1291883197)((t, e) => n(e)); //queryUsageAndQuota
      }),
    ]);
    if (not_equal(e, void 0)) return { s: 0, v: e };
  }
  if (equal(storage, null) || equal_(storage, void 0) ? void 0 : run_2arg_func(get_property_byHash_then_bind, storage, 3538568711)) {// estimate
    const t = await Promise.race([
      run_2arg_func(setTimeOutRun, 250, void 0),
      run_2arg_func__(get_property_byHash_then_bind, storage, 3538568711)().then((n) => get_property_byHash_then_bind(n, 1813778413)), // quota
    ]);
    if (not_equal(t, void 0)) return { s: 1, v: t };
  }
  return { s: -2, v: null };
}
async function test_webkitRequestFileSystem_() {
  const run_func = function (n) {
    return n();
  },
    run_2arg_func = function (n, t, e) {
      return n(t, e);
    },
    equal = function (n, t) {
      return n === t;
    };
  if (
    (function (n) {
      return n();
    })(collectSomeKeys10_related_to_chrome) &&
    run_func(collectSomeKeys2_very_new_api)
  )
    return { s: -3, v: null };
  const o = await Promise.race([run_2arg_func(setTimeOutRun, 100, null), run_func(test_webkitRequestFileSystem)]);
  return equal(o, null)
    ? { s: -2, v: null }
    : equal(o, void 0)
      ? { s: -1, v: null }
      : { s: 0, v: o };
}
async function test_webkitRequestFileSystem() {
  const n = function (n, t, e, r, o) {
    return n(t, e, r, o);
  },
    webkitRequestFileSystem = (function (n, t, e) {
      return n(t, e);
    })(get_property_byHash_then_bind, window, 2796484463); // webkitRequestFileSystem
  if (webkitRequestFileSystem)
    return new Promise((e) => { // 尝试请求1byte空间
      n(
        webkitRequestFileSystem,
        0,
        1,
        () => e(true),
        () => e(false),
      );
    });
}
function getSandbox_Iframe_width_height(n) {
  return runActionInSandbox((n, t) => {
    const e = t.screen,
      r = (n) => {
        const t = parseInt(n);
        return "number" == typeof t && isNaN(t) ? -1 : t;
      };
    return { s: 0, v: { w: r(e.width), h: r(e.height) } };
  }, n.iframe_sandbox);
}
var indexDB_related_msg = /*#__PURE__*/ encrypted_msg_getter(
  [
    3924185679, 3632893699, 2980828376, 2699881398, 2597186493, 3081479162,
    2868636342, 4104912311, 2917654778, 3120294056, 3186092732, 3169643453,
    4210205690, 3086875321, 2867519889, 3068977853, 2897456556, 2783771306,
    3033247220, 4104908215, 3152862458, 2900426157, 2868628129, 2242641335,
  ],
  4,
);
function has_indexedDB() {
  const run_1arg_func = function (n, t) {
    return n(t);
  },
    run_1arg_func_ = function (n, t) {
      return n(t);
    };
  try {
    return run_1arg_func(fs, !!window[run_1arg_func(indexDB_related_msg, 0)]); // indexedDB
  } catch (e) {
    return run_1arg_func_(fs, true);
  }
}
function fs(n) {
  return { s: 0, v: n };
}
function test_indexDB() {
  const run_func = function (n) {
    return n();
  },
    runTwoArgFunc = function (n, t, e) {
      return n(t, e);
    };
  return runTwoArgFunc(prepareRace, runTwoArgFunc(runCallbackWhenPageFocusedPromise, 250, { s: -3, v: null }), async () =>
    run_func(collectSomeKeys6_related_to_Apple) || run_func(collectSomeKeys1_related_to_firefox) ? run_func(testIndexDB) : { s: -1, v: null },
  );
}
async function testIndexDB() {
  const run_2arg_func = function (n, t, e) {
    return n(t, e);
  },
    run_2arg_func_ = function (n, t, e) {
      return n(t, e);
    },
    run_1arg_func = function (n, t) {
      return n(t);
    },
    run_1arg_func_ = function (n, t) {
      return n(t);
    },
    a_is_insof_b = function (n, t) {
      return n instanceof t;
    },
    run_1arg_func__ = function (n, t) {
      return n(t);
    },
    run_2arg_func__ = function (n, t, e) {
      return n(t, e);
    },
    run_1arg_func_________ = function (n, t) {
      return n(t);
    },
    run_2arg_func___ = function (n, t, e) {
      return n(t, e);
    },
    run_1arg_func___ = function (n, t) {
      return n(t);
    },
    run_func = function (n) {
      return n();
    },
    equal = function (n, t) {
      return n === t;
    },
    run_1arg_func____ = function (n, t) {
      return n(t);
    },
    run_1arg_func_____ = function (n, t) {
      return n(t);
    },
    run_1arg_func______ = function (n, t) {
      return n(t);
    },
    add = function (n, t) {
      return n + t;
    },
    add_ = function (n, t) {
      return n + t;
    },
    run_1arg_func_______ = function (n, t) {
      return n(t);
    },
    indexedDB = window[run_1arg_func___(indexDB_related_msg, 0)]; // indexedDB
  if (!indexedDB) return { s: -2, v: null };
  const aRandomStr = add(add_("", run_1arg_func_______(genRandomStrWrapper, 16)), "");
  return new Promise((resolve, reject) => {
    const _run_1arg_func_________ = function (n, t) {
      return run_1arg_func_________(n, t);
    };
    try {
      const indexDB_open = run_2arg_func___(get_property_byHash_then_bind, indexedDB, 2758837156)(aRandomStr, 1);
      ((indexDB_open[run_1arg_func___(indexDB_related_msg, 1)] = () => { // onerror
        _run_1arg_func_________(resolve, { s: -5, v: null });
      }),
        (indexDB_open[run_1arg_func(indexDB_related_msg, 2)] = (c) => { // onupgradeneeded
          const s = run_2arg_func(get_property_byHash_then_bind, run_2arg_func(get_property_byHash_then_bind, c, 1181691900), 325763347);
          try {
            return (
              run_2arg_func(
                get_property_byHash_then_bind,
                run_2arg_func_(get_property_byHash_then_bind, s, 138212912)("-", run_1arg_func(indexDB_related_msg, 3)),
                2928708052,
              )(new window[run_1arg_func_(indexDB_related_msg, 4)]()),// Blob
              void run_1arg_func_(resolve, { s: 0, v: "" })
            );
          } catch (a) {
            if (a_is_insof_b(a, Error))
              return void run_1arg_func__(resolve, { s: 0, v: run_2arg_func__(get_property_byHash_then_bind, a, 3065852031) });
            run_1arg_func_(reject, a);
          } finally {
            (run_2arg_func(get_property_byHash_then_bind, s, 318865860)(), run_2arg_func__(get_property_byHash_then_bind, indexedDB, 3885781331)(aRandomStr));
          }
        }));
    } catch (b) {
      if (!run_func(collectSomeKeys6_related_to_Apple)) return void run_1arg_func__(resolve, { s: -5, v: null });
      if (a_is_insof_b(b, Error) && equal(b.name, convertToIUint8Array(indexDB_related_msg, 5))) // SecurityError
        return void run_1arg_func_____(resolve, { s: -4, v: null });
      run_1arg_func______(reject, b);
    }
  });
}
function check_no_storage() {
  const run_func = function (n) {
    return n();
  },
    run_2arg_func = function (n, t, e) {
      return n(t, e);
    },
    run_2arg_func_ = function (n, t, e) {
      return n(t, e);
    },
    run_4arg_func = function (n, t, e, r, o) {
      return n(t, e, r, o);
    },
    a_test = "test";
  if (!run_func(collectSomeKeys6_related_to_Apple) || run_func(collectSomeKeys5_maybe_new_api)) return { s: -1, v: null };
  const i = run_2arg_func(get_property_byHash_then_bind, window, 693717494), // not found in windows-chrome
    localStorage = run_2arg_func_(get_property_byHash_then_bind, window, 1703339950); // localStorage
  try {
    run_4arg_func(i, null, null, null, null);
  } catch (c) {
    return { s: 0, v: true };
  }
  try {
    return (
      run_2arg_func_(get_property_byHash_then_bind, localStorage, 2330630162)(a_test, "1"), // setItem
      run_2arg_func_(get_property_byHash_then_bind, localStorage, 588657539)(a_test), // removeItem
      { s: 0, v: false }
    );
  } catch (s) {
    return { s: 0, v: true };
  }
}
function test_system_color(n) {
  return runActionInSandbox((n, window) => {
    const e = {},
      testDiv = window.document.createElement("div");
    window.document.body.appendChild(testDiv);
    const style_keys = {
      AccentColor: "ac",
      AccentColorText: "act",
      ActiveText: "at",
      ActiveBorder: "ab",
      ActiveCaption: "aca",
      AppWorkspace: "aw",
      Background: "b",
      ButtonHighlight: "bh",
      ButtonShadow: "bs",
      ButtonBorder: "bb",
      ButtonFace: "bf",
      ButtonText: "bt",
      FieldText: "ft",
      GrayText: "gt",
      Highlight: "h",
      HighlightText: "ht",
      InactiveBorder: "ib",
      InactiveCaption: "ic",
      InactiveCaptionText: "ict",
      InfoBackground: "ib",
      InfoText: "it",
      LinkText: "lt",
      Mark: "m",
      Menu: "me",
      Scrollbar: "s",
      ThreeDDarkShadow: "tdds",
      ThreeDFace: "tdf",
      ThreeDHighlight: "tdh",
      ThreeDLightShadow: "tdls",
      ThreeDShadow: "tds",
      VisitedText: "vt",
      Window: "w",
      WindowFrame: "wf",
      WindowText: "wt",
      Selecteditem: "si",
      Selecteditemtext: "sit",
    };
    for (const u of Object.keys(style_keys)) {
      e[style_keys[u]] = ((i = u), (testDiv.style.color = i), window.getComputedStyle(testDiv).color);
    }
    var i;
    return (window.document.body.removeChild(testDiv), { s: 0, v: e });
  }, n.iframe_sandbox);
}
function get_size_and_font(n, t) {
  const e = {},
    r = ["x", "y", "left", "right", "bottom", "height", "top", "width"],
    o = n.getBoundingClientRect();
  for (const u of r) u in o && (e[u] = o[u]);
  const i = t.getComputedStyle(n, null).getPropertyValue("font-family");
  return ((e.font = i), e);
}
function test_emoji(n) {
  let t = "";
  for (let e = 128512; e <= 128591; e++) {
    const n = String.fromCodePoint(e); // emoji
    t += n;
  }
  return runActionInSandbox((n, e) => {
    const testSpan = e.document.createElement("span");
    ((testSpan.style.whiteSpace = "nowrap"),
      (testSpan.innerText = t),
      e.document.body.append(testSpan));
    const o = get_size_and_font(testSpan, e);
    return (e.document.body.removeChild(testSpan), { s: 0, v: o });
  }, n.iframe_sandbox);
}
function test_mathML(n) {
  let t = "<mrow><munderover><mmultiscripts><mo>∏</mo>";
  const e = [
    ["𝔈", "υ", "τ", "ρ", "σ"],
    ["𝔇", "π", "ο", "ν", "ξ"],
    ["𝔄", "δ", "γ", "α", "β"],
    ["𝔅", "θ", "η", "ε", "ζ"],
    ["𝔉", "ω", "ψ", "ϕ", "χ"],
    ["ℭ", "μ", "λ", "ι", "κ"],
  ];
  function r(n, t, e, r, o) {
    return `<mmultiscripts><mi>${n}</mi><mi>${t}</mi><mi>${e}</mi><mprescripts></mprescripts><mi>${r}</mi><mi>${o}</mi></mmultiscripts>`;
  }
  for (const o of e) {
    const n = r(...o);
    t += n;
  }
  return (
    (t += "</munderover></mrow>"),
    runActionInSandbox((n, e) => {
      const r = e.document.createElement("math");
      ((r.style.whiteSpace = "nowrap"),
        (r.innerHTML = t),
        e.document.body.append(r));
      const o = get_size_and_font(r, e);
      return (e.document.body.removeChild(r), { s: 0, v: o });
    }, n.iframe_sandbox)
  );
}
var encrypted_msg_getter_ = /*#__PURE__*/ encrypted_msg_getter(
  [
    2849665133, 3102332852, 3030028940, 2360597915, 3649086422, 4118989755,
    2159729800, 2492790230, 3150617845, 3422263962, 3398214861, 3000338617,
    2163578059, 3720000219, 2782764965, 3422263962, 3600523980, 2895432685,
    2292567243, 3617170646, 3986333093, 2578762955, 2596645530, 2227996313,
    2259142812, 3700204490, 3100285842, 3422263963, 3903489002, 2496302258,
    2360989318, 3615531995, 4120169401, 2192956830, 3971720145, 3000875412,
    2277047195, 3431641814, 4124477118, 2273483461, 3481713107, 2781523129,
    3321219718, 3599275162, 4157376185, 2293418634, 3418993356, 3067464120,
    3120021895, 4221285085, 3000403896, 2260651146, 2496373974, 3051664885,
    2293418634, 3735466700, 2345307313, 3287931573, 3669330832, 3151268020,
    2192890251, 2525727716, 3051664893, 3382957959, 3448764377, 3201075897,
    3045840518, 3837111258, 2966063285, 2276644252, 3402212556, 3201145010,
    3048463771, 2462561764, 2816128395, 2359614875, 3837109206, 4221223093,
    2209732555, 2594026717, 2782776315, 2862995355, 2592912343, 2781727739,
    3422263941, 3683431633, 3202123702, 2359548301, 3617301981, 4120169381,
    2595804298, 2496377821, 3100936949, 2257903002, 3683432918, 3117908131,
    2331350219, 3431510730, 2748951986, 2294283144, 3565992406, 2564589462,
    2612190863, 3687578522, 2999682747, 2277103530, 3516773597, 3220146104,
    2625885836, 3601643978, 2325387955,
  ],
  3,
);
async function ia({ te: te }) {
  console.log(te)
  const runFunc = function (n) {
    return n();
  },
    equal = function (n, t) {
      return n === t;
    },
    two_arg_runner = function (func, t, e) {
      return func(t, e);
    },
    serial = runFunc(get_random_serial_str),
    u = await two_arg_runner(prepareRace, two_arg_runner(runCallbackWhenPageFocusedPromise, 300, -4), ua.bind(null, serial, te));
  return () => {
    const n = runFunc(u);
    return equal(n, 0) || equal(n, -4)
      ? { s: n, v: { u: serial, e: [], s: [] } }
      : { s: n, v: null };
  };
}
async function ua(serial, tls_endpoint) {
  const two_arg_runner__local = function (n, t, e) {
    return n(t, e);
  },
    not_eq_local = function (n, t) {
      return n !== t;
    },
    two_arg_runnerlocal = function (n, t, e) {
      return n(t, e);
    },
    two_arg_runner_local = function (n, t, e) {
      return n(t, e);
    },
    u = two_arg_runner__local(ca, serial, tls_endpoint),
    { s: c, v: s } = two_arg_runner__local(la, u, true);
  if (not_eq_local(c, 0)) return c;
  const a = two_arg_runner__local(ha, s, tls_endpoint);
  try {
    const { s: n, v: t } = await two_arg_runner__local(get_property_byHash_then_bind, a, 142982734)();
    return not_eq_local(n, 0) ? n : (await two_arg_runner__local(get_property_byHash_then_bind, s, 76151562)(t), 0);
  } finally {
    two_arg_runner_local(get_property_byHash_then_bind, a, 107910612)();
  }
}
function ca(serial, tls_endpoint) {
  const run_1arg_func = function (n, t) {
    return n(t);
  },
    run_1arg_func_ = function (n, t) {
      return n(t);
    },
    run_1arg_func__ = function (n, t) {
      return n(t);
    },
    credential = (function (n, t) {
      return n(t);
    })(encrypted_msg_getter_, 0);
  // enc_result
  // credential 0
  // urls 1
  // username 2
  // iceServers 3
  // turn: 4
  // transport 5
  ((credential[run_1arg_func(encrypted_msg_getter_, 1)] = run_1arg_func_(sa, tls_endpoint)), (credential[run_1arg_func__(encrypted_msg_getter_, 2)] = serial));
  const u = {};
  return ((u[run_1arg_func_(encrypted_msg_getter_, 3)] = [credential]), u);
}
function sa(tls_endpoint) {
  const add = function (n, t) {
    return n + t;
  },
    run_1arg_func = function (n, t) {
      return n(t);
    },
    run_2arg_func = function (n, t, e) {
      return n(t, e);
    };
  return add(add(run_1arg_func(encrypted_msg_getter_, 4), run_2arg_func(Sr, tls_endpoint, run_1arg_func(encrypted_msg_getter_, 5))), "");
}
const _NotSupportedError = /*#__PURE__*/ encrypted_msg_getter_(6); // NotSupportedError
function la(n, t) {
  const e = function (n, t) {
    return n(t);
  },
    r = function (n, t) {
      return n(t);
    },
    o = function (n, t) {
      return n instanceof t;
    },
    i = function (n, t) {
      return n === t;
    },
    u = t
      ? window[
      (function (n, t) {
        return n(t);
      })(encrypted_msg_getter_, 7)
      ] || window[e(encrypted_msg_getter_, 8)]
      : window[r(encrypted_msg_getter_, 7)];
  if (!u) return { s: -3, v: null };
  let c;
  try {
    c = new u(n);
  } catch (s) {
    if (o(s, Error)) {
      if (i(s.name, _NotSupportedError)) return { s: -6, v: null };
      if (e(da, s)) return { s: -9, v: null };
    }
    throw s;
  }
  return { s: 0, v: c };
}
function fa(n, t) {
  const e = function (n, t) {
    return n === t;
  },
    r = function (n, t, e) {
      return n(t, e);
    },
    o = function (n, t) {
      return n === t;
    },
    i = function (n, t) {
      return n instanceof t;
    };
  var u;
  try {
    return (
      e((u = r(get_property_byHash_then_bind, n, 34843658)), null) ||
      o(u, void 0) ||
      u.call(n, t || Math.random().toString()),
      0
    );
  } catch (c) {
    if (i(c, Error) && o(c.name, _NotSupportedError)) return -7;
    throw c;
  }
}
function da(n) {
  const t = function (n, t) {
    return n(t);
  },
    e = function (n, t, e) {
      return n(t, e);
    };
  return (
    (function (n, t) {
      return n === t;
    })(n.name, t(encrypted_msg_getter_, 9)) &&
    e(get_property_byHash_then_bind, new RegExp(t(encrypted_msg_getter_, 10)), 3632233996)(e(get_property_byHash_then_bind, n, 3065852031))
  );
}
function ma(n) {
  const t = function (n, t, e) {
    return n(t, e);
  };
  try {
    t(get_property_byHash_then_bind, n, 318865860)();
  } catch (e) { }
}
async function va(n, t) {
  const e = function (n, t, e) {
    return n(t, e);
  },
    r = function (n, t) {
      return n instanceof t;
    },
    o = function (n, t, e) {
      return n(t, e);
    },
    i = function (n, t) {
      return n(t);
    },
    u = function (n, t) {
      return n === t;
    };
  let c;
  try {
    c = e(get_property_byHash_then_bind, n, 882066760)(t);
  } catch (a) {
    if (
      !r(a, Error) ||
      !o(get_property_byHash_then_bind, new RegExp(i(encrypted_msg_getter_, 11), "i"), 3632233996)(o(get_property_byHash_then_bind, a, 3065852031))
    )
      throw a;
    c = new Promise((r, o) => {
      e(get_property_byHash_then_bind, n, 882066760)(r, o, t);
    });
  }
  const s = await c;
  return u(s, void 0) ? { s: -8, v: null } : { s: 0, v: s };
}
function ha(n, t) {
  const r = function (n, t) {
    return n(t);
  },
    o = function (n, t) {
      return n === t;
    },
    i = function (n, t, e) {
      return n(t, e);
    },
    u = function (n, t, e) {
      return n(t, e);
    },
    c = function (n, t) {
      return n === t;
    },
    s = function (n, t) {
      return n(t);
    },
    a = function (n, t) {
      return n !== t;
    },
    l = function (n, t) {
      return n in t;
    },
    f = function (n, t) {
      return n(t);
    },
    d = function (n, t) {
      return n in t;
    },
    m = function (n, t, e) {
      return n(t, e);
    },
    v = function (n) {
      return n();
    },
    h = function (n, t) {
      return n === t;
    },
    p = function (n, t, e) {
      return n(t, e);
    },
    g = function (n, t) {
      return n(t);
    },
    w = function (n, t, e, r) {
      return n(t, e, r);
    },
    y = function (n, t) {
      return n(t);
    },
    b = function (n, t) {
      return n !== t;
    },
    E = function (n, t) {
      return n !== t;
    },
    R = function (n, t, e) {
      return n(t, e);
    },
    S = function (n, t) {
      return n(t);
    },
    I = function (n, t, e) {
      return n(t, e);
    };
  function k(n, t) {
    return (
      r(A, n) &&
      o(i(get_property_byHash_then_bind, n, 3920415024), 400) &&
      u(get_property_byHash_then_bind, n, 4101391790).includes(t)
    );
  }
  function A(n) {
    return (
      c(typeof n, s(encrypted_msg_getter_, 12)) && a(n, null) && l(f(encrypted_msg_getter_, 13), n) && convertToIUint8Array(s(encrypted_msg_getter_, 14), n)
    );
  }
  let L = null,
    C = false;
  async function P() {
    const t = r(fa, n);
    if (b(t, 0)) return { s: t, v: null };
    const { s: e, v: o } = await r(va, n);
    return E(e, 0) ? { s: e, v: null } : { s: 0, v: o };
  }
  t &&
    (function (n, t, e) {
      return n(t, e);
    })(
      get_property_byHash_then_bind,
      n,
      123626528,
    )(S(encrypted_msg_getter_, 15), (e) => {
      m(k, e, t) && (L ? (v(L), (L = null), r(ma, n)) : (C = true));
    });
  const T = {
    [y(encrypted_msg_getter_, 17)]: () => ma(n),
    [r(encrypted_msg_getter_, 18)]: async () => {
      const t = await v(P);
      return (b(R(get_property_byHash_then_bind, t, 453955339), 0) && r(ma, n), t);
    },
  };
  return t
    ? I(
      get_property_byHash_then_bind,
      Object,
      1914874273,
    )(T, {
      [f(encrypted_msg_getter_, 19)]: function () {
        h(p(get_property_byHash_then_bind, n, 4184312542), g(encrypted_msg_getter_, 16)) ||
          (C ? y(ma, n) : (L = w(runCallbackWhenPageFocused, ma, 5e3, n)));
      },
    })
    : T;
}
var get_enc_msg_for_s95 = /*#__PURE__*/ _i(
  [
    [
      1158230590, 352328197, 922751784, 234887733, 1045777409, 235013451,
      1077693209, 86185296, 321396490, 462366, 488115742, 1213075980, 4402479,
      184943903, 188551425, 1398147351, 268897603, 491523647, 306988571,
      1261376568, 269223502, 570890009, 34866732, 470426899, 403966778,
      253756433, 304419089, 491347009, 508233756, 403654977, 421396492,
      1329803025, 184551506, 1057755406, 136120322, 118163754, 373378420,
      453843998, 1159464460, 319444544, 855642889, 402851378, 1191248155,
      151015493, 219352090, 67375366, 17696018, 1263095066, 420348421, 21908811,
      168961297, 171640095, 14413,
    ],
  ],
  [
    function () {
      const n = new Image().style;
      return reshuffleStr(
        [getPropertyNameByHash((t = n), 2487676862), getPropertyNameByHash(t, 41374024)],
        [
          5, 23, 47, 9, 35, 9, 44, 7, 37, 41, 19, 25, 32, 26, 30, 32, 8, 31, 12,
          15, 40, 18, 15, 20, 9, 4, 2, 13, 21, 17, 18, 34, 40, 2, 48,
        ],
      );
      var t;
    },
  ],
  [2],
);
async function ga() {
  const run1arg_func = function (n, t) {
    return n(t);
  },
    run1arg_func_ = function (n, t) {
      return n(t);
    },
    run1arg_func__ = function (n, t, e) {
      return n(t, e);
    },
    less = function (n, t) {
      return n < t;
    },
    run2arg_func = function (n, t, e) {
      return n(t, e);
    },
    sub = function (n, t) {
      return n - t;
    };
  if (
    (function (n) {
      return n();
    })(collectSomeKeys4_related_to_modern_api)
  )
    return [-1, NaN];
  const u = new Uint8Array([0]),
    c = run1arg_func(get_enc_msg_for_s95, 0),
    s = await navigator[run1arg_func_(get_enc_msg_for_s95, 1)](run1arg_func_(get_enc_msg_for_s95, 2), c),
    a = await s[run1arg_func_(get_enc_msg_for_s95, 3)]();
  let l = await run1arg_func__(ya, a, u);
  const f = less(l, 10);
  if (f) {
    const n = sub(sub(run2arg_func(Wt, 10, 2500), l), 1);
    for (let t = 0; less(t, n); t++) run2arg_func(ba, a, u);
    l = await run2arg_func(ya, a, u);
  }
  return [f ? 1 : 0, l];
}
function wa() {
  const run1arg_func = function (n, t) {
    return n(t);
  };
  return (function (n, t) {
    return n == t;
  })(
    typeof navigator[
    (function (n, t) {
      return n(t);
    })(get_enc_msg_for_s95, 1)
    ],
    run1arg_func(get_enc_msg_for_s95, 4),
  );
}
async function ya(n, t) {
  const e = function (n, t) {
    return n(t);
  },
    r = function (n, t) {
      return n(t);
    },
    o = n[e(get_enc_msg_for_s95, 5)]();
  return (await o[r(get_enc_msg_for_s95, 6)](e(get_enc_msg_for_s95, 7), t), r(Number, o[r(get_enc_msg_for_s95, 8)]));
}
function ba(n, t) {
  const e = function (n, t) {
    return n(t);
  };
  (function (n, t) {
    n(t);
  })(
    addEmptyErrHandle,
    n[
      (function (n, t) {
        return n(t);
      })(get_enc_msg_for_s95, 5)
    ]()[e(get_enc_msg_for_s95, 6)](e(get_enc_msg_for_s95, 7), t),
  );
}
async function s95_worker() {
  const runFunc = function (n) {
    return n();
  },
    equal = function (n, t) {
      return n === t;
    },
    run2arg_func = function (n, t, e) {
      return n(t, e);
    },
    run2arg_func_ = function (n, t, e) {
      return n(t, e);
    };
  return (function (n) {
    return n();
  })(wa)
    ? run2arg_func(prepareRace, run2arg_func_(runCallbackWhenPageFocusedPromise, 500, { s: -2, v: null }), async () => {
      const e = await runFunc(ga);
      return equal(e[0], -1) ? { s: -3, v: null } : { s: 0, v: e };
    })
    : () => ({ s: -1, v: null });
}
var Ra = /*#__PURE__*/ _i(
  [
    [
      89472536, 67911963, 202988290, 386077465, 1866537770, 1224742518,
      488243476, 419627011, 184819487, 437598027, 340225859, 172033032,
      437716482, 471155211, 1095068177, 1092107040, 419499526, 423762697,
      100665116, 490210839, 1194790674, 673115, 85280006, 1510540548, 2756129,
      939992591, 1246643516, 1108281098, 52370449, 641031181, 822350097,
      201595136, 1447512348, 1107565334, 605101077, 923815180, 201460231,
      369557787, 421401919, 370608902, 386208007, 1158809130, 67652933,
      420829977, 1325996060, 705104933, 100734005, 18485518, 1079117841,
      520555597, 117716299, 441132557, 117836552, 454886414, 1079380231,
      235285315, 167851373, 438045445, 354104902, 218503945, 1450723136,
      1261309460, 853525, 339100932, 1443038736, 103498560, 3566862, 1175192861,
      252709131, 16777237, 1984516105, 1829509143, 185926151, 436356353,
      185073670, 1779174662, 991969605, 50610456, 1275666182, 419565839,
      202771726, 1124408096, 135546735, 168313092, 253563142, 135813653,
      822480166, 72178038, 222758157, 52298251, 454823449, 56244746, 1427123716,
      67914571, 353589766, 51775754, 625419022, 219166498, 1258491144,
      521093188, 151601409, 456523793, 678234648, 169481234, 118557701,
      391005526, 241568771, 422784012, 438716682, 1309089280, 806492, 990010373,
      638390299, 134885451, 1481180934, 17176407, 655231834, 2049314574,
      84410418, 220531716, 167778574, 105923661, 106502459, 185600556,
      170279180, 1046087172, 151977997, 35061763, 1263338788, 84282176,
      52366156, 1544356616, 420816433, 50605842, 1229146882, 1511529224,
      186319630, 4664589, 35268139, 100748290, 1379942427, 1174536207,
      322636309, 208471067, 373756952, 7684, 1481509910, 69665358, 440083533,
      1174866696, 403505177, 1129127711, 956961098, 571674714, 285606663,
      67257606, 151460637, 725827670, 862785030, 168106503, 289803037,
      203297033, 1197361671, 1327110967, 169477163, 84548876, 1840656,
      1325404447, 537919532, 1158350651, 118114894, 454640143, 269026054,
      471146315, 372321280, 1196229131, 421140297, 17891399, 256321038,
      167983925, 135074069, 1379942427, 1174536207, 523897886, 187303186,
      16788313, 1007685120, 1447054106, 1193610767, 121055758, 235738112,
      118572573, 1091181577, 956569372, 1632457991, 1191843846, 387122178,
      420174362, 755830297, 929124171, 222888474, 50727960, 118447621,
      1229986830, 202905462, 51517293, 1159661069, 219156518, 1296957445,
      772541034, 285869946, 471598093, 437591628, 102564608, 341211207,
      72035854, 453396244, 286989059, 252909895, 100927823, 207059041,
      440798984, 347163, 218169348, 389222492, 3416153, 1128989210, 404424777,
      102242906, 1193875213, 338048784, 17827353, 1077939469, 33558354,
      973080134, 923734551, 118361931, 390678349, 407312666, 756351505,
      606227719, 1078676741, 1275397643, 369236248, 102176796, 152328767,
      505090338, 1195966464, 68884054, 402849858, 604117287, 387586598,
      184555596, 52366851, 290079565, 39467274, 337061379, 1044450054,
      822546697, 1309087752, 202009165, 100891182, 1259996933, 521093188,
      51986689, 390009692, 187041819, 1296385283, 1528366088, 1539, 1194856717,
      20458516, 188762957, 374080774, 100861208, 604249353, 906778884,
      134487574, 1444022019, 51205721, 688201243, 275581722, 638910490,
      553654793, 438246915, 1191185666, 68310648, 100862061, 1157897218,
      203233559, 1296957442, 1829962602, 35198010, 17122832, 1079118092,
      101515597, 370942795, 117714965, 54019863, 889585674, 1079385113,
      386672195, 236790637, 420024595, 406539288, 689707789, 956765442,
      1198474037, 1091441944, 102564636, 119409668, 205263381, 108670990,
      151781382, 1313753605, 457245696, 855645709, 391058950, 235019008,
      471534109, 474699863, 756351517, 540018203, 272974679, 51463965,
      386470914, 67506497, 1297423660, 1224806753, 520230941, 878058775,
      289625664, 571801658, 289411104, 88480259, 1641997, 388317194, 1477786881,
      50998065, 521022728, 202398474, 33949981, 1095115776, 1582986863,
      239750725, 289150477, 469830174, 14416,
    ],
  ],
  [maybeGetEncKey],
  [2],
);
function Ra_0() {
  return Ra(0);
}
async function Ia() {
  const run_func = function (n, t) {
    return n(t);
  },
    t = (function (n) {
      return n();
    })(Ra_0),
    e = await Promise.all(t.map(ka)),
    r = {};
  return (
    t.forEach((t, o) => {
      const i = run_func(getHash, t).toString(16);
      r[i] = e[o];
    }),
    r
  );
}
function ka(ra_0) {
  const add = function (n, t) {
    return n + t;
  },
    add_ = function (n, t) {
      return n + t;
    },
    run_arg1_func = function (n, t) {
      return n(t);
    },
    run_arg1_func_ = function (n, t) {
      return n(t);
    },
    run_arg1_func__ = function (n, t) {
      return n(t);
    },
    not_equal = function (n, t) {
      return n !== t;
    },
    run_arg1_func___ = function (n, t) {
      return n(t);
    };
  return new Promise((s) => {
    const a = add(add_(run_arg1_func(Ra, 1), ra_0), run_arg1_func_(Ra, 2));
    try {
      const [, n, t] = run_arg1_func__(Mc, a);
      if (not_equal(n, 0)) return void run_arg1_func___(s, n);
      t[run_arg1_func(Ra, 3)](
        () => s(0),
        () => s(-1),
      );
    } catch (l) {
      run_arg1_func___(s, -2);
    }
  });
}
async function s97_worker() {
  const run_func_ = function (n) {
    return n();
  },
    run_func = function (n) {
      return n();
    },
    run2arg_func = function (n, t, e) {
      return n(t, e);
    };
  return await run2arg_func(prepareRace, run2arg_func(runCallbackWhenPageFocusedPromise, 500, { s: -2, v: null }), async () =>
    run_func_(Ra_0)
      ? run_func_(jc)
        ? { s: 0, v: await run_func(Ia) }
        : { s: -1, v: null }
      : { s: -3, v: null },
  );
}
function get_serviceWorker() {
  return { s: 0, v: "serviceWorker" in Navigator.prototype };
}
function get_isSecureContext() {
  return { s: 0, v: Boolean(window.isSecureContext) };
}
var get_s70_related_msg = /*#__PURE__*/ _i(
  [
    [
      37637135, 1447917654, 1074862848, 221320987, 185417728, 1279479069,
      287641348, 1585126709, 277761, 1427768864, 1124076042, 2035529, 455018507,
      23675461, 120393521, 1444036433, 1141263183, 303105822, 319645969,
      1275726848, 36457547, 388709920, 101924677, 1077349638, 303367169,
      135938595, 1112349448, 153357637, 121505586, 1480802129, 1141246529,
      839976462, 805901, 167780891, 1160643090, 438979704, 100941378,
      1381385537, 33619995, 505875729, 119147817, 153229835, 20323964,
      453520970, 1308901389, 134224668, 324158218, 140184588, 136785483,
      455937847, 1145648204, 1494293834, 320544012, 1971969, 319380746,
      359333889, 104340027, 1544500554, 1141003010, 1209157132, 67441480,
      1511480093, 104666369, 1328827942, 1075133262, 152198427, 149830,
      1477446935, 1427587336, 1194921745, 1547195181, 353853786, 470698257,
      1510890510, 1159481353, 521949703, 526588437, 192026238, 239739657,
      442307401, 256466199, 1481069662, 1091916807, 191889498, 175708721,
      1578723163, 1142444571, 403526171, 474109016, 436863826, 1513165895,
      1227047982, 1410678607, 1310151680, 1326799388, 156435474, 491723532,
      153230682, 91688828, 286089482, 471550231, 1511481182, 945321480,
      218765652, 526583891, 1131496748, 1561928206, 1498942025, 241044293,
      373446478, 340072261, 510001485, 1114971518, 789340426, 1464415314,
      121639178, 474109261, 339869763, 510074189, 1131496749, 1561862926,
      1482164809, 241043525, 373445966, 1430675269, 981021962, 289151081,
      206126103, 1314788169, 308153156, 524440649, 373424195, 493296973,
      1131496750, 1562058766, 290982473, 974735686, 324366422, 140184588,
      1466392143, 1131765368, 286482698, 1325800471, 394831, 169369099,
      54987290, 657872206, 120986675, 1565553235, 1209411907, 253564417,
      1280836866, 470686025, 237312859, 522912050, 201357853, 1141003025,
      1511147020, 386751269, 1310132765, 292225025, 270091815, 865110,
      1465648906, 67108874, 184644125, 1192692237, 309397319, 1601199207,
      404362525, 1330912518, 34669650, 1212173143, 1113211225, 1316896855,
      104596079, 39597315, 1195772422, 1364869959, 1430658377, 184767552,
      1513967123, 321592373, 1510961754, 218960155, 420305921, 1258684700,
      1108743697, 506609673, 1547125293, 1478042203, 1494042381, 1327128087,
      1225806877, 387334407, 191907615, 108599857, 101923614, 291246082,
      1381515331, 1447304521, 1514364485, 1348950091, 1165318776, 1145925391,
      391666511, 1465401923, 1413749065, 1497586757, 1348951883, 1081432952,
      1129147407, 374889295, 1364738371, 1346640201, 1531141957, 1549950795,
      1378683704, 100689750, 151848977, 420305920, 474366537, 1073758992,
      140973855, 1579227002, 219771980, 1499072079, 391076631, 390618884,
      475275347, 337911369, 489691709, 454256461, 1207961623, 6036480,
      1329684253, 1510738463, 1010648577, 791688480, 1565554302, 1431968600,
      236390922, 1477205770, 1258697756, 359674705, 2890289, 1326676557,
      1393764638, 1225000704, 625476693, 167839243, 1328283662, 75056996,
      121710658, 1276451417, 319888927, 386887006, 1176443398, 661342039,
      372705078, 1543910474, 1465139282, 357826574, 487414111, 186456605,
      1529830456, 1282104626, 101128728, 1142492674, 122947073, 370019595,
      559220289, 661996366, 322568504, 437138263, 22894923, 1427576601, 1725955,
      1907229, 523115079, 388700960, 67910512, 1432095759, 139985219, 487414091,
      469762058, 443565827, 293290614, 16209, 1326529286, 822482699, 151870732,
      1275724032, 238767179, 456461092, 1480802125, 1426131009, 441995264,
      152915527, 167780869, 1165052930, 389480762, 1447896833, 1074862848,
      69211931, 387799325, 1279479052, 70125060, 388696895, 1447917639,
      1075187217, 236586839, 1229602839, 993994827, 322112307, 658250785,
      285621072, 1968588097, 874523178, 657942583, 657137952, 1265183017,
      571878774, 656737658, 56118071, 336660254, 1195642624, 436608286,
      523123202, 388700960, 390297089, 1427442705, 202711306, 386744597,
      1276396363, 556535562, 388825661, 1448835153, 1393888269, 1124073738,
      105513240, 437127707, 153234434, 489367856, 1480796758, 1427181121,
      85596973, 268918562, 386802457, 1161763592, 3820664, 286604102,
      1443954741, 39214669, 285820951, 135933196, 1161366273, 171461752,
      1480796497, 1965894465, 824910122, 540507936, 723659301, 1265187369,
      654911862, 302460769, 1377901318, 1125192974, 725421897, 1008740640,
      1164397610, 1059916595, 286337602, 1326791431, 1297487624, 286088775,
      458048331, 388629257, 293290614, 16209, 1140930566, 69667613, 507776785,
      504765259, 1165052930, 389285664, 419442256, 56118035, 251731212,
      1464995601, 223167252, 321198856, 595280502, 758325110, 1915829052,
      606223904, 642384199, 825638694, 1158167604, 455756920, 1480802137,
      1899308097, 540090416, 1195642657, 167840283, 102439938, 1585126695,
      390275448, 1393888271, 337122105, 1045565184, 1113342297, 1266171991,
      1584021604, 1447888658, 1159005711, 1532363296, 282183, 1112349960,
      138353989, 34999078, 121856001, 1141245463, 1294536525, 151473735,
      439229702, 254283539, 104270649, 1447917648, 1443954709, 106323533,
      271276288, 662811, 523123219, 388700960, 390297089, 1427442705, 203108618,
      17189896, 17563948, 1161366275, 511382904, 402929730, 1146508097,
      85659905, 407527168, 185421125, 891619072, 389873713, 117443153, 56118032,
      822089500, 151870732, 1275724032, 37243979, 472919072, 454237511,
      223746326, 319881805, 135938563, 185336072, 157893189, 1585125691,
      353582593, 56118036, 1125129226, 1707849, 402849818, 37633794, 386537254,
      1447917655, 1912866830, 67113755, 273285447, 504234503, 1160710935,
      490359928, 19080019, 1393626885, 339090747, 386747139, 139281227,
      337772558, 1349864508, 419639120, 223747338, 117510221, 1192904707,
      251809093, 506998551, 1585122618, 556866817, 1812203566, 1125193216,
      540675913, 1112353576, 87956805, 321592373, 1447917658, 1076889111,
      857805595, 1195642665, 17367296, 359219781, 388767537, 270544464,
      1140857090, 119159581, 3477258,
    ],
    [
      386942744, 1229409564, 135333655, 220795160, 755369005, 1162041120,
      503777537, 1079123715, 101517389, 52050726, 1427192580, 236473163,
      17109769, 173424715, 371009796, 1292251441, 203046987, 50927385,
      503982872, 1446053403, 2376539, 169555715, 117837325, 355405073,
      438900482, 405154853, 1145049870, 34409291, 436733206, 2017924890,
      638784598, 973210372, 286198279, 134625543, 1778647041, 1009795397,
      268569364, 290080074, 202965528, 507332635, 134354452, 152965423,
      402923329, 102564125, 236739842, 706150459, 290790203, 240978695,
      52177998, 454823436, 1197226506, 251672392, 419431940, 285429263,
      286416394, 290006535, 454303788, 1090915598, 354048009, 1091132175,
      356080479, 1362842883, 236919825, 1209617177, 1075316761, 1093555476,
      337803338, 1427785501, 1461339656, 1327303942, 2047102737, 571952141,
      1411208983, 1326531854, 1276973337, 957501722, 745215771, 457971551,
      407048258, 1413810758, 189744919, 1549274479, 1208835629, 122683732,
      290717969, 1259620628, 638538288, 504780064, 289608031, 404029529,
      1326585167, 1276018207, 1460741645, 67916804, 1511283736, 5195038,
      273234948, 18622334, 507904847, 352344385, 1426083608, 1329023043,
      947075610, 202117450, 224136543, 1162101260, 1076894017, 225976393,
      122166853, 524816962, 356848732, 759700802, 1934427230, 839535692,
      39204446, 173872912, 827003996, 778964035, 457907295, 1396720145,
      1175783745, 475925317, 240979582, 341646696, 1346527045, 877014553,
      34144849, 994774908, 138743678, 457380169, 375002446, 172294213,
      223881039, 1179478043, 1108677450, 1146689345, 924407616, 357832018,
      155268902, 1497649743, 1094734404, 220025925, 438702086, 70325591,
      1643545, 408686104, 873550429, 472322827, 1550150419, 16787279, 34278407,
      1180648471, 637797448, 705626696, 68491267, 202001233, 153046535,
      1929861143, 640029993, 1109330433, 340264718, 221009951, 287179034,
      392108605, 33756966, 84029457, 1074532368, 341187916, 1850366843,
      185875050, 105454599, 253041247, 1598032221, 1531017813, 1582329169,
      520750428, 38280011, 172363532, 1397193033, 1599825007, 201611598,
      1293566492, 152902925, 1513770251, 1228544271, 386943257, 1528448786,
      1477775372, 271666946, 1530556186, 1142562583, 337331719, 1090600968,
      2015169296, 974674202, 89939485, 4923146, 505091400, 2018055445,
      1735348549, 1363894105, 1447319620, 1480607296, 1381915715, 1364935032,
      1364940655, 1564958533, 1482178904, 1447053120, 1951357028, 1430470776,
      1598381646, 1532780110, 1111776323, 1113088073, 1112109901, 1346787403,
      1409356039, 504713500, 1259350291, 386693676, 273026379, 1577274897,
      121837076, 1479285852, 473648920, 390531163, 55525907, 105650965,
      460533334, 104543053, 118166278, 51401991, 102436100, 894245895,
      1766327564, 1560547859, 790446857, 822095617, 1632649257, 544018770,
      218371856, 1594628871, 1241852697, 390673753, 318898225, 1543849261,
      420228884, 1090781211, 558652764, 655163434, 1325931325, 508117330,
      525344259, 520690773, 85014549, 84018010, 1126112264, 878009691,
      135922955, 1259218440, 425033074, 491261958, 134813266, 220011032,
      1211127597, 1534153233, 487532364, 270076938, 306978074, 439238914,
      980298315, 677136966, 218171141, 16778500, 1951154752, 1996624386,
      202705923, 437853723, 336330837, 756226304, 606995002, 374278681,
      189012548, 386466882, 387778316, 474766640, 72698209, 520751643,
      118564625, 824054024, 788928801, 1158290237, 18434638, 85723410,
      1581910529, 50410823, 206135566, 119147077, 270153991, 1313754636,
      101132047, 1297688929, 135073796, 355993372, 437918484, 1450723095,
      103155988, 169542172, 1465403663, 353242630, 103158868, 1500917265,
      1026695245, 404360509, 973741573, 822219547, 390290262, 1009987360,
      909389373, 623721020, 1682123578, 67903563, 824389676, 1078217532,
      436798749, 1197361674, 354289187, 521285926, 236526109, 173431126,
      353177886, 771897901, 352983332, 1242711104, 706153743, 387711750,
      1431205399, 84157967, 1226512898, 391600150, 404031771, 218106372, 463655,
      1162482194, 67700042, 201393710, 20649781, 472001799, 1293750808,
      118966599, 286787601, 506267706, 376860481, 469959197, 169290252,
      1293748502, 738480196, 1866662918, 1027487047, 607402026, 691414576,
      220997944, 2019637031, 926361687, 68033578, 473498121, 1192693518,
      790779512, 892871434, 1229409572, 603983891, 68944909, 755120940,
      1263341619, 470555456, 424820800, 34144769, 341211207, 50603539,
      236599298, 287706393, 391663133, 319831107, 1297053222, 201657107,
      487396891, 1245924636, 438372881, 1467564803, 206261002, 18488836,
      625886550, 807019577, 638652732, 758393632, 792740939, 808860735,
      1982210107, 705844568, 1162154527, 606742093, 757868074, 1783451184,
      808257051, 53943568, 1313479195, 206441271, 387124483, 337319170,
      1011697446, 1196966233, 1162304324, 1298094684, 1632580729, 51255864,
      1380653101, 152833856, 1581915406, 402663239, 120202771, 407720773,
      285678367, 1076433227, 252062531, 456402476, 17498899, 67241733,
      1245924639, 53545988, 39931221, 438965010, 454105369, 201932032,
      205132824, 376860481, 469959197, 17640204, 184618269, 990256173,
      1628639760, 88411209, 403573006, 155930199, 739118874, 694227212,
      117787993, 805699599, 168304137, 370358301, 1130059303, 922943536,
      118365952, 1259412253, 69162560, 755641148, 136131120, 1145772055,
      504699968, 521797641, 303512068, 424111939, 1196236296, 352784457,
      1314410014, 1091380740, 168261231, 520359188, 353973005, 222041630,
      1450723078, 909312026, 169674243, 5654345, 67961882, 1261175836,
      439837007, 488644127, 503778831, 439157540, 637539342, 625171286,
      437131532, 1447512327, 17498374, 1682118685, 842400075, 1075120659,
      50678596, 371142940, 1229982465, 874984310, 705102862, 1225657094,
      740710232, 1296969773, 555096682, 102565685, 1246054939, 221512470,
      540872219, 1431860777, 402861320, 424494405, 285213966, 137697306,
      102578176, 152771889, 3489800,
    ],
  ],
  [
    function () {
      return (function (navigator, frameset) {
        const e = get_property_byHash_then_bind(navigator, 704082790);
        return reshuffleStr(
          [
            getPropertyNameByHash(frameset, 3017323393),
            Oc(navigator, 859837811, "QjslADtOBipACA") ||
            Oc(e, 72906005, "Tjo/DSpIETFCCQ"),
          ],
          [
            20, 1, 24, 23, 23, 21, 14, 8, 11, 8, 6, 13, 1, 1, 12, 4, 9, 10, 6,
            2, 1, 2, 0, 1, 2, 1, 1,
          ],
        );
      })(navigator, document.createElement("frameset"));
    },
    maybeGetEncKey,
  ],
  [1, 1],
);
function Ta() {
  const run_func = function (n, t) {
    return n(t);
  };
  return run_func(get_s70_related_msg, 0) && navigator[run_func(get_s70_related_msg, 0)];
}
function Oa() {
  const n = function (n, t) {
    return n(t);
  },
    t = function (n, t) {
      return n(t);
    };
  return document[n(get_s70_related_msg, 1)](n(get_s70_related_msg, 2))[n(get_s70_related_msg, 3)](t(get_s70_related_msg, 4));
}
async function _a(n, t) {
  const e = function (n, t) {
    return n === t;
  },
    r = function (n, t) {
      return n === t;
    },
    o = function (n, t) {
      return n(t);
    },
    i = function (n, t, e, r) {
      return n(t, e, r);
    },
    u = function (n, t) {
      return n(t);
    },
    c = Array.from(e(n, null) || r(n, void 0) ? void 0 : n[o(get_s70_related_msg, 5)].values()),
    [s, a] = await Promise.all([i(Na, n, c, t), u(Va, n)]);
  return [s, a, c];
}
const xa = 16;
async function Na(n, t, e) {
  const r = function (n, t) {
    return n(t);
  },
    o = function (n, t) {
      return n(t);
    },
    i = function (n, t) {
      return n * t;
    },
    u = function (n, t) {
      return n(t);
    },
    c = function (n, t) {
      return n(t);
    },
    s = function (n, t) {
      return n(t);
    },
    a = function (n, t) {
      return n(t);
    },
    l = function (n, t) {
      return n(t);
    },
    f = function (n, t) {
      return n(t);
    },
    d = function (n, t) {
      return n / t;
    },
    m = function (n, t) {
      return n + t;
    },
    v = function (n, t) {
      return n(t);
    },
    h = function (n, t) {
      return n(t);
    },
    p = function (n, t) {
      return n(t);
    },
    g = function (n, t) {
      return n(t);
    },
    w = function (n, t) {
      return n(t);
    },
    y = function (n, t) {
      return n(t);
    },
    b = function (n, t) {
      return n(t);
    },
    E = function (n, t) {
      return n | t;
    },
    S = function (n, t) {
      return n(t);
    },
    I = function (n, t) {
      return n(t);
    },
    k = function (n, t) {
      return n(t);
    },
    A = function (n, t) {
      return n(t);
    },
    L = function (n, t) {
      return n(t);
    },
    C = function (n, t) {
      return n(t);
    },
    P = function (n, t) {
      return n(t);
    },
    T = function (n, t) {
      return n(t);
    },
    O = function (n, t) {
      return n(t);
    },
    _ = function (n, t) {
      return n * t;
    },
    x = function (n, t) {
      return n(t);
    },
    N = function (n, t) {
      return n(t);
    },
    j = function (n, t) {
      return n(t);
    },
    V = function (n, t) {
      return n(t);
    },
    M = function (n, t) {
      return n(t);
    },
    F = function (n, t) {
      return n(t);
    },
    W = function (n, t) {
      return n < t;
    },
    D = function (n, t) {
      return n(t);
    },
    Z = function (n, t) {
      return n(t);
    },
    H = function (n, t) {
      return n(t);
    },
    G = function (n, t) {
      return n(t);
    },
    U = function (n, t) {
      return n(t);
    },
    B = function (n, t) {
      return n(t);
    },
    $ = function (n, t) {
      return n(t);
    },
    Y = function (n, t) {
      return n(t);
    },
    X = function (n, t) {
      return n(t);
    },
    J = function (n, t) {
      return n(t);
    },
    z = function (n, t) {
      return n === t;
    },
    q = function (n, t) {
      return n(t);
    },
    K = function (n, t) {
      return n(t);
    },
    Q = function (n, t) {
      return n(t);
    },
    nn = function (n, t) {
      return n(t);
    },
    tn = function (n, t) {
      return n(t);
    },
    en = function (n, t) {
      return n(t);
    },
    rn = function (n, t) {
      return n + t;
    },
    on = function (n, t) {
      return n + t;
    },
    un = function (n, t) {
      return n(t);
    },
    cn = function (n, t) {
      return n * t;
    },
    sn = function (n, t) {
      return n + t;
    },
    an = function (n, t) {
      return n + t;
    },
    ln = function (n, t) {
      return n(t);
    },
    fn = function (n, t) {
      return n(t);
    },
    dn = function (n, t) {
      return n < t;
    },
    mn = function (n, t) {
      return n(t);
    },
    vn = function (n, t) {
      return n(t);
    },
    hn = function (n, t) {
      return n * t;
    },
    pn = function (n, t) {
      return n * t;
    },
    gn = function (n, t) {
      return n + t;
    },
    wn = function (n, t) {
      return n + t;
    },
    yn = function (n, t) {
      return n + t;
    },
    bn = await n[f(get_s70_related_msg, 6)]({ requiredFeatures: t }),
    En = Math.PI,
    Rn = [
      [0, 1, 0, convertToIUint8Array(En, 7)],
      [1, 0, 0, convertToIUint8Array(En, 8)],
      [0, 1, 1, convertToIUint8Array(En, 4)],
      [1, 2, 1, convertToIUint8Array(En, 8)],
    ],
    Sn = Rn.length,
    In = new Uint8Array(i(Sn, m(m(16, xa), 8))),
    kn = navigator[v(get_s70_related_msg, 0)][o(get_s70_related_msg, 7)]();
  e[a(get_s70_related_msg, 8)]({ device: bn, format: kn });
  const An = bn[h(get_s70_related_msg, 9)]({ label: p(get_s70_related_msg, 10), code: g(get_s70_related_msg, 11) }),
    Ln = bn[w(get_s70_related_msg, 12)]({
      label: s(get_s70_related_msg, 13),
      layout: y(get_s70_related_msg, 14),
      vertex: { module: An },
      fragment: { module: An, targets: [{ format: kn }] },
      primitive: b(get_s70_related_msg, 15),
    }),
    Cn = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ],
    Pn = new Uint8Array(
      v(Array, i(7, 9))
        .fill(void 0)
        .map((n, t) => Cn[t % 3])
        .flat(),
    ),
    Tn = bn[u(get_s70_related_msg, 16)]({
      label: s(get_s70_related_msg, 17),
      size: [7, 9],
      format: w(get_s70_related_msg, 18),
      usage: E(window[S(get_s70_related_msg, 19)][I(get_s70_related_msg, 20)], window[c(get_s70_related_msg, 19)][o(get_s70_related_msg, 21)]),
    });
  bn[k(get_s70_related_msg, 22)][A(get_s70_related_msg, 23)](
    { texture: Tn },
    Pn,
    { bytesPerRow: i(7, 4) },
    { width: 7, height: 9 },
  );
  const On = bn[L(get_s70_related_msg, 24)](C(get_s70_related_msg, 25)),
    _n = bn[P(get_s70_related_msg, 26)]({
      layout: Ln[s(get_s70_related_msg, 27)](0),
      entries: [
        { binding: 0, resource: On },
        { binding: 1, resource: Tn[c(get_s70_related_msg, 28)]() },
      ],
    }),
    xn = Rn.map((n) => {
      const t = bn[r(get_s70_related_msg, 29)]({
        label: o(get_s70_related_msg, 30),
        size: i(4, Float32Array[u(get_s70_related_msg, 31)]),
        usage: window[c(get_s70_related_msg, 32)][s(get_s70_related_msg, 33)],
        mappedAtCreation: true,
      });
      return (
        new Float32Array(t[u(get_s70_related_msg, 34)]())[a(get_s70_related_msg, 35)](n),
        t[o(get_s70_related_msg, 36)](),
        bn[a(get_s70_related_msg, 26)]({
          layout: Ln[l(get_s70_related_msg, 27)](1),
          entries: [{ binding: 0, resource: { buffer: t } }],
        })
      );
    }),
    Nn = bn[T(get_s70_related_msg, 37)](O(get_s70_related_msg, 38)),
    jn = bn[b(get_s70_related_msg, 29)]({
      size: _(Nn[x(get_s70_related_msg, 39)], 8),
      usage: E(window[k(get_s70_related_msg, 32)][N(get_s70_related_msg, 40)], window[j(get_s70_related_msg, 32)][P(get_s70_related_msg, 41)]),
    }),
    Vn = bn[j(get_s70_related_msg, 29)]({
      size: i(jn[N(get_s70_related_msg, 42)], Sn),
      usage: E(window[L(get_s70_related_msg, 32)][V(get_s70_related_msg, 21)], window[M(get_s70_related_msg, 32)][M(get_s70_related_msg, 43)]),
    }),
    Mn = {
      label: S(get_s70_related_msg, 44),
      colorAttachments: F(get_s70_related_msg, 45),
      timestampWrites: {
        querySet: Nn,
        beginningOfPassWriteIndex: 0,
        endOfPassWriteIndex: 1,
      },
    };
  for (let R = 0; W(R, xn.length); R++) {
    const n = xn[R];
    Mn[w(get_s70_related_msg, 46)][0][D(get_s70_related_msg, 47)] = e[u(get_s70_related_msg, 48)]()[Z(get_s70_related_msg, 28)]();
    const t = bn[H(get_s70_related_msg, 49)](M(get_s70_related_msg, 50)),
      r = t[G(get_s70_related_msg, 51)](Mn);
    (r[c(get_s70_related_msg, 52)](Ln), r[g(get_s70_related_msg, 53)](0, _n), r[U(get_s70_related_msg, 53)](1, n));
    const o = window[B(get_s70_related_msg, 54)][B(get_s70_related_msg, 55)]();
    (r[$(get_s70_related_msg, 56)](48),
      r[Y(get_s70_related_msg, 57)](),
      t[X(get_s70_related_msg, 58)](Nn, 0, Nn[J(get_s70_related_msg, 39)], jn, 0),
      z(Vn[q(get_s70_related_msg, 59)], K(get_s70_related_msg, 60)) &&
      t[Q(get_s70_related_msg, 61)](jn, 0, Vn, i(R, 16), jn[H(get_s70_related_msg, 42)]));
    const s = t[$(get_s70_related_msg, 62)]();
    bn[nn(get_s70_related_msg, 22)][A(get_s70_related_msg, 63)]([s]);
    const a = tn(ja, e[en(get_s70_related_msg, 2)]);
    (In[K(get_s70_related_msg, 35)](a, m(8, _(R, rn(on(16, xa), 8)))),
      In[un(get_s70_related_msg, 35)](
        new Uint8Array(new Float64Array([o])[w(get_s70_related_msg, 64)]),
        cn(R, sn(an(16, xa), 8)),
      ));
  }
  if (z(Vn[ln(get_s70_related_msg, 59)], l(get_s70_related_msg, 60))) {
    await Vn[$(get_s70_related_msg, 65)](window[fn(get_s70_related_msg, 66)][l(get_s70_related_msg, 67)]);
    const n = Vn[N(get_s70_related_msg, 34)](),
      t = new Uint8Array(n);
    for (let e = 0; dn(e, Sn); e++)
      In[mn(get_s70_related_msg, 35)](
        t[vn(get_s70_related_msg, 68)](hn(e, xa), pn(gn(e, 1), xa)),
        wn(rn(8, 16), _(e, m(yn(16, xa), 8))),
      );
    Vn[mn(get_s70_related_msg, 36)]();
  }
  return fn(R, In);
}
function ja(n) {
  return (function (n, t) {
    return n(t);
  })(
    T,
    (function (n, t) {
      return n(t);
    })(
      murmurHash3,
      n[
        (function (n, t) {
          return n(t);
        })(get_s70_related_msg, 69)
      ](),
    ),
  );
}
async function Va(n) {
  const t = function (n, t) {
    return n !== t;
  },
    e = function (n, t) {
      return n(t);
    };
  var r;
  return (function (n, t) {
    return n !== t;
  })(
    (r =
      n[
      (function (n, t) {
        return n(t);
      })(get_s70_related_msg, 70)
      ]),
    null,
  ) && t(r, void 0)
    ? r
    : await n[e(get_s70_related_msg, 71)]();
}
const Ma = /*#__PURE__*/ new RegExp(
  /*#__PURE__*/ encrypted_msg_getter(
  [
    39174333, 51812406, 885210665, 4099360837, 1242130291, 1365653239,
    2003041115, 1707369036, 3273002536, 359933e3, 1948332465,
  ],
  5,
)(0),
);
function s70_worker() {
  const run_func = function (n) {
    return n();
  },
    not_equal = function (n, t) {
      return n !== t;
    },
    run_2arg_func = function (n, t, e) {
      return n(t, e);
    },
    run_2arg_func_ = function (n, t, e) {
      return n(t, e);
    },
    run_2arg_func__ = function (n, t, e) {
      return n(t, e);
    },
    a_is_insof_b = function (n, t) {
      return n instanceof t;
    },
    run_1arg_func = function (n, t) {
      return n(t);
    };
  return run_2arg_func_(
    prepareRace,
    (function (n, t, e) {
      return n(t, e);
    })(runCallbackWhenPageFocusedPromise, 1e3, { s: -2, v: null }),
    async () => {
      const r = await run_func(get_gpu_requestAdapter);
      if (not_equal(run_2arg_func(get_property_byHash_then_bind, r, 453955339), 0)) return r; // s
      try {
        const [requestAdapter, t] = run_2arg_func(get_property_byHash_then_bind, r, 1801730948),
          [u, c, s] = await run_2arg_func(_a, requestAdapter, t);
        return {
          s: 0,
          v: { s: s, f: u, v: run_2arg_func_(get_property_byHash_then_bind, c, 4112659446), a: run_2arg_func__(get_property_byHash_then_bind, c, 1956208378) },
        };
      } catch (c) {
        if (a_is_insof_b(c, TypeError) && run_1arg_func(Da, run_2arg_func(get_property_byHash_then_bind, c, 3065852031)))
          return { s: -7, v: null };
        throw c;
      }
    },
  );
}
async function get_gpu_requestAdapter() {
  const run2arg_func = function (n, t, e) {
    return n(t, e);
  },
    a_is_insof_b = function (n, t) {
      return n instanceof t;
    },
    run_func = function (n) {
      return n();
    },
    run_func__ = function (n) {
      return n();
    },
    gpu = run2arg_func(get_property_byHash_then_bind, navigator, 3179935986); // gpu
  if (!gpu) return { s: -3, v: null };
  let requestAdapter = null;
  try {
    requestAdapter = await run2arg_func(get_property_byHash_then_bind, gpu, 1678473624)(); //requestAdapter
  } catch (c) {
    if (a_is_insof_b(c, Error) && run_func(collectSomeKeys1_related_to_firefox)) return { s: -3, v: run2arg_func(get_property_byHash_then_bind, c, 3065852031) };
    throw c;
  }
  if (!requestAdapter) return { s: -4, v: null };
  if (!run_func(Ta)) return { s: -1, v: null };
  const u = run_func__(Oa);
  return u ? { s: 0, v: [requestAdapter, u] } : { s: -5, v: null };
}
function Da(n) {
  const t = function (n, t) {
    return n === t;
  },
    e = function (n, t) {
      return n(t);
    },
    r = n.match(Ma);
  return !!r && t(e(getHash, r[1]), 4169850297);
}
function get_timeStamp() {
  var n;
  return {
    s: 0,
    v:
      null !== (n = performance.timeOrigin) && void 0 !== n
        ? n
        : Date.now() - performance.now(),
  };
}
function tls_worker(n, t, e, r, o, i) {
  const u = r
    ? []
    : (function (n, t, e) {
      return (function (n, t) {
        const e = function (n, t, e) {
          return n(t, e);
        },
          r = function (n, t) {
            return n(t);
          },
          o = function (n, t) {
            return n(t);
          },
          i = Array.isArray(n) ? n : [n],
          u = [];
        for (const c of i)
          if (e(Zi, c, Bt)) for (const n of t) u.push(r(Vi, n));
          else u.push(o(String, c));
        return u;
      })(n, t).map((n) => Sr(n, { q: e }));
    })(n, t, e);
  if (0 === u.length) return () => Promise.resolve({ s: -1, v: null });
  xr(i, () => ({ e: 6 }));
  const c = s(),
    a = Lr(c),
    l = Date.now(),
    f = ko(u, qa.bind(null, 5e3, i, a), Ka, Math.max(10, u.length), o);
  return (
    f.then(
      () => c.resolve(),
      () => c.resolve(),
    ),
    async function (n, t, e, r) {
      if (e) return { s: -1, v: null };
      try {
        await Promise.race([f, Qa(l, n, t)]);
        const e = (function ({ result: n, failedAttempts: t }) {
          if (void 0 !== n) return n;
          const e = t[0];
          if (!e) return { s: -3, v: null };
          if (1 === e.level) return e.error;
          const { error: r, endpoint: o } = e;
          if (r instanceof Error) {
            const { name: n, message: t } = r;
            switch (n) {
              case "AbortError":
                return { s: -2, v: t };
              case "TimeoutError":
                return { s: -3, v: t };
              case "CSPError":
                return { s: -6, v: t };
              case "InvalidURLError":
                return { s: -7, v: `Invalid URL: ${Ve(o, 255)}` };
              case "TypeError":
                return { s: -4, v: t };
            }
          }
          return ai(r);
        })(f.current);
        return (xr(r, () => ({ e: 7, result: e })), e);
      } catch (o) {
        throw (xr(r, () => ({ e: 8, error: o })), o);
      }
    }
  );
}
function qa(n, t, e, r, o, i) {
  return Nr(
    t,
    () => ({ e: 9, tryNumber: o, url: r, timeout: n }),
    ({ status: n, getHeader: t, body: e }) => ({
      e: 10,
      tryNumber: o,
      status: n,
      retryAfter: t("retry-after"),
      body: e,
    }),
    (n) => ({ e: 11, tryNumber: o, error: n }),
    () => Ar({ url: r, timeout: n, abort: i, container: e }),
  );
}
function Ka({ status: n, body: t }) {
  if (200 === n && /^[a-zA-Z0-9+/]{1,1022}={0,2}$/.test(t))
    return { result: { s: 0, v: t } };
  return { error: { s: -5, v: Ve(`${n}: ${t}`, 255) } };
}
function Qa(n, t, e) {
  return runCallbackWhenPageFocusedPromise(Math.min(Math.max(t, n + 1e4 - Date.now()), e));
}
function get__vid_t(n) {
  const t = add_t(n);
  let [e, r] = (function (n) {
    return [get_cookie_value(n), get_localStorage_value(n)]; // _vid_t
  })(t);
  return (
    (e = shorter_than_1e3(e)),
    (r = shorter_than_1e3(r)),
    void 0 !== e && void 0 !== r
      ? { s: 0, v: e || r }
      : void 0 !== e
        ? { s: 1, v: e }
        : void 0 !== r
          ? { s: 2, v: r }
          : { s: -1, v: null }
  );
}
function shorter_than_1e3(n) {
  return n && n.length <= 1e3 ? n : void 0;
}
const module1_for_info_collect = function () {
  return {
    key: "id",
    sources: {
      stage1: { s94: ia },
      stage2: {
        voiceInfoHash: getVoiceInfoHash_worker_func, // 获取语音hash
        ScreenSize: getScreenSize_worker,  // 判断是否无头的
        PlatformInfoFromList: getPlatformInfoFromList, // 从navigator中拿平台信息
        Font: Font_Test, // 测试系统支持哪些字体
        has_AdBlocker: AdBlocker_test, // 测试是否有广告拦截插件
        test_font_width: font_width_test, // 测试字体宽度
        audio_data: audio_data_collector_,  // 获取音频引擎指纹
        s79: s79_worker,
        IframeUrl: getIframeUrl, // 测试是否被嵌套
        webkitRequestFileSystem: test_webkitRequestFileSystem_, // 测试webkitRequestFileSystem
        storageQuota: getstorageQuota,
        Sandbox_Iframe_width_height: getSandbox_Iframe_width_height,
        indexDB: test_indexDB,
        storage_getDirectory: test_storage_getDirectory,
        canvas_test: canvas_test_worker,
        system_color: test_system_color,
        mathML: test_mathML,
        emoji: test_emoji,
        s95: s95_worker,
        s97: s97_worker,
        s70: s70_worker,
      },
      stage3: {
        wasm: test_wasm,
        doNotTrack: test_doNotTrack,
        Brave_browser: Brave_detect,
        theme_color: test_theme_color,
        Time: getTime,
        PerformanceIntervals: measurePerformanceIntervals,
        jsHeapSizeLimit: get_jsHeapSizeLimit,
        devicePixelRatio: get_devicePixelRatio,
        IE: run_IE_KEY_collector,
        Edge: run_Edge_KEY_collector,
        Chrome: run_Chrome_KEY_collector,
        Apple: run_Apple_KEY_collector,
        Safari: run_safari_KEY_collector,
        Firefox: run_firefox_KEY_collector,
        mobile: mobile,
        attributionSourceId: attributionSourceId,
        new_api: new_api,
        origin: get_origin,
        eval_toString_length: get_eval_toString_length,
        webdriver: test_webdriver,
        oscpu: oscpu,
        language: language,
        colorDepth: get_color_depth_,
        deviceMemory: get_deviceMemory,
        height_width: get_H_W_,
        hardwareConcurrency: get_hardwareConcurrency,
        timezone: timezone,
        sessionStorage: sessionStorage_,
        localStorage: localStorage_,
        indexedDB: has_indexedDB,
        openDatabase: openDatabase,
        get_cpuClass_: get_cpuClass_,
        is_ipad_or_iphone_: is_ipad_or_iphone_,
        plugins: plugins,
        touch_event: touch_event,
        vendor: vendor,
        vendor_keys: vendor_keys,
        cookie: cookie,
        color_gamut: color_gamut,
        invert_color_: invert_color_,
        force_color_: force_color_,
        monochrome_test: monochrome_test,
        perfer_contrast_: perfer_contrast_,
        motion_set_: motion_set_,
        dynamic_range_set_: dynamic_range_set_,
        Math_func_test_hash: Math_func_test_hash,
        pdfViewerEnabled: pdfViewerEnabled_,
        NaN_imply: NaN_imply_,
        language_: get_language_,
        language__: get_language_again,
        no_storage: check_no_storage,
        transparency_set: transparency_set_,
        AudioLatency: getAudioLatency_,
        serviceWorker: get_serviceWorker,
        isSecureContext: get_isSecureContext,
        timeStamp: get_timeStamp,
        new_web_api: new_web_api,
        locale: get_locale_,
        webgl_context_info: webgl_context_info,
        webgl_infos: webgl_infos,
        webgl_render_data: draw_and_get_webgl_render_data,
      },
    },
    tls: tls_worker,
    async toRequest(n, t) {
      const href = location.href,
        referrer = document.referrer,
        [o, i] = await Promise.all([href && sha256Hash(href, t), referrer && sha256Hash(referrer, t)]);
      return { url: o, cr: i || void 0, s55: get__vid_t(n), s48: get_random_seq() };
    },
    onGetResponse(n, t) {
      var e, r, o;
      !(function (n, t) {
        const e = add_t(n);
        t && qr(t, e);
      })(
        t,
        null ===
          (o =
            null ===
              (r =
                null === (e = n.products) || void 0 === e
                  ? void 0
                  : e.identification) || void 0 === r
              ? void 0
              : r.data) || void 0 === o
          ? void 0
          : o.visitorToken,
      );
    },
  };
};
const APIKEYREQUREID_ERR = "API key required",
  APIKEYNOTFOUND_ERR = "API key not found",
  APIKETEXPIRED_ERR = "API key expired",
  REQCANNOT_PARSED_ERR = "Request cannot be parsed",
  REQUEST_FAILED_ERR = "Request failed",
  REQUEST_FAILED_TO_PROCESS_ERR = "Request failed to process",
  TOO_MANY_REQUESTS_ERR = "Too many requests, rate limit exceeded",
  NOT_AVAIABLE_FOR_THIS_ORIGIN_ERR = "Not available for this origin",
  NOT_AVAILABLE_ERR = "Not available with restricted header",
  APIKEYREQUREID_ERR_ = APIKEYREQUREID_ERR,
  APIKEYNOTFOUND_ERR_ = APIKEYNOTFOUND_ERR,
  APIKETEXPIRED_ERR_ = APIKETEXPIRED_ERR;
function loadAgent(extraConfigs) {
  return Promise.resolve()
    .then(function () {
      var configs = { region: "ap" };
      if (extraConfigs)
        for (var n in extraConfigs)
          extraConfigs.hasOwnProperty(n) && void 0 !== extraConfigs[n] && (configs[n] = extraConfigs[n]);
      return (
        (configs.apiKey = "fYicOuiT1WRGwuZgAESv"),
        (configs.imi = { m: "e" }),
        (configs.modules = [module1_for_info_collect(), module2()]),
        configs
      );
    })
    .then(runService);
}
// export {
//   APIKETEXPIRED_ERR as ERROR_API_KEY_EXPIRED,
//   APIKEYNOTFOUND_ERR as ERROR_API_KEY_INVALID,
//   APIKEYREQUREID_ERR as ERROR_API_KEY_MISSING,
//   REQCANNOT_PARSED_ERR as ERROR_BAD_REQUEST_FORMAT,
//   _e as ERROR_BAD_RESPONSE_FORMAT,
//   Pe as ERROR_CLIENT_TIMEOUT,
//   xe as ERROR_CSP_BLOCK,
//   Ge as ERROR_FORBIDDEN_ENDPOINT,
//   NOT_AVAILABLE_ERR as ERROR_FORBIDDEN_HEADER,
//   NOT_AVAIABLE_FOR_THIS_ORIGIN_ERR as ERROR_FORBIDDEN_ORIGIN,
//   REQUEST_FAILED_ERR as ERROR_GENERAL_SERVER_FAILURE,
//   je as ERROR_HANDLE_AGENT_DATA,
//   He as ERROR_INSTALLATION_METHOD_RESTRICTED,
//   Ue as ERROR_INTEGRATION_FAILURE,
//   Ne as ERROR_INVALID_ENDPOINT,
//   Xe as ERROR_INVALID_PROXY_INTEGRATION_HEADERS,
//   Ye as ERROR_INVALID_PROXY_INTEGRATION_SECRET,
//   Oe as ERROR_NETWORK_ABORT,
//   Te as ERROR_NETWORK_CONNECTION,
//   $e as ERROR_NETWORK_RESTRICTED,
//   Je as ERROR_PROXY_INTEGRATION_SECRET_ENVIRONMENT_MISMATCH,
//   TOO_MANY_REQUESTS_ERR as ERROR_RATE_LIMIT,
//   REQUEST_FAILED_TO_PROCESS_ERR as ERROR_SERVER_TIMEOUT,
//   De as ERROR_SUBSCRIPTION_NOT_ACTIVE,
//   APIKETEXPIRED_ERR_ as ERROR_TOKEN_EXPIRED,
//   APIKEYNOTFOUND_ERR_ as ERROR_TOKEN_INVALID,
//   APIKEYREQUREID_ERR_ as ERROR_TOKEN_MISSING,
//   Ze as ERROR_UNSUPPORTED_VERSION,
//   We as ERROR_WRONG_REGION,
//   Gt as defaultEndpoint,
//   Bt as defaultTlsEndpoint,
//   Xi as handleAgentData,
//   loadAgent as load,
// };
