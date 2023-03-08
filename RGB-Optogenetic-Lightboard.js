/* -- HELPER FUNCTIONS -- */
const mm_to_inch = mi = inch => inch/25.4

/* -- DECLARE_COMPONENTS -- */
const LED_RGB_WS2812B = function() {
  // Single Pad
  const a = 0.03 // 0.03
  const b = 0.018 // 0.18
  const f = 0.004 // 0.004
  // Pad Positions
  const x = 0.0964 // 0.0964
  const y = 0.0649 // 0.0649
  const LED_PAD_SHAPE = `M ${-a} ${b} L ${a} ${b} L ${a} ${-b} L ${-a} ${-b} L ${-a} ${b}`
  const LED_PAD_SHAPE_ANGLE = `M ${-a} ${b} L ${a} ${b} L ${a} ${-f} L ${a-b+f} ${-b} L ${-a} ${-b} L ${-a} ${b}`
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
  wall: mi(1.0),              // ?
  r: mi(2.00),                // ?
  a1_row_offset: mi(11.24),   // 11.24
  a1_column_offset: mi(14.38), // 14.38
  w: mi(127.76),              // 127.76 
  h: mi(85.48)                // 85.48
}
iw = b.w -b.wall*2
ih = mi(85.48)-b.wall*2

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
var nr_of_LEDs = 25 
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



/* -- ADD_WIRES -- */
const power_line = mm_to_inch(0.75)
const signal_line = mm_to_inch(0.50)

const gnd_y_offset = 0.080
const gnd_x_offset = mi(6.00)

const r = 0.033
const e = mi(1.69)  // extend to edge wires
const type = "fillet" // or "chamfer"

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


const gnd_to_xiao_x = LEDs[0].padX("VCC")-gnd_x_offset-mi(2.00)


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
    "interior": "#313030ff",
    //"B.Cu": "#ff4c007f",
    "F.Cu": "#ff8c00cc",
    "drill": "#ee00ffe5",
    "padLabels": "#ffff99e5",
    //"componentLabels": "#00e5e5e5",
  },
  limits: {
    x: [xMin, xMax],
    y: [yMin, yMax]
  },
  mm_per_unit: 25.4
});
