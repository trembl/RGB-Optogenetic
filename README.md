# RGB-Optogenetic

Illuminating a standard 96 plate well with 96 RGB LEDs.

Work in Progress, productions files and BoM to come.

Created with Leo McElroy's [SVG-PCB](http://leomcelroy.com/svg-pcb/)

![](images/hero.jpg)


## Production Notes

1. In `SVG-PCB` Export separate PNGs for Traces, Interior and Holes.

- In `mods`, black areas are milled.
- `SVG-PCB`'s PNGs are outputted with an Aplha Channel
- Remove the Alpha Channel (`Preview -> Export`) to enable `invert` in `mods`.
- Alpha Channel is replaced by white background.

2. Open [`mods`](https://modsproject.org/)

3. Open `mods/SRM-20-PNG_Any_Image.txt`

4. Create RML Files. Adjust threshold/invert accordingly. This can also be done separately in Photoshop - or in `mods`.

BLACK areas will be milled!