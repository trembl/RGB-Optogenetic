/* -- HELPER FUNCTIONS -- */
const mm_to_inch = mi = inch => inch/25.4

/* -- DECLARE_COMPONENTS -- */
var XIAO = function() {
  const s = 0.019
  const d_pad = "M -0.06 0.03 L 0.06 0.03 L 0.06 -0.03 L -0.06 -0.03 L -0.06 0.03"
  var d_hole = `M -${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 ${s} 0 A ${s} ${s} 90 0 0 -${s} 0`
  const footprints = [
    {o:  0.3, r:["5V", "GND", "3V3", "10", "9", "8", "7"]},
    {o: -0.3, r:["0" , "1",   "2",   "3",  "4", "5", "6"]}
  ]
  var i = 0, out = {}
  footprints.forEach(function(row) {
    var offset = 0.3
    row.r.forEach(function(a) {
      var pos = [row.o,offset]
      out[a] = {"pos":pos,"shape":d_pad,"layers":["F.Cu"],"index":i++}
      out["hole____"+a+""] = {"pos":pos,"shape":d_hole,"layers":["drill"],"index":i++}
      offset = offset-0.1
    })
  })
  return out
}()

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




// constants
const width = 1;
const height = 1;

/* -- DECLARE_PCB -- */
let board = new PCB();

var interior_r = 0.39
let interior = path(
  pt(-1.15, -0.58),
  ["fillet", interior_r, pt(-1.15, 0.55)],
  ["fillet", interior_r, pt(3.35, 0.55)],
  ["fillet", interior_r, pt(3.35, -2.35)],
  ["fillet", interior_r, pt(-1.15, -2.35)],
  pt(-1.15, -1.09)
)


board.addShape("interior", interior);

/* -- ADD_COMPONENTS -- */
//const xiao = board.add(XIAO, { translate: pt(-0.214, 0.098), rotate: 90, name: "XIAO_RP2040" })

board.add(C_1206_JUMP, { translate: pt(-0.45, -0.35), rotate: 90, name: "JUMP" })
board.add(C_1206_JUMP, { translate: pt(-0.45, -0.6), rotate: 0, name: "JUMP" })



var offset = {x:mi(0.0), y:mi(0.0)}
var nr_of_LEDs = 33
nr_of_LEDs = Math.max(nr_of_LEDs, 2)
var LEDs_per_row = 8
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
const power_line = mm_to_inch(0.60)
const signal_line = mm_to_inch(0.40)

const createWires = function(led0, led1, c) {
  const direction = d = (led0.altRow) ? -1 : 1
  const champfer = 0.036 * direction
  //const r = signal_lines*3.0
  const r = 0.025
  const e = 0.06  // extend to edge wires
  const type = "fillet" // or "chamfer"

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
  const gnd_y_offset = 0.080 * d
  const gnd_x_offset =  0.211
  
  var gnd_points = [
    led0.pad("GND"),
    pt(led0.padX("GND"), led0.padY("GND") + gnd_y_offset),
    pt(led1.padX("GND"), led1.padY("GND") + gnd_y_offset),
    led1.pad("GND")
  ]
  
  var gnd_points2 = [
    c.pad("GND"),
    pt(c.padX("GND"), led1.padY("GND") + gnd_y_offset)
  ]
  
  if (led0.altRow !== led1.altRow) {
    gnd_points = [
      pt(led0.padX("GND"), led0.padY("GND") + gnd_y_offset),
      [type, r*2, pt(led0.padX("GND")+gnd_x_offset, led0.padY("GND")+gnd_y_offset)],
      [type, r*2, pt(led1.padX("IN")+gnd_x_offset, led1.padY("GND")-gnd_y_offset)],
      pt(led1.padX("GND"), led1.padY("GND")-gnd_y_offset),
      led1.pad("GND")
    ]
    gnd_points2 = [
      c.pad("GND"),
      pt(c.padX("GND")+0.00, led1.padY("GND")-gnd_y_offset),
      pt(led0.padX("GND"), led1.padY("GND")-gnd_y_offset),
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
      pt(led0.padX("VCC"), led0.padY("VCC") - gnd_y_offset),
      pt(led1.padX("VCC"), led1.padY("VCC") - gnd_y_offset),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      pt(c.padX("VCC"), led1.padY("VCC") - gnd_y_offset),
    ]
  }
  
  if (led0.altRow < led1.altRow) {
    vcc_points = [
      led0.pad("VCC"),
      pt(led0.padX("VCC"), led0.padY("VCC") - gnd_y_offset),
      pt(led1.padX("VCC"), led1.padY("VCC") + gnd_y_offset),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      [type, r, pt(c.padX("VCC"), led1.padY("VCC") + gnd_y_offset)],
      pt(led1.padX("VCC"), led1.padY("VCC")+gnd_y_offset),
    ]
  }

  if (led0.altRow > led1.altRow) {
    vcc_points = [
      led0.pad("VCC"),
      pt(led0.padX("VCC"), led0.padY("VCC") - gnd_y_offset),
      [type, r*2, pt(led1.padX("VCC")-gnd_x_offset, led0.padY("VCC")-gnd_y_offset)],
      [type, r*2, pt(led1.padX("VCC")-gnd_x_offset, led1.padY("VCC")+gnd_y_offset)], 
      pt(led1.padX("VCC"), led1.padY("VCC")+gnd_y_offset),
      led1.pad("VCC")
    ]
    var vcc_points2 = [
      c.pad("VCC"),
      [type, r, pt(c.padX("VCC"), led1.padY("VCC") + gnd_y_offset)],
      pt(led1.padX("VCC"), led1.padY("VCC")+gnd_y_offset),
    ]
  }
  
  board.wire(path(...vcc_points), power_line)
  board.wire(path(...vcc_points2), power_line)
}

for (var i=1; i<nr_of_LEDs; i++) {
  createWires(LEDs[i-1], LEDs[i], Cs[i])
}




/* -- RENDER_PCB -- */
const limit0 = pt(-1.2, -2.4);
const limit1 = pt(3.4, 0.6);
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
