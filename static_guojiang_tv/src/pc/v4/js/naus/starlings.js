!(function (n, r) { typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = r() : typeof define === 'function' && define.amd ? define(r) : n.starlings = r() }(this, function () { 'use strict'; return function (n, r, t, o, e, u, i, f) { var a = f.onSetup; void 0 === a && (a = null); var v = f.onRepeat; void 0 === v && (v = null); var c = f.modifier; void 0 === c && (c = null); var l = f.perspective; void 0 === l && (l = 1); var d = f.pixelRatio; void 0 === d && (d = 1); var m = f.triangles; void 0 === m && (m = !1); var s; var p; var y = r.length; var w = function (n, r) { var t = s.createShader(n); return s.shaderSource(t, r), s.compileShader(t), t }; var b = function () { for (var n = 0; n < o.length; n += 1) { for (var r = s.createBuffer(), e = o[n], u = e.data(0, 0).length, i = new Float32Array(t * y * u), f = 0; f < t; f += 1) for (var a = e.data(f, t), v = f * y * u, l = 0; l < y; l += 1) for (var d = 0; d < u; d += 1)c !== null && e.name === c.attribute ? i[v] = c.value(i[v], a, d, l) : i[v] = a[d], v += 1; s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, i, s.STATIC_DRAW); var m = s.getAttribLocation(p, o[n].name); s.enableVertexAttribArray(m), s.vertexAttribPointer(m, u, s.FLOAT, !1, !1, 0, 0) } }; var A = function () { e.push({name: 'uMVP', type: 'mat4'}); for (var n = 0; n < e.length; n += 1) { var r = s.getUniformLocation(p, e[n].name); e[n].location = r } }; var F = {float: function (n, r) { return s.uniform1f(n, r) }, vec2: function (n, r) { return s.uniform2fv(n, r) }, vec3: function (n, r) { return s.uniform3fv(n, r) }, vec4: function (n, r) { return s.uniform4fv(n, r) }, mat2: function (n, r) { return s.uniformMatrix2fv(n, !1, r) }, mat3: function (n, r) { return s.uniformMatrix3fv(n, !1, r) }, mat4: function (n, r) { return s.uniformMatrix4fv(n, !1, r) }}; var g = function () { s.clear(16640), s.useProgram(p), v !== null && v(s, p, e); for (var n = 0; n < e.length; n += 1)F[e[n].type](e[n].location, e[n].value); s.drawArrays(m ? s.TRIANGLES : s.POINTS, 0, y * t), requestAnimationFrame(g) }; var h = function () { n.width = n.clientWidth * d, n.height = n.clientHeight * d; var r = s.drawingBufferWidth; var t = s.drawingBufferHeight; s.viewport(0, 0, r, t), e[e.length - 1].value = [l / (r / t), 0, 0, 0, 0, l, 0, 0, 0, 0, -1, -1, 0, 0, 1, 1] }; s = n.getContext('webgl'), p = s.createProgram(), s.attachShader(p, w(s.VERTEX_SHADER, u)), s.attachShader(p, w(s.FRAGMENT_SHADER, i)), s.linkProgram(p), A(), h(), b(), a !== null && a(s), g(), window.addEventListener('resize', h, !1) } }))