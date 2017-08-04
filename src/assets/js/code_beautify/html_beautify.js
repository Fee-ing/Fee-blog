(function () {
    function b(v, g, p, h) {
        var z, s, q, j, k, y;
        g = g || {};
        s = g.indent_size || 4;
        q = g.indent_char || " ";
        k = g.brace_style || "collapse";
        j = g.max_char === 0 ? Infinity : g.max_char || 250;
        y = g.unformatted || ["a", "span", "bdo", "em", "strong", "dfn", "code", "samp", "kbd", "var", "cite", "abbr",
                "acronym", "q", "sub", "sup", "tt", "i", "b", "big", "small", "u", "s", "strike", "font", "ins", "del",
                "pre", "address", "dt", "h1", "h2", "h3", "h4", "h5", "h6"];

        function f() {
            this.pos = 0;
            this.token = "";
            this.current_mode = "CONTENT";
            this.tags = {
                parent: "parent1",
                parentcount: 1,
                parent1: ""
            };
            this.tag_type = "";
            this.token_text = this.last_token = this.last_text = this.token_type = "";
            this.Utils = {
                whitespace: "\n\r\t ".split(""),
                single_token: "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?="
                    .split(","),
                extra_liners: "head,body,/html".split(","),
                in_array: function (B, t) {
                    for (var A = 0; A < t.length; A++) {
                        if (B === t[A]) {
                            return true
                        }
                    }
                    return false
                }
            };
            this.get_content = function () {
                var t = "",
                    B = [],
                    C = false;
                while (this.input.charAt(this.pos) !== "<") {
                    if (this.pos >= this.input.length) {
                        return B.length ? B.join("") : ["", "TK_EOF"]
                    }
                    t = this.input.charAt(this.pos);
                    this.pos++;
                    this.line_char_count++;
                    if (this.Utils.in_array(t, this.Utils.whitespace)) {
                        if (B.length) {
                            C = true
                        }
                        this.line_char_count--;
                        continue
                    } else {
                        if (C) {
                            if (this.line_char_count >= this.max_char) {
                                B.push("\n");
                                for (var A = 0; A < this.indent_level; A++) {
                                    B.push(this.indent_string)
                                }
                                this.line_char_count = 0
                            } else {
                                B.push(" ");
                                this.line_char_count++
                            }
                            C = false
                        }
                    }
                    B.push(t)
                }
                return B.length ? B.join("") : ""
            };
            this.get_contents_to = function (B) {
                if (this.pos === this.input.length) {
                    return ["", "TK_EOF"]
                }
                var t = "";
                var C = "";
                var D = new RegExp("</" + B + "\\s*>", "igm");
                D.lastIndex = this.pos;
                var A = D.exec(this.input);
                var E = A ? A.index : this.input.length;
                if (this.pos < E) {
                    C = this.input.substring(this.pos, E);
                    this.pos = E
                }
                return C
            };
            this.record_tag = function (t) {
                if (this.tags[t + "count"]) {
                    this.tags[t + "count"]++;
                    this.tags[t + this.tags[t + "count"]] = this.indent_level
                } else {
                    this.tags[t + "count"] = 1;
                    this.tags[t + this.tags[t + "count"]] = this.indent_level
                }
                this.tags[t + this.tags[t + "count"] + "parent"] = this.tags.parent;
                this.tags.parent = t + this.tags[t + "count"]
            };
            this.retrieve_tag = function (t) {
                if (this.tags[t + "count"]) {
                    var A = this.tags.parent;
                    while (A) {
                        if (t + this.tags[t + "count"] === A) {
                            break
                        }
                        A = this.tags[A + "parent"]
                    }
                    if (A) {
                        this.indent_level = this.tags[t + this.tags[t + "count"]];
                        this.tags.parent = this.tags[A + "parent"]
                    }
                    delete this.tags[t + this.tags[t + "count"] + "parent"];
                    delete this.tags[t + this.tags[t + "count"]];
                    if (this.tags[t + "count"] === 1) {
                        delete this.tags[t + "count"]
                    } else {
                        this.tags[t + "count"]--
                    }
                }
            };
            this.get_tag = function (J) {
                var E = "",
                    G = [],
                    F = "",
                    A = false,
                    I, D, B = this.pos,
                    t = this.line_char_count;
                J = J !== undefined ? J : false;
                do {
                    if (this.pos >= this.input.length) {
                        if (J) {
                            this.pos = B;
                            this.line_char_count = t
                        }
                        return G.length ? G.join("") : ["", "TK_EOF"]
                    }
                    E = this.input.charAt(this.pos);
                    this.pos++;
                    this.line_char_count++;
                    if (this.Utils.in_array(E, this.Utils.whitespace)) {
                        A = true;
                        this.line_char_count--;
                        continue
                    }
                    if (E === "'" || E === '"') {
                        if (!G[1] || G[1] !== "!") {
                            E += this.get_unformatted(E);
                            A = true
                        }
                    }
                    if (E === "=") {
                        A = false
                    }
                    if (G.length && G[G.length - 1] !== "=" && E !== ">" && A) {
                        if (this.line_char_count >= this.max_char) {
                            this.print_newline(false, G);
                            this.line_char_count = 0
                        } else {
                            G.push(" ");
                            this.line_char_count++
                        }
                        A = false
                    }
                    if (E === "<") {
                        I = this.pos - 1
                    }
                    G.push(E)
                } while (E !== ">");
                var K = G.join("");
                var C;
                if (K.indexOf(" ") !== -1) {
                    C = K.indexOf(" ")
                } else {
                    C = K.indexOf(">")
                }
                var H = K.substring(1, C).toLowerCase();
                if (K.charAt(K.length - 2) === "/" || this.Utils.in_array(H, this.Utils.single_token)) {
                    if (!J) {
                        this.tag_type = "SINGLE"
                    }
                } else {
                    if (H === "script") {
                        if (!J) {
                            this.record_tag(H);
                            this.tag_type = "SCRIPT"
                        }
                    } else {
                        if (H === "style") {
                            if (!J) {
                                this.record_tag(H);
                                this.tag_type = "STYLE"
                            }
                        } else {
                            if (this.is_unformatted(H, y)) {
                                F = this.get_unformatted("</" + H + ">", K);
                                G.push(F);
                                if (I > 0 && this.Utils.in_array(this.input.charAt(I - 1), this.Utils.whitespace)) {
                                    G.splice(0, 0, this.input.charAt(I - 1))
                                }
                                D = this.pos - 1;
                                if (this.Utils.in_array(this.input.charAt(D + 1), this.Utils.whitespace)) {
                                    G.push(this.input.charAt(D + 1))
                                }
                                this.tag_type = "SINGLE"
                            } else {
                                if (H.charAt(0) === "!") {
                                    if (H.indexOf("[if") !== -1) {
                                        if (K.indexOf("!IE") !== -1) {
                                            F = this.get_unformatted("-->", K);
                                            G.push(F)
                                        }
                                        if (!J) {
                                            this.tag_type = "START"
                                        }
                                    } else {
                                        if (H.indexOf("[endif") !== -1) {
                                            this.tag_type = "END";
                                            this.unindent()
                                        } else {
                                            if (H.indexOf("[cdata[") !== -1) {
                                                F = this.get_unformatted("]]>", K);
                                                G.push(F);
                                                if (!J) {
                                                    this.tag_type = "SINGLE"
                                                }
                                            } else {
                                                F = this.get_unformatted("-->", K);
                                                G.push(F);
                                                this.tag_type = "SINGLE"
                                            }
                                        }
                                    }
                                } else {
                                    if (!J) {
                                        if (H.charAt(0) === "/") {
                                            this.retrieve_tag(H.substring(1));
                                            this.tag_type = "END"
                                        } else {
                                            this.record_tag(H);
                                            this.tag_type = "START"
                                        } if (this.Utils.in_array(H, this.Utils.extra_liners)) {
                                            this.print_newline(true, this.output)
                                        }
                                    }
                                }
                            }
                        }
                    }
                } if (J) {
                    this.pos = B;
                    this.line_char_count = t
                }
                return G.join("")
            };
            this.get_unformatted = function (A, B) {
                if (B && B.toLowerCase().indexOf(A) !== -1) {
                    return ""
                }
                var t = "";
                var C = "";
                var D = true;
                do {
                    if (this.pos >= this.input.length) {
                        return C
                    }
                    t = this.input.charAt(this.pos);
                    this.pos++;
                    if (this.Utils.in_array(t, this.Utils.whitespace)) {
                        if (!D) {
                            this.line_char_count--;
                            continue
                        }
                        if (t === "\n" || t === "\r") {
                            C += "\n";
                            this.line_char_count = 0;
                            continue
                        }
                    }
                    C += t;
                    this.line_char_count++;
                    D = true
                } while (C.toLowerCase().indexOf(A) === -1);
                return C
            };
            this.get_token = function () {
                var t;
                if (this.last_token === "TK_TAG_SCRIPT" || this.last_token === "TK_TAG_STYLE") {
                    var A = this.last_token.substr(7);
                    t = this.get_contents_to(A);
                    if (typeof t !== "string") {
                        return t
                    }
                    return [t, "TK_" + A]
                }
                if (this.current_mode === "CONTENT") {
                    t = this.get_content();
                    if (typeof t !== "string") {
                        return t
                    } else {
                        return [t, "TK_CONTENT"]
                    }
                }
                if (this.current_mode === "TAG") {
                    t = this.get_tag();
                    if (typeof t !== "string") {
                        return t
                    } else {
                        var B = "TK_TAG_" + this.tag_type;
                        return [t, B]
                    }
                }
            };
            this.get_full_indent = function (t) {
                t = this.indent_level + t || 0;
                if (t < 1) {
                    return ""
                }
                return Array(t + 1).join(this.indent_string)
            };
            this.is_unformatted = function (B, A) {
                if (!this.Utils.in_array(B, A)) {
                    return false
                }
                if (B.toLowerCase() !== "a" || !this.Utils.in_array("a", A)) {
                    return true
                }
                var C = this.get_tag(true);
                var t = (C || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);
                if (!t || this.Utils.in_array(t, A)) {
                    return true
                } else {
                    return false
                }
            };
            this.printer = function (C, B, t, E, D) {
                this.input = C || "";
                this.output = [];
                this.indent_character = B;
                this.indent_string = "";
                this.indent_size = t;
                this.brace_style = D;
                this.indent_level = 0;
                this.max_char = E;
                this.line_char_count = 0;
                for (var A = 0; A < this.indent_size; A++) {
                    this.indent_string += this.indent_character
                }
                this.print_newline = function (H, F) {
                    this.line_char_count = 0;
                    if (!F || !F.length) {
                        return
                    }
                    if (!H) {
                        while (this.Utils.in_array(F[F.length - 1], this.Utils.whitespace)) {
                            F.pop()
                        }
                    }
                    F.push("\n");
                    for (var G = 0; G < this.indent_level; G++) {
                        F.push(this.indent_string)
                    }
                };
                this.print_token = function (F) {
                    this.output.push(F)
                };
                this.indent = function () {
                    this.indent_level++
                };
                this.unindent = function () {
                    if (this.indent_level > 0) {
                        this.indent_level--
                    }
                }
            };
            return this
        }
        z = new f();
        z.printer(v, q, s, j, k);
        while (true) {
            var m = z.get_token();
            z.token_text = m[0];
            z.token_type = m[1];
            if (z.token_type === "TK_EOF") {
                break
            }
            switch (z.token_type) {
            case "TK_TAG_START":
                z.print_newline(false, z.output);
                z.print_token(z.token_text);
                z.indent();
                z.current_mode = "CONTENT";
                break;
            case "TK_TAG_STYLE":
            case "TK_TAG_SCRIPT":
                z.print_newline(false, z.output);
                z.print_token(z.token_text);
                z.current_mode = "CONTENT";
                break;
            case "TK_TAG_END":
                if (z.last_token === "TK_CONTENT" && z.last_text === "") {
                    var x = z.token_text.match(/\w+/)[0];
                    var o = z.output[z.output.length - 1].match(/<\s*(\w+)/);
                    if (o === null || o[1] !== x) {
                        z.print_newline(true, z.output)
                    }
                }
                z.print_token(z.token_text);
                z.current_mode = "CONTENT";
                break;
            case "TK_TAG_SINGLE":
                var e = z.token_text.match(/^\s*<([a-z]+)/i);
                if (!e || !z.Utils.in_array(e[1], y)) {
                    z.print_newline(false, z.output)
                }
                z.print_token(z.token_text);
                z.current_mode = "CONTENT";
                break;
            case "TK_CONTENT":
                if (z.token_text !== "") {
                    z.print_token(z.token_text)
                }
                z.current_mode = "TAG";
                break;
            case "TK_STYLE":
            case "TK_SCRIPT":
                if (z.token_text !== "") {
                    z.output.push("\n");
                    var n = z.token_text,
                        u, l = 1;
                    if (z.token_type === "TK_SCRIPT") {
                        u = typeof p === "function" && p
                    } else {
                        if (z.token_type === "TK_STYLE") {
                            u = typeof h === "function" && h
                        }
                    } if (g.indent_scripts === "keep") {
                        l = 0
                    } else {
                        if (g.indent_scripts === "separate") {
                            l = -z.indent_level
                        }
                    }
                    var d = z.get_full_indent(l);
                    if (u) {
                        n = u(n.replace(/^\s*/, d), g)
                    } else {
                        var i = n.match(/^\s*/)[0];
                        var r = i.match(/[^\n\r]*$/)[0].split(z.indent_string).length - 1;
                        var w = z.get_full_indent(l - r);
                        n = n.replace(/^\s*/, d).replace(/\r\n|\r|\n/g, "\n" + w).replace(/\s*$/, "")
                    } if (n) {
                        z.print_token(n);
                        z.print_newline(true, z.output)
                    }
                }
                z.current_mode = "TAG";
                break
            }
            z.last_token = z.token_type;
            z.last_text = z.token_text
        }
        return z.output.join("")
    }
    if (typeof define === "function") {
        define(function (f, e, g) {
            var d = f("./js_beautify.js").js_beautify;
            var h = f("./css_beautify.js").css_beautify;
            e.html_beautify = function (j, i) {
                return b(j, i, d, h)
            }
        })
    } else {
        if (typeof exports !== "undefined") {
            var a = require("./js_beautify.js").js_beautify;
            var c = require("./css_beautify.js").css_beautify;
            exports.html_beautify = function (e, d) {
                return b(e, d, a, c)
            }
        } else {
            if (typeof window !== "undefined") {
                window.html_beautify = function (e, d) {
                    return b(e, d, window.js_beautify, window.css_beautify)
                }
            }
        }
    }
}());
