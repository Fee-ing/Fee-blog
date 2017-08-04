(function () {
    function a(v, e) {
        e = e || {};
        var t = e.indent_size || 4;
        var c = e.indent_char || " ";
        if (typeof t === "string") {
            t = parseInt(t, 10)
        }
        var h = /^\s+$/;
        var f = /[\w$\-_]/;
        var j = -1,
            n;
 
        function r() {
            n = v.charAt(++j);
            return n
        }
        function s() {
            return v.charAt(j + 1)
        }
        function x(z) {
            var A = j;
            while (r()) {
                if (n === "\\") {
                    r();
                    r()
                } else {
                    if (n === z) {
                        break
                    } else {
                        if (n === "\n") {
                            break
                        }
                    }
                }
            }
            return v.substring(A, j + 1)
        }
        function b() {
            var z = j;
            while (h.test(s())) {
                j++
            }
            return j !== z
        }
        function y() {
            var z = j;
            do {} while (h.test(r()));
            return j !== z + 1
        }
        function q() {
            var z = j;
            r();
            while (r()) {
                if (n === "*" && s() === "/") {
                    j++;
                    break
                }
            }
            return v.substring(z, j + 1)
        }
        function k(z) {
            return v.substring(j - z.length, j).toLowerCase() === z
        }
        var p = v.match(/^[\r\n]*[\t ]*/)[0];
        var i = Array(t + 1).join(c);
        var u = 0;
 
        function m() {
            u++;
            p += i
        }
        function o() {
            u--;
            p = p.slice(0, -t)
        }
        var d = {};
        d["{"] = function (z) {
            d.singleSpace();
            l.push(z);
            d.newLine()
        };
        d["}"] = function (z) {
            d.newLine();
            l.push(z);
            d.newLine()
        };
        d.newLine = function (z) {
            if (!z) {
                while (h.test(l[l.length - 1])) {
                    l.pop()
                }
            }
            if (l.length) {
                l.push("\n")
            }
            if (p) {
                l.push(p)
            }
        };
        d.singleSpace = function () {
            if (l.length && !h.test(l[l.length - 1])) {
                l.push(" ")
            }
        };
        var l = [];
        if (p) {
            l.push(p)
        }
        while (true) {
            var g = y();
            if (!n) {
                break
            }
            if (n === "{") {
                m();
                d["{"](n)
            } else {
                if (n === "}") {
                    o();
                    d["}"](n)
                } else {
                    if (n === '"' || n === "'") {
                        l.push(x(n))
                    } else {
                        if (n === ";") {
                            l.push(n, "\n", p)
                        } else {
                            if (n === "/" && s() === "*") {
                                d.newLine();
                                l.push(q(), "\n", p)
                            } else {
                                if (n === "(") {
                                    if (k("url")) {
                                        l.push(n);
                                        b();
                                        if (r()) {
                                            if (n !== ")" && n !== '"' && n !== "'") {
                                                l.push(x(")"))
                                            } else {
                                                j--
                                            }
                                        }
                                    } else {
                                        if (g) {
                                            d.singleSpace()
                                        }
                                        l.push(n);
                                        b()
                                    }
                                } else {
                                    if (n === ")") {
                                        l.push(n)
                                    } else {
                                        if (n === ",") {
                                            b();
                                            l.push(n);
                                            d.singleSpace()
                                        } else {
                                            if (n === "]") {
                                                l.push(n)
                                            } else {
                                                if (n === "[" || n === "=") {
                                                    b();
                                                    l.push(n)
                                                } else {
                                                    if (g) {
                                                        d.singleSpace()
                                                    }
                                                    l.push(n)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var w = l.join("").replace(/[\n ]+$/, "");
        return w
    }
    if (typeof define === "function") {
        define(function (c, b, d) {
            b.css_beautify = a
        })
    } else {
        if (typeof exports !== "undefined") {
            exports.css_beautify = a
        } else {
            if (typeof window !== "undefined") {
                window.css_beautify = a
            }
        }
    }
}());