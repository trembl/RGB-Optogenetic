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
  pt(3.1, 0.5),
  pt(3.1, -2.05),
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
var nr_of_LEDs = 32
var LEDs_per_row = 9
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
    board.add(LED_RGB_WS2812B, {translate, rotate, name: "LED_RGB_WS2812B"})

    var ox = altRow ? 1 : -1
    var x = columnNr*spacing+offset.x+(ox*mi(4.5))
    var translate = pt(x,y)
    board.add(C_1206, {translate, rotate, name: "C_1206"})



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
const signal_lines = mm_to_inch(0.50)

const wire_out_in = function(led_prev, led) {
  const trace_width = signal_lines
  const champfer = Math.max(0.035, 0)
  board.wire(
    [
      led_prev.pad("OUT"),
      pt(led_prev.padX("OUT"), led_prev.posY-champfer),
      pt(led_prev.padX("OUT")+champfer, led_prev.posY),
      pt(led.padX("IN")-champfer, led.posY),
      pt(led.padX("IN"), led.posY+champfer),
      led.pad("IN")
    ], trace_width
  )
}

const wire_power = function(led_prev, led, c) {
  const trace_width = power_lines
  const y_offset = 0.07
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
if (0) {
  wire_out_in(led1, led2)
  wire_power(led1, led2, c2)
  
  wire_out_in(led2, led3)
  wire_power(led2, led3, c3)
  
  wire_out_in(led3, led4)
  wire_power(led3, led4, c4)
}




/* -- RENDER_PCB -- */
const limit0 = pt(-0.75, -2.1);
const limit1 = pt(3.15, 0.6);
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
