/* Plant Pathology Lab OS — minimal QR Code encoder (Phase 08C)
   Written for this project: no dependency, no network, no third-party code.
   Byte mode, error-correction level M, versions 1–10 (enough for the SOP deep links).
   Implements ISO/IEC 18004: encoding, Reed–Solomon error correction, block
   interleaving, function patterns, all eight data masks with the standard penalty
   rules, format information and version information.
   Exposes QR.matrix(text) -> { size, version, mask, modules: [[0|1]] }. */
(function (root) {
  'use strict';

  /* data codewords and block layout for error-correction level M, versions 1..10:
     [ecCodewordsPerBlock, blocksGroup1, dataPerBlock1, blocksGroup2, dataPerBlock2] */
  var ECC_M = {
    1:  [10, 1, 16, 0, 0],
    2:  [16, 1, 28, 0, 0],
    3:  [26, 1, 44, 0, 0],
    4:  [18, 2, 32, 0, 0],
    5:  [24, 2, 43, 0, 0],
    6:  [16, 4, 27, 0, 0],
    7:  [18, 4, 31, 0, 0],
    8:  [22, 2, 38, 2, 39],
    9:  [22, 3, 36, 2, 37],
    10: [26, 4, 43, 1, 44]
  };
  var ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };

  /* ---- GF(256) arithmetic, primitive polynomial 0x11D ---- */
  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();
  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }
  function rsGenerator(deg) {
    var poly = [1];
    for (var i = 0; i < deg; i++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= gmul(poly[j], 1);
        next[j + 1] ^= gmul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }
  function rsRemainder(data, deg) {
    var gen = rsGenerator(deg), res = new Array(deg).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ res[0];
      res.shift(); res.push(0);
      for (var j = 0; j < deg; j++) res[j] ^= gmul(gen[j + 1], factor);
    }
    return res;
  }

  /* ---- bit stream ---- */
  function Bits() { this.bits = []; }
  Bits.prototype.push = function (val, len) {
    for (var i = len - 1; i >= 0; i--) this.bits.push((val >>> i) & 1);
  };

  function utf8(text) {
    var out = [], enc = unescape(encodeURIComponent(text));
    for (var i = 0; i < enc.length; i++) out.push(enc.charCodeAt(i) & 0xFF);
    return out;
  }

  function totalDataCodewords(v) {
    var e = ECC_M[v];
    return e[1] * e[2] + e[3] * e[4];
  }

  function encodeData(bytes, version) {
    var lenBits = version < 10 ? 8 : 16;
    var bs = new Bits();
    bs.push(0x4, 4);                     /* byte mode */
    bs.push(bytes.length, lenBits);
    for (var i = 0; i < bytes.length; i++) bs.push(bytes[i], 8);
    var capacity = totalDataCodewords(version) * 8;
    if (bs.bits.length > capacity) return null;
    for (var t = 0; t < 4 && bs.bits.length < capacity; t++) bs.bits.push(0);   /* terminator */
    while (bs.bits.length % 8 !== 0) bs.bits.push(0);
    var cw = [];
    for (var b = 0; b < bs.bits.length; b += 8) {
      var val = 0;
      for (var k = 0; k < 8; k++) val = (val << 1) | bs.bits[b + k];
      cw.push(val);
    }
    var pad = [0xEC, 0x11], p = 0;
    while (cw.length < totalDataCodewords(version)) cw.push(pad[p++ % 2]);
    return cw;
  }

  function interleave(data, version) {
    var e = ECC_M[version], ecLen = e[0];
    var blocks = [], ecBlocks = [], pos = 0, i, j;
    for (i = 0; i < e[1]; i++) { blocks.push(data.slice(pos, pos + e[2])); pos += e[2]; }
    for (i = 0; i < e[3]; i++) { blocks.push(data.slice(pos, pos + e[4])); pos += e[4]; }
    for (i = 0; i < blocks.length; i++) ecBlocks.push(rsRemainder(blocks[i], ecLen));
    var out = [], maxData = Math.max(e[2], e[4]);
    for (j = 0; j < maxData; j++)
      for (i = 0; i < blocks.length; i++) if (j < blocks[i].length) out.push(blocks[i][j]);
    for (j = 0; j < ecLen; j++)
      for (i = 0; i < ecBlocks.length; i++) out.push(ecBlocks[i][j]);
    return out;
  }

  /* ---- matrix ---- */
  function blank(size) {
    var m = [], r;
    for (r = 0; r < size; r++) m.push(new Array(size).fill(null));
    return m;
  }
  function placeFinder(m, row, col) {
    for (var r = -1; r <= 7; r++) for (var c = -1; c <= 7; c++) {
      var rr = row + r, cc = col + c;
      if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
      var on = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
               (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
               (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      m[rr][cc] = on ? 1 : 0;
    }
  }
  function functionPatterns(version) {
    var size = version * 4 + 17, m = blank(size), i, j;
    placeFinder(m, 0, 0); placeFinder(m, 0, size - 7); placeFinder(m, size - 7, 0);
    for (i = 8; i < size - 8; i++) { var bit = (i % 2 === 0) ? 1 : 0; m[6][i] = bit; m[i][6] = bit; }
    var al = ALIGN[version];
    for (i = 0; i < al.length; i++) for (j = 0; j < al.length; j++) {
      var r = al[i], c = al[j];
      if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
      for (var dr = -2; dr <= 2; dr++) for (var dc = -2; dc <= 2; dc++)
        m[r + dr][c + dc] = (Math.max(Math.abs(dr), Math.abs(dc)) !== 1) ? 1 : 0;
    }
    m[size - 8][8] = 1;                                   /* dark module */
    for (i = 0; i <= 8; i++) {                            /* reserve format areas */
      if (m[8][i] === null) m[8][i] = 0;
      if (m[i][8] === null) m[i][8] = 0;
    }
    for (i = 0; i < 8; i++) {
      if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = 0;
      if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = 0;
    }
    if (version >= 7) for (i = 0; i < 6; i++) for (j = 0; j < 3; j++) {
      m[size - 11 + j][i] = 0; m[i][size - 11 + j] = 0;
    }
    return m;
  }
  function reserved(version) {
    var fp = functionPatterns(version), res = [], r, c;
    for (r = 0; r < fp.length; r++) { res.push([]); for (c = 0; c < fp.length; c++) res[r].push(fp[r][c] !== null); }
    return res;
  }
  function placeData(m, res, codewords) {
    var size = m.length, bitIdx = 0, upward = true;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var v = 0; v < size; v++) {
        var row = upward ? size - 1 - v : v;
        for (var k = 0; k < 2; k++) {
          var col = right - k;
          if (res[row][col]) continue;
          var bit = 0;
          if (bitIdx < codewords.length * 8) bit = (codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1;
          m[row][col] = bit; bitIdx++;
        }
      }
      upward = !upward;
    }
  }
  function maskFn(n, r, c) {
    switch (n) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    }
  }
  function formatBits(mask) {
    var data = (0x0 << 3) | mask;          /* ECC level M = 00 */
    var rem = data;
    for (var i = 0; i < 10; i++) rem = (rem << 1) ^ (((rem >>> 9) & 1) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  }
  function versionBits(version) {
    var rem = version;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ (((rem >>> 11) & 1) * 0x1F25);
    return (version << 12) | rem;
  }
  function applyFormat(m, mask) {
    var size = m.length, bits = formatBits(mask), i;
    /* copy 1: down column 8 past the top-left finder, then left along row 8 */
    for (i = 0; i <= 5; i++) m[i][8] = (bits >>> i) & 1;
    m[7][8] = (bits >>> 6) & 1; m[8][8] = (bits >>> 7) & 1; m[8][7] = (bits >>> 8) & 1;
    for (i = 9; i < 15; i++) m[8][14 - i] = (bits >>> i) & 1;
    /* copy 2: along row 8 from the right edge, then up column 8 from the bottom */
    for (i = 0; i < 8; i++) m[8][size - 1 - i] = (bits >>> i) & 1;
    for (i = 8; i < 15; i++) m[size - 15 + i][8] = (bits >>> i) & 1;
    m[size - 8][8] = 1;
  }
  function applyVersion(m, version) {
    if (version < 7) return;
    var size = m.length, bits = versionBits(version);
    for (var i = 0; i < 18; i++) {
      var bit = (bits >>> i) & 1, a = Math.floor(i / 3), b = i % 3;
      m[size - 11 + b][a] = bit; m[a][size - 11 + b] = bit;
    }
  }
  function penalty(m) {
    var size = m.length, score = 0, r, c, i, run, dark = 0;
    for (r = 0; r < size; r++) {                       /* rule 1: rows and columns */
      run = 1;
      for (c = 1; c < size; c++) {
        if (m[r][c] === m[r][c - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
        else run = 1;
      }
    }
    for (c = 0; c < size; c++) {
      run = 1;
      for (r = 1; r < size; r++) {
        if (m[r][c] === m[r - 1][c]) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
        else run = 1;
      }
    }
    for (r = 0; r < size - 1; r++) for (c = 0; c < size - 1; c++)   /* rule 2: 2x2 blocks */
      if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) score += 3;
    var pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function hit(get, n) {                                          /* rule 3: finder-like */
      for (i = 0; i + 11 <= n; i++) {
        var ok1 = true, ok2 = true;
        for (var k = 0; k < 11; k++) { var v = get(i + k); if (v !== pat1[k]) ok1 = false; if (v !== pat2[k]) ok2 = false; }
        if (ok1) score += 40; if (ok2) score += 40;
      }
    }
    for (r = 0; r < size; r++) hit(function (x) { return m[r][x]; }, size);
    for (c = 0; c < size; c++) hit(function (x) { return m[x][c]; }, size);
    for (r = 0; r < size; r++) for (c = 0; c < size; c++) if (m[r][c]) dark++;   /* rule 4 */
    var pct = dark * 100 / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  function matrix(text, forceMask) {
    var bytes = utf8(text), version = 0, cw = null;
    for (var v = 1; v <= 10; v++) { cw = encodeData(bytes, v); if (cw) { version = v; break; } }
    if (!version) throw new Error('QR: text too long for versions 1-10');
    var all = interleave(cw, version);
    var res = reserved(version), best = null, bestScore = Infinity, bestMask = 0;
    for (var mask = 0; mask < 8; mask++) {
      if (forceMask != null && mask !== forceMask) continue;
      var m = functionPatterns(version);
      placeData(m, res, all);
      for (var r = 0; r < m.length; r++) for (var c = 0; c < m.length; c++)
        if (!res[r][c] && maskFn(mask, r, c)) m[r][c] ^= 1;
      applyVersion(m, version); applyFormat(m, mask);
      var s = penalty(m);
      if (s < bestScore) { bestScore = s; best = m; bestMask = mask; }
    }
    return { size: best.length, version: version, mask: bestMask, modules: best };
  }

  /* SVG rendering: fixed black on white with a four-module quiet zone, so the code
     stays scannable in dark mode and when printed. */
  function svg(text, opts) {
    opts = opts || {};
    var q = opts.quiet == null ? 4 : opts.quiet, m = matrix(text), n = m.size, total = n + q * 2;
    var d = '', r, c, runStart;
    for (r = 0; r < n; r++) {
      c = 0;
      while (c < n) {
        if (m.modules[r][c]) {
          runStart = c;
          while (c + 1 < n && m.modules[r][c + 1]) c++;
          d += 'M' + (runStart + q) + ' ' + (r + q) + 'h' + (c - runStart + 1) + 'v1h-' + (c - runStart + 1) + 'z';
        }
        c++;
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total +
      '" shape-rendering="crispEdges" width="' + (opts.px || 160) + '" height="' + (opts.px || 160) + '"' +
      ' role="img" aria-label="' + (opts.label || 'QR code').replace(/[<>&"]/g, '') + '">' +
      '<rect width="' + total + '" height="' + total + '" fill="#FFFFFF"/>' +
      '<path d="' + d + '" fill="#000000"/></svg>';
  }

  var api = { matrix: matrix, svg: svg };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QR = api;
})(typeof window !== 'undefined' ? window : this);
