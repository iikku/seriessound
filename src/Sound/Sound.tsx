function Sound() {

  // Create an array to hold the oscillators
  const numberOfHarmonics = 30;
  const oscillators: OscillatorNode[] = [];
  const volumes: GainNode[] = [];
  let audioCtx: AudioContext;

  function connect() {
    // Create an audio context
    audioCtx = new (window.AudioContext)();

    // Create the oscillators
    for (var i = 0; i < numberOfHarmonics; i++) {
      const oscillator = audioCtx.createOscillator();
      oscillators[i] = oscillator;
      oscillator.type = 'sine';
      oscillator.frequency.value = 261.63 * (i + (Math.random() > 0.8 ? 0.5 : 0));

      const volume = audioCtx.createGain();
      volumes[i] = volume;
      volume.connect(audioCtx.destination);
      volume.gain.value = 0;
      oscillator.connect(volume);

      oscillators[i].start();
    }
  }

  function playSound() {
    for (var i = 0; i < numberOfHarmonics; i++) {
      const gain = volumes[i].gain;
      const lowBiasedRandom = Math.pow(Math.random(), i * 5);
      gain.setValueAtTime(lowBiasedRandom * (10 - 1/(i+1)), audioCtx.currentTime);
      gain.linearRampToValueAtTime(0, audioCtx.currentTime + Math.random() * 2);
    }
  }


  function stopSound() {
    for (var i = 0; i < numberOfHarmonics; i++) {
      const gain = volumes[i].gain;
      gain.setValueAtTime(0, audioCtx.currentTime);
    }
  }

  return (
    <div>
      <button onClick={connect}>
        connect
      </button>
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
