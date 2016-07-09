console.log("Hello BUTTS");

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
  return 69;
}

function setQ(color) {
  /*
   * Uses fancy/arbitrary math to convert brightness to a Q value
   */
  return 420;
}

var synth = new Tone.MonoSynth().toMaster();

synth.triggerAttack("C4");
