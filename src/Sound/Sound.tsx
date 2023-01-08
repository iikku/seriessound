import { useState } from 'react';

function Sound() {
  const [inversePower, setInversePower] = useState(0);
  const [dissonance, setDissonance] = useState(0);


  // Create an array to hold the oscillators
  const numberOfHarmonics = 30;
  const oscillators: OscillatorNode[] = [];
  const volumes: GainNode[] = [];
  let audioCtx: AudioContext;

  let connected = false;

  function connect() {
    if (connected) return;
    // Create an audio context
    audioCtx = new (window.AudioContext)();

    // Create the oscillators
    for (var i = 1; i <= numberOfHarmonics; i++) {
      const oscillator = audioCtx.createOscillator();
      oscillators[i] = oscillator;
      oscillator.type = 'sine';
      oscillator.frequency.value = 261.63 * (i + (Math.random() > (1 - dissonance) ? 0.5 : 0));

      const volume = audioCtx.createGain();
      volumes[i] = volume;
      volume.connect(audioCtx.destination);
      volume.gain.value = 0;
      oscillator.connect(volume);

      oscillators[i].start();
    }
  }

  // 0 -- 1
  function startingGainForHarmonic(harmonic: number) {
    return Math.pow(Math.random() / harmonic, inversePower);

    //    return Math.pow(1 / harmonic, inversePower);

    //    const lowBiasedRandom = Math.pow(Math.random(), harmonic * 5);
    //    return lowBiasedRandom * (10 - 1/(harmonic + 1));
  }

  function lengthForHarmonic(harmonic: number) {
    return (numberOfHarmonics - harmonic) / numberOfHarmonics * 2;
  }

  function playSound() {
    connect();
    for (var i = 1; i <= numberOfHarmonics; i++) {
      const gain = volumes[i].gain;
      gain.setValueAtTime(startingGainForHarmonic(i), audioCtx.currentTime);
      gain.linearRampToValueAtTime(0, lengthForHarmonic(i));
    }
  }


  function stopSound() {
    for (var i = 1; i <= numberOfHarmonics; i++) {
      const gain = volumes[i].gain;
      gain.setValueAtTime(0, audioCtx.currentTime);
    }
  }

  return (
    <div>
      <p>
        Dullness:
        <input type="number" step="0.1" value={inversePower} onChange={e => setInversePower(+e.target.value)} />
      </p>

      <p>
        Dissonance:
        <input type="number" step="0.01" min="0" max="1" value={dissonance} onChange={e => setDissonance(+e.target.value)} />
      </p>

      <button onClick={playSound}>
        play
      </button>
      <button onClick={stopSound}>
        stop
      </button>
    </div>
  );
}

export default Sound;
