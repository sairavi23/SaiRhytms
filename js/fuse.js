/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!function(t) {
    "use strict";
    function e() {
        console.log.apply(console, arguments)
    }
    function s(t, e) {
        var s,
            n,
            o,
            i;
        for (this.list = t, this.options = e = e || {}, s = 0, i = ["sort", "shouldSort", "verbose", "tokenize"], n = i.length; n > s; s++)
            o = i[s], this.options[o] = o in e ? e[o] : r[o];
        for (s = 0, i = ["searchFn", "sortFn", "keys", "getFn", "include", "tokenSeparator"], n = i.length; n > s; s++)
            o = i[s], this.options[o] = e[o] || r[o]
    }
    function n(t, e, s) {
        var i,
            r,
            h,
            a,
            c,
            p;
        if (e) {
            if (h = e.indexOf("."), -1 !== h ? (i = e.slice(0, h), r = e.slice(h + 1)) : i = e, a = t[i], null !== a && void 0 !== a)
                if (r || "string" != typeof a && "number" != typeof a)
                    if (o(a))
                        for (c = 0, p = a.length; p > c; c++)
                            n(a[c], r, s);
                    else
                        r && n(a, r, s);
                else
                    s.push(a)
        } else
            s.push(t);
        return s
    }
    function o(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    }
    function i(t, e) {
        e = e || {}, this.options = e, this.options.location = e.location || i.defaultOptions.location, this.options.distance = "distance" in e ? e.distance : i.defaultOptions.distance, this.options.threshold = "threshold" in e ? e.threshold : i.defaultOptions.threshold, this.options.maxPatternLength = e.maxPatternLength || i.defaultOptions.maxPatternLength, this.pattern = e.caseSensitive ? t : t.toLowerCase(), this.patternLen = t.length, this.patternLen <= this.options.maxPatternLength && (this.matchmask = 1 << this.patternLen - 1, this.patternAlphabet = this._calculatePatternAlphabet())
    }
    var r = {
        id: null,
        caseSensitive: !1,
        include: [],
        shouldSort: !0,
        searchFn: i,
        sortFn: function(t, e) {
            return t.score - e.score
        },
        getFn: n,
        keys: [],
        verbose: !1,
        tokenize: !1,
        matchAllTokens: !1,
        tokenSeparator: / +/g
    };
    s.VERSION = "2.5.0", s.prototype.set = function(t) {
        return this.list = t, t
    }, s.prototype.search = function(t) {
        this.options.verbose && e("\nSearch term:", t, "\n"), this.pattern = t, this.results = [], this.resultMap = {}, this._keyMap = null, this._prepareSearchers(), this._startSearch(), this._computeScore(), this._sort();
        var s = this._format();
        return s
    }, s.prototype._prepareSearchers = function() {
        var t = this.options,
            e = this.pattern,
            s = t.searchFn,
            n = e.split(t.tokenSeparator),
            o = 0,
            i = n.length;
        if (this.options.tokenize)
            for (this.tokenSearchers = []; i > o; o++)
                this.tokenSearchers.push(new s(n[o], t));
        this.fullSeacher = new s(e, t)
    }, s.prototype._startSearch = function() {
        var t,
            e,
            s,
            n,
            o = this.options,
            i = o.getFn,
            r = this.list,
            h = r.length,
            a = this.options.keys,
            c = a.length,
            p = null;
        if ("string" == typeof r[0])
            for (s = 0; h > s; s++)
                this._analyze("", r[s], s, s);
        else
            for (this._keyMap = {}, s = 0; h > s; s++)
                for (p = r[s], n = 0; c > n; n++) {
                    if (t = a[n], "string" != typeof t) {
                        if (e = 1 - t.weight || 1, this._keyMap[t.name] = {
                            weight: e
                        }, t.weight <= 0 || t.weight > 1)
                            throw new Error("Key weight has to be > 0 and <= 1");
                        t = t.name
                    } else
                        this._keyMap[t] = {
                            weight: 1
                        };
                    this._analyze(t, i(p, t, []), p, s)
                }
    }, s.prototype._analyze = function(t, s, n, i) {
        var r,
            h,
            a,
            c,
            p,
            l,
            u,
            f,
            d,
            g,
            m,
            y,
            k,
            v,
            S,
            b = this.options,
            _ = !1;
        if (void 0 !== s && null !== s) {
            h = [];
            var M = 0;
            if ("string" == typeof s) {
                if (r = s.split(b.tokenSeparator), b.verbose && e("---------\nKey:", t), this.options.tokenize) {
                    for (v = 0; v < this.tokenSearchers.length; v++) {
                        for (f = this.tokenSearchers[v], b.verbose && e("Pattern:", f.pattern), d = [], y = !1, S = 0; S < r.length; S++) {
                            g = r[S], m = f.search(g);
                            var L = {};
                            m.isMatch ? (L[g] = m.score, _ = !0, y = !0, h.push(m.score)) : (L[g] = 1, this.options.matchAllTokens || h.push(1)), d.push(L)
                        }
                        y && M++, b.verbose && e("Token scores:", d)
                    }
                    for (c = h[0], l = h.length, v = 1; l > v; v++)
                        c += h[v];
                    c /= l, b.verbose && e("Token score average:", c)
                }
                u = this.fullSeacher.search(s), b.verbose && e("Full text score:", u.score), p = u.score, void 0 !== c && (p = (p + c) / 2), b.verbose && e("Score average:", p), k = this.options.tokenize && this.options.matchAllTokens ? M >= this.tokenSearchers.length : !0, b.verbose && e("Check Matches", k), (_ || u.isMatch) && k && (a = this.resultMap[i], a ? a.output.push({
                    key: t,
                    score: p,
                    matchedIndices: u.matchedIndices
                }) : (this.resultMap[i] = {
                    item: n,
                    output: [{
                        key: t,
                        score: p,
                        matchedIndices: u.matchedIndices
                    }]
                }, this.results.push(this.resultMap[i])))
            } else if (o(s))
                for (v = 0; v < s.length; v++)
                    this._analyze(t, s[v], n, i)
        }
    }, s.prototype._computeScore = function() {
        var t,
            s,
            n,
            o,
            i,
            r,
            h,
            a,
            c,
            p = this._keyMap,
            l = this.results;
        for (this.options.verbose && e("\n\nComputing score:\n"), t = 0; t < l.length; t++) {
            for (n = 0, o = l[t].output, i = o.length, a = 1, s = 0; i > s; s++)
                r = o[s].score, h = p ? p[o[s].key].weight : 1, c = r * h, 1 !== h ? a = Math.min(a, c) : (n += c, o[s].nScore = c);
            1 === a ? l[t].score = n / i : l[t].score = a, this.options.verbose && e(l[t])
        }
    }, s.prototype._sort = function() {
        var t = this.options;
        t.shouldSort && (t.verbose && e("\n\nSorting...."), this.results.sort(t.sortFn))
    }, s.prototype._format = function() {
        var t,
            s,
            n,
            o,
            i,
            r = this.options,
            h = r.getFn,
            a = [],
            c = this.results,
            p = r.include;
        for (r.verbose && e("\n\nOutput:\n\n", c), o = r.id ? function(t) {
            c[t].item = h(c[t].item, r.id, [])[0]
        } : function() {}, i = function(t) {
            var e,
                s,
                n,
                o,
                i,
                r = c[t];
            if (p.length > 0) {
                if (e = {
                    item: r.item
                }, -1 !== p.indexOf("matches"))
                    for (n = r.output, e.matches = [], s = 0; s < n.length; s++)
                        o = n[s], i = {
                            indices: o.matchedIndices
                        }, o.key && (i.key = o.key), e.matches.push(i);
                -1 !== p.indexOf("score") && (e.score = c[t].score)
            } else
                e = r.item;
            return e
        }, s = 0, n = c.length; n > s; s++)
            o(s), t = i(s), a.push(t);
        return a
    }, i.defaultOptions = {
        location: 0,
        distance: 100,
        threshold: .6,
        maxPatternLength: 32
    }, i.prototype._calculatePatternAlphabet = function() {
        var t = {},
            e = 0;
        for (e = 0; e < this.patternLen; e++)
            t[this.pattern.charAt(e)] = 0;
        for (e = 0; e < this.patternLen; e++)
            t[this.pattern.charAt(e)] |= 1 << this.pattern.length - e - 1;
        return t
    }, i.prototype._bitapScore = function(t, e) {
        var s = t / this.patternLen,
            n = Math.abs(this.options.location - e);
        return this.options.distance ? s + n / this.options.distance : n ? 1 : s
    }, i.prototype.search = function(t) {
        var e,
            s,
            n,
            o,
            i,
            r,
            h,
            a,
            c,
            p,
            l,
            u,
            f,
            d,
            g,
            m,
            y,
            k,
            v,
            S,
            b,
            _,
            M = this.options;
        if (t = M.caseSensitive ? t : t.toLowerCase(), this.pattern === t)
            return {
                isMatch: !0,
                score: 0,
                matchedIndices: [[0, t.length - 1]]
            };
        if (this.patternLen > M.maxPatternLength) {
            if (y = t.match(new RegExp(this.pattern.replace(M.tokenSeparator, "|"))), k = !!y)
                for (S = [], e = 0, b = y.length; b > e; e++)
                    _ = y[e], S.push([t.indexOf(_), _.length - 1]);
            return {
                isMatch: k,
                score: k ? .5 : 1,
                matchedIndices: S
            }
        }
        for (o = M.location, n = t.length, i = M.threshold, r = t.indexOf(this.pattern, o), v = [], e = 0; n > e; e++)
            v[e] = 0;
        for (-1 != r && (i = Math.min(this._bitapScore(0, r), i), r = t.lastIndexOf(this.pattern, o + this.patternLen), -1 != r && (i = Math.min(this._bitapScore(0, r), i))), r = -1, g = 1, m = [], c = this.patternLen + n, e = 0; e < this.patternLen; e++) {
            for (h = 0, a = c; a > h;)
                this._bitapScore(e, o + a) <= i ? h = a : c = a, a = Math.floor((c - h) / 2 + h);
            for (c = a, p = Math.max(1, o - a + 1), l = Math.min(o + a, n) + this.patternLen, u = Array(l + 2), u[l + 1] = (1 << e) - 1, s = l; s >= p; s--)
                if (d = this.patternAlphabet[t.charAt(s - 1)], d && (v[s - 1] = 1), 0 === e ? u[s] = (u[s + 1] << 1 | 1) & d : u[s] = (u[s + 1] << 1 | 1) & d | ((f[s + 1] | f[s]) << 1 | 1) | f[s + 1], u[s] & this.matchmask && (g = this._bitapScore(e, s - 1), i >= g)) {
                    if (i = g, r = s - 1, m.push(r), !(r > o))
                        break;
                    p = Math.max(1, 2 * o - r)
                }
            if (this._bitapScore(e + 1, o) > i)
                break;
            f = u
        }
        return S = this._getMatchedIndices(v), {
            isMatch: r >= 0,
            score: 0 === g ? .001 : g,
            matchedIndices: S
        }
    }, i.prototype._getMatchedIndices = function(t) {
        for (var e, s = [], n = -1, o = -1, i = 0, r = t.length; r > i; i++)
            e = t[i], e && -1 === n ? n = i : e || -1 === n || (o = i - 1, s.push([n, o]), n = -1);
        return t[i - 1] && s.push([n, i - 1]), s
    }, "object" == typeof exports ? module.exports = s : "function" == typeof define && define.amd ? define(function() {
        return s
    }) : t.Fuse = s
}(this);

