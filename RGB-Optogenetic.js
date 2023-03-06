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



// constants
const width = 1;
const height = 1;

/* -- DECLARE_PCB -- */
let board = new PCB();

let interior = path(
  pt(-0.6, 0.5),
  pt(3.35, 0.5),
  pt(3.35, -2.05),
  pt(-0.65, -2.05),
  pt(-0.65, 0.45),
);

board.addShape("interior", interior);

/* -- ADD_COMPONENTS -- */

/*
var c1 = board.add(C_1206, { translate: pt(mi(-4.5), 0.000), rotate: 90, name: "C_1206" })
var led1 = board.add(LED_RGB_WS2812B, { translate: pt(0, 0), rotate: 90, name: "LED_RGB_WS2812B 1" })

var c2 = board.add(C_1206, { translate: pt(mi(4.5), 0.000), rotate: 90, name: "C_1206" })
var led2 = board.add(LED_RGB_WS2812B, { translate: pt(mi(9), 0), rotate: 90, name: "LED_RGB_WS2812B 2" })

var c3 = board.add(C_1206, { translate: pt(mi(13.5), 0.000), rotate: 90, name: "C_1206" })
var led3 = board.add(LED_RGB_WS2812B, { translate: pt(mi(18), 0), rotate: 90, name: "LED_RGB_WS2812B 2" })

var c4 = board.add(C_1206, { translate: pt(mi(22.5), 0.000), rotate: 90, name: "C_1206" })
var led4 = board.add(LED_RGB_WS2812B, { translate: pt(mi(27), 0), rotate: 90, name: "LED_RGB_WS2812B 2" })
*/
var offset = {x:mi(0.0), y:mi(0.0)}
var nr_of_LEDs = 58
var LEDs_per_row = 10
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
console.log("LED_Matrix", LED_Matrix)

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



/*
board.add(C_1206_JUMP, { translate: pt(0.176, 0.332), rotate: 90, name: "JUMP" })

board.add(C_1206_JUMP, { translate: pt(0.312, 0.215), rotate: 0, name: "JUMP" })
board.add(C_1206, { translate: pt(0.702, 0.273), rotate: 90, name: "C_1206" })
var xiao = board.add(XIAO_RP2040, { translate: pt(-0.214, 0.098), rotate: 90, name: "XIAO_RP2040" })
*/

/* -- ADD_WIRES -- */
/*
board.wire(
  [
    xiao.pad("10"), 
    pt(0.215, 0.117),
    pt(0.312, 0.371),
    led1.pad("IN")
  ], 0.019)

*/
const power_lines = mm_to_inch(0.57)
const signal_lines = mm_to_inch(0.32)

const wire_out_in = function(led0, led1, c) {
  const trace_width = signal_lines
  const direction = (led0.altRow) ? -1 : 1
  const champfer = 0.036 * direction
  const r = signal_lines*3.0
  board.wire(
    path(
      // Nice Fillet/Chamfer
      led0.pad("OUT"),
      ["fillet", r, pt(led0.padX("OUT"), c.posY)], // or "chamfer"
      c.pos,
      ["fillet", r, pt(led1.padX("IN"), c.posY)],
      led1.pad("IN")
      /*
      // Brutal Chamfer
      pt(led0.padX("OUT"), led0.posY-r),
      pt(led0.padX("OUT")+r, led0.posY),
      pt(led1.padX("IN")-r, led1.posY),
      pt(led1.padX("IN"), led1.posY+r),
      led1.pad("IN")
      */
    ), trace_width
  )
}

const wire_power = function(led_prev, led, c) {
  const trace_width = power_lines
  const y_offset = 0.08
  board.wire(
    [
      led.pad("GND"),
      pt(led.padX("GND"), led.padY("GND") + y_offset),
      pt(led_prev.padX("GND"), led.padY("GND") + y_offset),
    ], trace_width
  )
  board.wire(
    [
      c.pad("GND"),
      pt(c.padX("GND"), led.padY("GND") + y_offset),
    ], trace_width
  )
  board.wire(
    [
      led.pad("VCC"),
      pt(led.padX("VCC"), led.padY("VCC") - y_offset),
      pt(led_prev.padX("VCC"), led.padY("VCC") - y_offset),
    ], trace_width
  )
  board.wire(
    [
      c.pad("VCC"),
      pt(c.padX("VCC"), led.padY("VCC") - y_offset),
    ], trace_width
  )

  
}
for (var i=1; i<nr_of_LEDs; i++) {
  wire_out_in(LEDs[i-1], LEDs[i], Cs[i])
}




/* -- RENDER_PCB -- */
const limit0 = pt(-0.75, -2.1);
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
