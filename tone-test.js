console.log("Hello World");

var synth = new Tone.Synth({
    "oscillator" : {
        "type" : "sine",
        "modulationFrequency" : 0.2
    },
    "envelope" : {
        "attack" : 0.02,
        "decay" : 0.1,
        "sustain" : 0.1,
        "release" : 0.9,
    }
}).toMaster();

synth.triggerAttack("D3", "+1");