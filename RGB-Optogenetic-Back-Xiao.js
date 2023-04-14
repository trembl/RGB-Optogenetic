// @version: v0.0.1
22/* -- HELPER FUNCTIONS -- */
const mm_to_inch = mi = inch => inch/25.4

/* -- DECLARE_COMPONENTS -- */

/*
Modular XIAO Footprint with variable holes
s -> hole size
d_pad -> single XIAO pad in SVG
d_hole -> single hole in SVG, s changes size
*/
var XIAO_SMD = function() {
  const h = 0.08 // pin height // 0.06
  const d_pad = `M -${h} 0.03 L ${h} 0.03 L ${h} -0.03 L -${h} -0.03 L -${h} 0.03`
  const s = 0.019 // 0.019 // hole size
  var d_hole = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const footprints = [
    {o:  0.3, dir: 1, r:["5V","GND","3V","10","9","8","7"]},           // reversed! For mounting on pin-headers on the BACK of the board!
    {o: -0.3, dir: -1, r:["0","1","2","3","4","5","6"]}
  ]
  var i = 0, out = {}
  footprints.forEach(function(row) {
    var offset = 0.3
    row.r.forEach(function(a) {
      var pos = [row.o+mi(1.0)*row.dir, offset]
      var hole_pos = [row.o, offset]
      out[a] = {"pos":pos,"shape":d_pad,"layers":["F.Cu"],"index":i++}
  //    out["___"+a+""] = {"pos":hole_pos,"shape":d_hole,"layers":["drill"],"index":i++}
      offset = offset-0.1 // 0.1
    })
  })
  return out
}()


// Single Drill Hole
const Drill_Hole = function(d = mi(0.99)) {
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  return {
    hole: {"pos":[0,0],"shape":d_hole,"layers":["drill"]}
  }  
}()


// Through-Hole Power Pads 
const Mirrored_Power_Pads = function() {
  var d = mi(0.74)
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = 0.052
  const d_square = `M -${s} ${s} L ${s} ${s} L ${s} -${s} L -${s} -${s} L -${s} ${s}`
  const d_round = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const dist = 0.100
  return {
    VCC: {"pos":[0, dist],"shape":d_round,"layers":["F.Cu"]},
    VCC_hole: {"pos":[0, dist],"shape":d_hole,"layers":["drill"]},
    GND: {"pos":[0, -dist],"shape":d_square,"layers":["F.Cu"]},
    GND_hole: {"pos":[0, -dist],"shape":d_hole,"layers":["drill"]}
  }  
}()

// Single Round Through-Hole Pad
const Single_Pad = function() {
  var d = mi(0.74) // 0.74
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = d * 2
  var d_pad = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  return {
    Sig: {"pos":[0, 0],"shape":d_pad,"layers":["F.Cu"]},
    Sig_hole: {"pos":[0, 0],"shape":d_hole,"layers":["drill"]},
  }  
}()


const C_1206 = {
  "VCC":{"shape":"M -0.032,0.034L 0.032,0.034L 0.032,-0.034L -0.032,-0.034L -0.032,0.034","pos":[-0.06,0],"layers":["F.Cu"],"index":1},
  "GND":{"shape":"M -0.032,0.034L 0.032,0.034L 0.032,-0.034L -0.032,-0.034L -0.032,0.034","pos":[0.06,0],"layers":["F.Cu"],"index":2}
}
const C_1206_JUMP = {
  "0":{"shape":"M -0.032,0.034L 0.032,0.034L 0.032,-0.034L -0.032,-0.034L -0.032,0.034","pos":[-0.06,0],"layers":["F.Cu"],"index":1},
  "1":{"shape":"M -0.032,0.034L 0.032,0.034L 0.032,-0.034L -0.032,-0.034L -0.032,0.034","pos":[0.06,0],"layers":["F.Cu"],"index":2}
}


/* -- DECLARE_PCB -- */
let board = new PCB();

// Board Size, Standard 96-Well Size
const b = {
  wall: mi(2.0),               // 2.0 offset to make board fit within 96 well
  r: mi(1.0),                  // 3.0mm is ok
  w: mi(27),               // 127.76 - from 96 spec
  h: mi(45)                 // 85.48  - from 96 spec
}
iw = b.w - b.wall*2
ih = b.h - b.wall*2


// Interior
let interior = path(
  pt(-iw/2, 0),
  ["fillet", b.r, pt(-iw/2, ih/2)],
  ["fillet", b.r, pt(iw/2, ih/2)],
  ["fillet", b.r, pt(iw/2, -ih/2)],
  ["fillet", b.r, pt(-iw/2, -ih/2)],
  pt(-iw/2, 0)
)
board.addShape("interior", interior);

/* -- ADD_COMPONENTS -- */

// XIAO
const xiao = board.add(XIAO_SMD, {translate: pt(-b.w/2 + mi(11.57), 0), rotate: 90, name: "XAIO"}) // mi(11.57) to align XIAO board
//const vcc_jumper = board.add(C_1206_JUMP, {translate: pt(-b.w/2+ 0.170, -0.550), rotate: 0, name: "XAIO"})

// Mirrored Through-Hole Connectors
const distance = 0.60 // default 0.60
const pp = board.add(Mirrored_Power_Pads, {translate: pt(-iw/2+mi(2.19), distance)}) // -iw/2+mi(2.19)
const sp = board.add(Single_Pad, {translate: pt(-iw/2+mi(2.19), -distance)})



/* -- ADD_WIRES -- */
const power_line = mi(0.75)
const signal_line = mi(0.50)

const gnd_y_offset = 0.080
const gnd_x_offset = mi(6.00)

const r = 0.033 // 0.033
const e = mi(1.69)  // extend to edge wires
const type = "fillet" // or "fillet", "chamfer"

// Manual Wires

// GND
var v = {}
v.x = 0.36 // 0.36
board.wire(path(
  xiao.pad("5V"),
  [type, r, pt(xiao.padX("5V"), 0)],
  [type, r, pt(v.x, 0)],
  [type, r, pt(v.x, pp.padY("VCC"))],
  pp.pad("VCC"),
), power_line)

//VCC
board.wire(path(
  pp.pad("GND"),
  [type, r, pt(xiao.padX("GND"), pp.padY("GND"))],
  xiao.pad("GND"),
), power_line)

// Signal Wires
pin = "3"
board.wire(path(
  sp.pad("Sig"),
  [type, r*3.0, pt(xiao.padX(pin), sp.padY("Sig"))],
  xiao.pad(pin),
), signal_line)







/* -- RENDER_PCB -- */
const limit0 = pt(-b.w/2, -b.h/2);
const limit1 = pt(b.w/2, b.h/2);
const xMin = Math.min(limit0[0], limit1[0]);
const xMax = Math.max(limit0[0], limit1[0]);
const yMin = Math.min(limit0[1], limit1[1]);
const yMax = Math.max(limit0[1], limit1[1]);

renderPCB({
  pcb: board,
  layerColors: {
    "interior": "#ff0000ff",
    //"B.Cu": "#ff4c007f",
    "F.Cu": "#ff00ffb7",
    //"drill": "#000000ff",
    //"padLabels": "#ffff99e5",
    //"componentLabels": "#00e5e5e5",
  },
  limits: {
    x: [xMin, xMax],
    y: [yMin, yMax]
  },
  mm_per_unit: 25.4
});
