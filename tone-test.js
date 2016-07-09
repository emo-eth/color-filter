function makeFilter(color) {
  /*
   * returns a filter with a frequency range and Q based on
   * the color specified
   */
  var frequency = convertColorToFrequency(color);
  var filter = new Tone.Filter(frequency, 'lowpass', -24);
  filter.Q = setQ(color);
  return filter;
}

function convertColorToFrequency(color) {
  /*
   * Uses fancy math to convert a color to a frequency
   */
  // originally went freq > octave > WL > HSL > RGB
  // RGB > HSL > Wavelength > octave > freq?
  // linear scale
  console.log('convertColorToFrequency ' + color);
  var wlToOctave = d3.scaleLinear().domain([656, 445]).range([0, 10]).clamp(true);
  var hsl = d3.hsl(color);
  console.log('inner hsl ' + hsl);
  var wl = convertHuetoWL(hsl);
  console.log('inner wl ' + wl);
  var octave = wlToOctave(wl);
  console.log('inner octave ' + octave);
  var freq = octToFreq(octave);
  return freq;
}

function convertColorForQ(color) {
  // an L value of 1 (eg white)
  console.log('convertColorForQ')
  var qScale = d3.scaleLinear().domain([0.5, 1]).range([0.71, 0]);
  var hsl = d3.hsl(color);
  console.log(hsl)
  console.log(qScale(hsl.l));
  return qScale(hsl.l);
}

function convertHuetoWL(hsl) {
  // copied from my LED project
  // reversing this equation:
  // int hue = (red - wavelength)*max_hue/(red-violet);
  //   int red = 615; //real red is 655; this makes lower frequencies redder
  // int violet = 445;
  // int max_hue = 196; // out of (in this case) 240; as close to true violet as possible (max hue is magenta-red again)

  console.log('convertHuetoWL ' + hsl);
  var hue = hsl.h;
  console.log('convertHuetoWL hue ' + hue);
  // trusting wolfram alpha...
  return 655 - 40 * hue / 49;
}

function octToFreq(octave) {
  // inverse of:   float octave = log_2(centroid) - log_2(20.0);
  console.log('octToFreq ' + octave);
  var freq = 5 * Math.pow(2, octave + 2);
  console.log('octToFreq freq ' + freq);
  return freq;

}

var synth = new Tone.MonoSynth({
  "filterEnvelope": {
    "attack": 1,
    "decay": 0,
    "sustain": 0,
    "release": 0,
    "octaves": 4
  }
});

function updateFilter(r, g, b) {
  var color = d3.rgb(r, g, b);
  console.log('updateFilter ' + color);
  var colorFreq = convertColorToFrequency(color);
  var qVal = convertColorForQ(color);
  if (colorFreq) {
    synth.filterEnvelope.baseFrequency = colorFreq;
  }
  console.log(synth.filter.Q)
  // this, uh, doesn't work bc i have no idea what kind of object Q is/how it stores info
  synth.filter.Q._param.value = qVal;
}

//console.log(d3.hsl('#ff00ff'));
//console.log(convertColorToFrequency('#ffffff'));
synth.toMaster();
synth.triggerAttack("C4");

