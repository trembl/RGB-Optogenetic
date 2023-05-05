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
    cylinder (h=10, r=0.5, center=true);
  }
}


// OuterBox
a = 127.76;
b = 85.48;
h = 8;
r = 2;
dotH = 2;

translate([-a/2+r*2,-b/2+r*2,dotH]) {
  dot();
}
translate([a/2-r*2,-b/2+r*2,dotH]) {
  dot();
}
translate([a/2-r*2,b/2-r*2,dotH]) {
  dot();
}
translate([-a/2+r*2,b/2-r*2,dotH]) {
  dot();
}
translate([0,b/2-r*2,dotH]) {
  dot();
}
translate([0,-b/2+r*2,dotH]) {
  dot();
}
translate([a/2-r*2,0,dotH]) {
  dot();
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
    cube([26,45,h], center = true);
  translate([0, 0, 2])
    cube([90,60,h], center = true);
}



