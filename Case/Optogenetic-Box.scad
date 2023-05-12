echo(version=version());

include <roundedcube.scad>

$fn = 25;
// simple 2D -> 3D extrusion of a rectangle

// base


/*
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
*/


// OuterBox
a = 127.76;
b = 85.48;
h = 8;
r = 2;
dotH = 0.5;
wall = 2;



dotRadius = 2.5;
module dot() {
  dotRadius = 2.5;
  color("yellow") {
    cylinder(2, dotRadius, dotRadius, center=false);
  }
}
    
difference() {
  union() {
    color("Blue")
    roundedcube([a, b, h], true, r, "z");               // outside
    translate([0,0,1]) {
      color("Blue")
      roundedcube([a-wall, b-wall, h], true, r, "z");   // top offset
    }
  }
  translate([-51, 0, 2]) {
  
    cube([30, 60, h], true);
  }
  translate([0, 0, 2]) {
    thickness = 20;
    roundedcube([a-thickness, b-thickness, h], true, r, "z");
  }
}


// 
intersection() {
  translate([0,0,4]) {
    translate([-a/2+wall/2, -b/2+wall/2, 0]) dot();
    translate([ a/2-wall/2, -b/2+wall/2,  0])  dot();
    translate([ a/2-wall/2,  b/2-wall/2, 0]) dot();
    translate([-a/2+wall/2,  b/2-wall/2, 0]) dot();
    translate([ 0       ,    b/2-wall/2, 0])   dot();
    translate([ 0       ,   -b/2+wall/2, 0])   dot();
    translate([ a/2-wall/2,  0       , 0])   dot();
  }
  translate([0,0,5]) {
    roundedcube([a-wall, b-wall, h], true, r, "z");   // top offset
  }
}




// X
translate([0,0,1]) {
  color("blue") {
    rotate(45)
    cube([3,110,8], center = true);
    rotate(135)
    cube([3,110,8], center = true);
  }
}

