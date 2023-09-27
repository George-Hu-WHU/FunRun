"use strict";
var _baseComponent = _interopRequireDefault(
        require("../helpers/baseComponent")
    ),
    _classNames = _interopRequireDefault(require("../helpers/classNames")),
    _nearest = _interopRequireDefault(require("../helpers/nearest")),
    _styleToCssString = _interopRequireDefault(
        require("../helpers/styleToCssString")
    ),
    _gestures = require("../helpers/gestures"),
    _checkIPhoneX = require("../helpers/checkIPhoneX"),
    _rubberband = require("../helpers/rubberband");
function _interopRequireDefault(t) {
    return t && t.__esModule ? t : { default: t };
}
function _defineProperty(t, e, s) {
    return (
        e in t
            ? Object.defineProperty(t, e, {
                  value: s,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (t[e] = s),
        t
    );
}
(0, _baseComponent.default)({
    useExport: !0,
    properties: {
        prefixCls: { type: String, value: "wux-floating-panel" },
        defaultAnchors: { type: Array, value: [] },
    },
    data: { wrapStyle: "", possibles: [], moving: !1 },
    computed: {
        classes: [
            "prefixCls",
            function (t) {
                return {
                    wrap: (0, _classNames.default)(t),
                    hd: "".concat(t, "__hd"),
                    bd: "".concat(t, "__bd"),
                    bar: "".concat(t, "__bar"),
                    mask: "".concat(t, "__mask"),
                };
            },
        ],
    },
    methods: _defineProperty(
        {
            onTouchStart: function (t) {
                this.data.moving ||
                    1 < (0, _gestures.getPointsNumber)(t) ||
                    ((this.startY = (0, _gestures.getTouchPoints)(t).y),
                    (this.moveY = 0),
                    (this.endY = 0),
                    this.setData({ moving: !0 }));
            },
            onTouchMove: function (t) {
                if (
                    this.data.moving &&
                    !(1 < (0, _gestures.getPointsNumber)(t))
                ) {
                    this.moveY = (0, _gestures.getTouchPoints)(t).y;
                    var e = this.moveY - this.startY,
                        s = (0, _rubberband.rubberbandIfOutOfBounds)(
                            Math.abs(this.lastY + e),
                            -this.bounds.bottom,
                            -this.bounds.top
                        );
                    this.setTransform(-Math.round(s));
                }
            },
            onTouchEnd: function (t) {
                var e = this;
                if (
                    this.data.moving &&
                    !(1 < (0, _gestures.getPointsNumber)(t))
                ) {
                    this.endY = (0, _gestures.getTouchPoints)(t).y;
                    var s = this.endY - this.startY,
                        r = this.lastY + s;
                    (this.lastY = (0, _nearest.default)(
                        this.data.possibles,
                        r
                    )),
                        this.setTransform(Math.round(this.lastY), 0.3),
                        setTimeout(function () {
                            return e.setData({ moving: !1 });
                        }, 300);
                }
            },
            setTransform: function (t, e) {
                var s = this,
                    r = (0, _styleToCssString.default)({
                        height: "".concat(-this.bounds.top, "px"),
                        transform: "translate3d(0, calc(100% + ".concat(
                            t,
                            "px), 0)"
                        ),
                        transition: e
                            ? "cubic-bezier(0, 0, 0.2, 1.15) ".concat(e, "s")
                            : "none",
                    });
                this.data.wrapStyle !== r &&
                    (this.setData({ wrapStyle: r }, function () {
                        e &&
                            setTimeout(function () {
                                return s.setTransform(t);
                            }, 1e3 * e);
                    }),
                    this.triggerEvent("heightChange", {
                        height: -t,
                        minHeight: -this.bounds.bottom,
                        maxHeight: -this.bounds.top,
                        animating: !!e,
                    }));
            },
        },
        "export",
        function () {
            var r = this;
            return {
                setHeight: function (t, e) {
                    var s =
                        1 < arguments.length && void 0 !== e
                            ? e
                            : { immediate: !1 };
                    r.setTransform(-t, s.immediate ? 0.3 : 0), (r.lastY = -t);
                },
            };
        }
    ),
    created: function () {
        (this.moveY = 0), (this.endY = 0), (this.startY = 0), (this.lastY = 0);
    },
    attached: function () {
        var t = this.data.defaultAnchors
                .filter(function (t) {
                    return "number" == typeof t;
                })
                .filter(function (t) {
                    return 0 < t;
                }),
            e =
                0 === t.length
                    ? [-(0, _checkIPhoneX.getSystemInfo)().windowHeight]
                    : t.map(function (t) {
                          return -t;
                      }),
            s = { top: Math.round(e[e.length - 1]), bottom: Math.round(e[0]) };
        (this.bounds = s),
            (this.lastY = s.bottom),
            this.setData({ possibles: e }),
            this.setTransform(s.bottom);
    },
});
