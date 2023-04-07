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
var XIAO = function() {
  const s = 0.019
  const d_pad = "M -0.06 0.03 L 0.06 0.03 L 0.06 -0.03 L -0.06 -0.03 L -0.06 0.03"
  var d_hole = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const footprints = [
    {o:  0.3, r:["0", "1"]},           // reversed! For mounting on pin-headers on the BACK of the board!
    {o: -0.3, r:["5V", "GND"]}
  ]
  var i = 0, out = {}
  footprints.forEach(function(row) {
    var offset = 0.3
    row.r.forEach(function(a) {
      var pos = [row.o,offset]
      out[a] = {"pos":pos,"shape":d_pad,"layers":["F.Cu"],"index":i++}
      out["___"+a+""] = {"pos":pos,"shape":d_hole,"layers":["drill"],"index":i++}
      offset = offset-0.1
    })
  })
  delete out["0"]; delete out["___0"] // delete 0 pin
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
const Power_Pads = function() {
  var d = mi(0.74)
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = 0.052
  const d_square = `M -${s} ${s} L ${s} ${s} L ${s} -${s} L -${s} -${s} L -${s} ${s}`
  const d_round = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const dist = 0.100
  return {
    VCC: {"pos":[0, -dist],"shape":d_round,"layers":["F.Cu"]},
    VCC_hole: {"pos":[0, -dist],"shape":d_hole,"layers":["drill"]},
    GND: {"pos":[0, dist],"shape":d_square,"layers":["F.Cu"]},
    GND_hole: {"pos":[0, dist],"shape":d_hole,"layers":["drill"]}
  }  
}()

// Single Round Through-Hole Pad
const Single_Pad = function() {
  var d = mi(0.74)
  var d_hole = `M -${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 ${d} 0 A ${d} ${d} 90 0 0 -${d} 0`
  const s = d * 2
  var d_pad = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  return {
    Sig: {"pos":[0, 0],"shape":d_pad,"layers":["F.Cu"]},
    Sig_hole: {"pos":[0, 0],"shape":d_hole,"layers":["drill"]},
  }  
}()


// LED_RGB_WS2812B
const LED_RGB_WS2812B = function() {
  // Single Pad
  const a = 0.03 // 0.03
  const b = 0.018 // 0.18
  const f = 0.018 // 0.004 // angle
  // Pad Positions
  const x = 0.0964 // 0.0964
  const y = 0.0649 // 0.0649
  const LED_PAD_SHAPE =       `M ${-a} ${b} L ${a} ${b} L ${a} ${-b} L ${-a} ${-b} L ${-a} ${b}`
  const LED_PAD_SHAPE_ANGLE = `M ${-a} ${b} L ${a} ${b} L ${a} ${-b} L ${-a} ${-b} L ${-a} ${b-f} L ${-a+f} ${b} `
  
  return {
    "VCC":{"alias": 1,"pos":[-x,y],"shape": LED_PAD_SHAPE,"layers":["F.Cu"]},
    "OUT":{"alias": 2,"pos":[-x,-y],"shape":LED_PAD_SHAPE,"layers":["F.Cu"]},
    "GND":{"alias": 3, "pos":[x,-y],"shape":LED_PAD_SHAPE_ANGLE,"layers":["F.Cu"]},
    "IN":{"alias": 4,"pos":[x,y], "shape":LED_PAD_SHAPE,"layers":["F.Cu"]}
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
  wall: mi(2.0),               // offset to make board fit within 96 well
  r: mi(3.0),                  // 3mm is ok
  a1_row_offset: mi(11.24),    // 11.24  - from 96 spec
  a1_column_offset: mi(14.38), // 14.38  - from 96 spec
  w: mi(127.76),               // 127.76 - from 96 spec
  h: mi(85.48)                 // 85.48  - from 96 spec
}
iw = b.w - b.wall*2
ih = b.h - b.wall*2

// Output Size of the Board
// iw = 123.76, ih = 81.48
console.log("width: ", iw, "height: ", iw)

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

var offset = {
  x: -b.w/2 + b.a1_column_offset, 
  y: b.h/2 - b.a1_row_offset
}

var nr_of_LEDs = 96 
nr_of_LEDs = Math.max(nr_of_LEDs, 2)
var LEDs_per_row = 12
var spacing = mi(9)
var LEDs = []
var Cs = []

// Create Array of LEDs
LED_Array = [...Array(nr_of_LEDs).keys()]

LED_Matrix = []
var i = 0
var lookup = [...LED_Array.slice(0, LEDs_per_row)].reverse()
while (LED_Array.length > 0) {
  var a = LED_Array.splice(0, LEDs_per_row)
  a = a.map(x => x % LEDs_per_row)
  if (i % 2) a = a.map(x => lookup.indexOf(x)) // reverse lookup
  LED_Matrix.push(a)
  i = i+1
}

LED_Matrix.forEach(function(row, rowNr) {
  var altRow = ((rowNr % 2) === 1) 
  var rotate = altRow ? -90 : 90
  row.forEach(function(columnNr) {
    var x = columnNr*spacing+offset.x
    var y = -rowNr*spacing+offset.y
    var translate = pt(x,y)
    var led = board.add(LED_RGB_WS2812B, {translate, rotate, name: "LED_RGB_WS2812B"})
    led.altRow = altRow
    LEDs.push(led)
    var ox = altRow ? 1 : -1
    var x = columnNr*spacing+offset.x+(ox*spacing/2)
    var translate = pt(x,y)
    var c = board.add(C_1206, {translate, rotate, name: "C_1206"})
    c.altRow = altRow
    Cs.push(c)
  })
})

// Add Minimal XIAO
//const xiao = board.add(XIAO, {translate: pt(-b.w/2+ 0.393, 0), rotate: 90, name: "XAIO"})
//const vcc_jumper = board.add(C_1206_JUMP, {translate: pt(-b.w/2+ 0.170, -0.550), rotate: 0, name: "XAIO"})


// Add Mounting Holes
var m = {offset:mi(2.50)}
m.x1 = -b.w/2+b.wall+m.offset
m.x2 = b.w/2-b.wall-m.offset
m.y1 = -b.h/2+b.wall+m.offset
m.y2 = b.h/2-b.wall-m.offset
const mh1 = board.add(Drill_Hole, {translate: pt(m.x1, m.y1)})
const mh15 = board.add(Drill_Hole, {translate: pt(0, m.y2)})
const mh2 = board.add(Drill_Hole, {translate: pt(m.x2, m.y1)})
const mh25 = board.add(Drill_Hole, {translate: pt(m.x2, 0)})
const mh3 = board.add(Drill_Hole, {translate: pt(m.x2, m.y2)})
const mh35 = board.add(Drill_Hole, {translate: pt(0, -m.y2)})
const mh4 = board.add(Drill_Hole, {translate: pt(m.x1, m.y2)})


// Add additional 5V Power Pads
const distance = 0.55 // default 0.55
const pp = board.add(Power_Pads, {translate: pt(-2.35, -distance)})
const sp = board.add(Single_Pad, {translate: pt(-2.35, distance)})









/* -- ADD_WIRES -- */
const power_line = mm_to_inch(0.75)
const signal_line = mm_to_inch(0.50)

const gnd_y_offset = 0.080
const gnd_x_offset = mi(6.00)

const r = 0.033 // 0.033
const e = mi(1.69)  // extend to edge wires
const type = "fillet" // or "fillet", "chamfer"

const createWires = function(led0, led1, c) {
  const direction = d = (led0.altRow) ? -1 : 1
  const gyo = gnd_y_offset * d
  //const r = signal_lines*3.0
 

  // OUT/IN Wires
  var points = [[type, r, pt(led0.padX("OUT"), c.posY)]]
  if (led0.altRow !== led1.altRow) {
    points = [
      [type, r, pt(c.posX+e*d, led0.padY("OUT"))],
      [type, r, pt(c.posX+e*d, c.posY)]
    ]
  } 
  board.wire(
    path(
      led0.pad("OUT"),
      ...points,
      c.pos,
      [type, r, pt(led1.padX("IN"), c.posY)],
      led1.pad("IN")
    ), signal_line
  )

  // GND Wires
  var gnd_points = [
    led0.pad("GND"),
    pt(led0.padX("GND"), led0.padY("GND") + gyo),
    pt(led1.padX("GND"), led1.padY("GND") + gyo),
    led1.pad("GND")
  ]
  
  var gnd_points2 = [
    c.pad("GND"),
    pt(c.padX("GND"), led1.padY("GND") + gyo)
  ]
  
  if (led0.altRow !== led1.altRow) {
    gnd_points = [
      pt(led0.padX("GND"), led0.padY("GND") + gyo),
      [type, r*2, pt(led0.padX("GND")+gnd_x_offset, led0.padY("GND") + gyo)],
      [type, r*2, pt(led1.padX("IN")+gnd_x_offset, led1.padY("GND") - gyo)],
      pt(led1.padX("GND"), led1.padY("GND") - gyo),
      led1.pad("GND")
    ]
    gnd_points2 = [
      c.pad("GND"),
      pt(c.padX("GND")+0.00, led1.padY("GND") - gyo),
      pt(led0.padX("GND"), led1.padY("GND") - gyo),
    ]
  }
    
  board.wire(path(...gnd_points), power_line)
  board.wire([...gnd_points2], power_line)
  
  // VCC Power Wires
  var vcc_points = []
  var vcc_points2 = []
  if (led0.altRow === led1.altRow) {
    vcc_points = [
      led0.pad("VCC"),
      pt(led0.padX("VCC"), led0.padY("VCC") - gyo),
      pt(led1.padX("VCC"), led1.padY("VCC") - gyo),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      pt(c.padX("VCC"), led1.padY("VCC") - gyo),
    ]
  }
  
  if (led0.altRow < led1.altRow) {
    vcc_points = [
      led0.pad("VCC"),
      pt(led0.padX("VCC"), led0.padY("VCC") - gyo),
      pt(led1.padX("VCC"), led1.padY("VCC") + gyo),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      [type, r, pt(c.padX("VCC"), led1.padY("VCC") + gyo)],
      pt(led1.padX("VCC"), led1.padY("VCC") + gyo),
    ]
  }

  if (led0.altRow > led1.altRow) {
    vcc_points = [
      led0.pad("VCC"),
      pt(led0.padX("VCC"), led0.padY("VCC") - gyo),
      [type, r*2, pt(led1.padX("VCC")-gnd_x_offset, led0.padY("VCC") - gyo)],
      [type, r*2, pt(led1.padX("VCC")-gnd_x_offset, led1.padY("VCC") + gyo)], 
      pt(led1.padX("VCC"), led1.padY("VCC") + gyo),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      [type, r, pt(c.padX("VCC"), led1.padY("VCC") + gyo)],
      pt(led1.padX("VCC"), led1.padY("VCC") + gyo),
    ]
  }
  
  board.wire(path(...vcc_points), power_line)
  board.wire(path(...vcc_points2), power_line)
}

for (var i=1; i<nr_of_LEDs; i++) {
  createWires(LEDs[i-1], LEDs[i], Cs[i])
}



// Manual Wires
// GND
board.wire(path(
  LEDs[0].pad("GND"),
  pt(LEDs[0].padX("GND"), LEDs[0].padY("GND")+gnd_y_offset),
  pt(Cs[0].padX("GND"), LEDs[0].padY("GND")+gnd_y_offset),
  Cs[0].pad("GND"),
), power_line)


//VCC
board.wire(path(
  Cs[0].pad("VCC"),
  pt(Cs[0].padX("VCC"), LEDs[0].padY("VCC")-gnd_y_offset),
), power_line)






// Signal Wires

// Power VCC
board.wire(path(
  pp.pad("VCC"),
  [type, r*5, pt(pp.padX("VCC"), LEDs[95].padY("GND")-gnd_y_offset)],
  pt(LEDs[95].padX("GND"), LEDs[95].padY("GND")-gnd_y_offset),
), power_line)

// Power GND
board.wire(path(
  pp.pad("GND"),
  pt(pp.padX("GND")+gnd_y_offset, pp.padY("GND"))
), power_line*2)

// SIGNAL 1
board.wire(path(
  sp.pad("Sig"),
  [type, r, pt(sp.padX("Sig"), LEDs[0].posY)],
  [type, r, pt(LEDs[0].padX("IN"), LEDs[0].posY)],
  LEDs[0].pad("IN"),
), signal_line)





/* -- RENDER_PCB -- */
const limit0 = pt(-b.w/2-0.1, -b.h/2-0.1);
const limit1 = pt(b.w/2+0.1, b.h/2+0.1);
const xMin = Math.min(limit0[0], limit1[0]);
const xMax = Math.max(limit0[0], limit1[0]);
const yMin = Math.min(limit0[1], limit1[1]);
const yMax = Math.max(limit0[1], limit1[1]);

renderPCB({
  pcb: board,
  layerColors: {
    //"interior": "#000000ff",
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
