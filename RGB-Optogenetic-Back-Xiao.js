// @version: v0.1.0
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
  var d = mi(0.4) // 0.4
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = mi(1.25) // 1.0
  const d_square = `M -${s} ${s} L ${s} ${s} L ${s} -${s} L -${s} -${s} L -${s} ${s}`
  const d_round = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const dist = 0.100
  return {
    GND: {"pos":[0, dist],"shape":d_round,"layers":["F.Cu"]},
    GND_hole: {"pos":[0, dist],"shape":d_hole,"layers":["drill"]},
    VCC: {"pos":[0, -dist],"shape":d_square,"layers":["F.Cu"]},
    VCC_hole: {"pos":[0, -dist],"shape":d_hole,"layers":["drill"]}
  }  
}()

// Single Round Through-Hole Pad
const Single_Pad = function() {
  var d = mi(0.4) // 0.4
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = mi(1.25) // 1.0
  var d_pad = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  return {
    Sig: {"pos":[0, 0],"shape":d_pad,"layers":["F.Cu"]},
    Sig_hole: {"pos":[0, 0],"shape":d_hole,"layers":["drill"]},
  }  
}()

const Single_Square_Pad = function() {
  var d = mi(0.4) // 0.4
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = mi(1.25) // 1.0
  const d_square = `M -${s} ${s} L ${s} ${s} L ${s} -${s} L -${s} -${s} L -${s} ${s}`
  const dist = 0
  return {
    VCC: {"pos":[0, -dist],"shape":d_square,"layers":["F.Cu"]},
    VCC_hole: {"pos":[0, -dist],"shape":d_hole,"layers":["drill"]}
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
  r: mi(1.0),          // 1.0mm
  w: mi(22.0),         // 22.0
  h: mi(60.0)          // 60.0
}
iw = b.w
ih = b.h


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
const xiao = board.add(XIAO_SMD, {translate: pt(-b.w/2 + mi(10.65), 0), rotate: 90, name: "XAIO"}) // mi(11.57) to align XIAO board
//const vcc_jumper = board.add(C_1206_JUMP, {translate: pt(-b.w/2+ 0.170, -0.550), rotate: 0, name: "XAIO"})

// Mirrored Through-Hole Connectors
const distance = mi(25.0) // 25.0
const pp = board.add(Mirrored_Power_Pads, {translate: pt(-iw/2+mi(2.19), distance)}) // -iw/2+mi(2.19)
const sp = board.add(Single_Pad, {translate: pt(-iw/2+mi(2.19), -distance)})

// Signal Resistor
const signal_r = board.add(C_1206_JUMP, {
  translate: pt(xiao.padX("3"), xiao.padY("3")-mi(7.5)), rotate: 90
})

// Schottky
const schottky = board.add(C_1206_JUMP, {
  translate: pt(xiao.padX("5V"), xiao.padY("5V")+mi(5.0)), rotate: 90
})

// External VCC
const ext_5v = board.add(Single_Square_Pad, {
  translate: pt(-iw/2+mi(2.19), 0.73)
})

// External GND
const ext_gnd = board.add(Single_Pad, {
  translate: pt(pp.padX("GND")+0.25, pp.padY("GND"))
})

/* -- ADD_WIRES -- */
const power_line = mi(1.00)
const signal_line = mi(1.00)

const gnd_y_offset = 0.080
const gnd_x_offset = mi(6.00)

const r = 0.033 // 0.033
const e = mi(1.69)  // extend to edge wires
const type = "fillet" // or "fillet", "chamfer"

// Manual Wires

//VCC

board.wire(path(
  pp.pad("VCC"),
  [type, r, pt(xiao.padX("5V"), pp.padY("VCC"))],
  schottky.pad("1"),
), power_line)

board.wire(path(
  schottky.pad("0"),
  xiao.pad("5V"),
), power_line)

// GND
var v = {}
v.x = 0.36 // 0.36
board.wire(path(
  xiao.pad("GND"),
  [type, r*2.00, pt(xiao.padX("GND"), pp.padY("GND"))],
  pp.pad("GND"),
), power_line)

board.wire(path(
  pp.pad("GND"),
  ext_gnd.pad("Sig")
), power_line)


// Signal Wires
pin = "3"
board.wire(path(
  sp.pad("Sig"),
  [type, r*2.0, pt(signal_r.padX("0"), sp.padY("Sig"))],
  signal_r.pad("0")
), signal_line)

board.wire(path(
  signal_r.pad("1"),
  [type, r*2.0, pt(xiao.padX(pin), signal_r.padY("1"))],
  xiao.pad(pin),
), signal_line)



/* -- RENDER_PCB -- */
const board_padding = mi(1.5)
const limit0 = pt(-b.w/2-board_padding, -b.h/2-board_padding);
const limit1 = pt(b.w/2+board_padding, b.h/2+board_padding);
const xMin = Math.min(limit0[0], limit1[0]);
const xMax = Math.max(limit0[0], limit1[0]);
const yMin = Math.min(limit0[1], limit1[1]);
const yMax = Math.max(limit0[1], limit1[1]);

renderPCB({
  pcb: board,
  layerColors: {
    "interior": "#c2c2c2ff",
    //"B.Cu": "#ff4c007f",
    "F.Cu": "#ff00ffb7",
    "drill": "#000000ff",
    //"padLabels": "#ffff99e5",
    //"componentLabels": "#00e5e5e5",
  },
  limits: {
    x: [xMin, xMax],
    y: [yMin, yMax]
  },
  mm_per_unit: 25.4
});
