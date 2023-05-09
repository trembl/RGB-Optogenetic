echo(version=version());


$fn = 100   ;
// simple 2D -> 3D extrusion of a rectangle

// base

module roundedBox(dim, c) {
  a = dim[0];
  b = dim[1];
  h = dim[2];
  r = dim[3];
  color(c) {
    union() {
      cube([a-r*4, b, h], center = true);
      cube([a, b-r*4, h], center = true);
      translate([a/2-r*2, b/2-r*2, 0])
        cylinder(h, r=4, center=true);
      translate([-a/2+r*2, b/2-r*2, 0])
        cylinder(h, r=4, center=true);
      translate([-a/2+r*2, -b/2+r*2, 0])
        cylinder(h, r=4, center=true);
      translate([a/2-r*2, -b/2+r*2, 0])
        cylinder(h, r=4, center=true);
    }
  }
}

module dot() {
  color("yellow") {
    cylinder (h=8, r=2.5, center=true);
  }
}


// OuterBox
a = 127.76;
b = 85.48;
h = 8;
r = 2;
dotH = 0.5;

/*
m.x1 = -b.w/2+b.wall+m.offset
m.x2 = b.w/2-b.wall-m.offset
m.y1 = -b.h/2+b.wall+m.offset
m.y2 = b.h/2-b.wall-m.offset
*/

translate([0,0,1+dotH]) {
  translate([-a/2,-b/2,0]) {
    dot();
  }
  translate([a/2-r*2,-b/2+r*2,0]) {
    dot();
  }
  translate([a/2-r*2,b/2-r*2,0]) {
    dot();
  }
  translate([-a/2+r*2,b/2-r*2,0]) {
    dot();
  }
  translate([0,b/2-r*2,0]) {
    dot();
  }
  translate([0,-b/2+r*2,0]) {
    dot();
  }
  translate([a/2-r*2,0,0]) {
    dot();
  }
}



    
difference() {
  union() {
    roundedBox([a, b, h, r], "blue");
    // Inner
    translate([0,0,1]) {
      roundedBox([a-2, b-2, h, r], "green");
    }
  }
  translate([-51, 0, 2])
    cube([30,60,h], center = true);
  translate([0, 0, 2])
    cube([110,70,h], center = true);
}


translate([0,0,1]) {
  rotate(45)
  cube([2,105,8], center = true);
  rotate(135)
  cube([2,105,8], center = true);
}

