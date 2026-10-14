/**
 * Audio Engine: Celestial Ambient Soundscape + Realistic Mechanical Typewriter Sound
 * Uses the Web Audio API for seamless offline playback and zero external asset dependencies.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMusicPlaying = false;
    this.isTypewriterSoundEnabled = true;
    this.padNodes = [];
    this.masterGain = null;
    this.lfo = null;
    this.audioElement = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Ethereal Ambient Space Pad Synthesizer
   * Creates a warm, deeply relaxing cosmic chord progression (F minor 9 / Ab major 7)
   */
  startCelestialMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;

    // Check if the external HTML audio element can be used
    this.audioElement = document.getElementById('audio');
    let useSynthetic = true;

    if (this.audioElement && this.audioElement.src) {
      this.audioElement.volume = 0.7;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            useSynthetic = false;
            this.isMusicPlaying = true;
            this.updateButtonState(true);
          })
          .catch(() => {
            // If audio tag failed, fallback to synthetic pad
            this.startSyntheticAmbience();
          });
        return;
      }
    }

    if (useSynthetic) {
      this.startSyntheticAmbience();
    }
  }

  startSyntheticAmbience() {
    this.initContext();
    if (this.isMusicPlaying) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);
    this.masterGain.connect(this.ctx.destination);

    // Warm celestial chord frequencies: F2, C3, Eb3, Ab3, C4, G4, Bb4
    const frequencies = [87.31, 130.81, 155.56, 207.65, 261.63, 392.00, 466.16];

    // Master filter for cosmic warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(580, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // Slow LFO for gentle breathing filter sweep
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.06, this.ctx.currentTime); // ~16s wave
    lfoGain.gain.setValueAtTime(240, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;

    filter.connect(this.masterGain);

    this.padNodes = [];

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Alternate between warm sine and soft triangle
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Subtle micro-detune for lush chorus thickness
      const detune = (idx - 3) * 6 + (Math.random() * 4 - 2);
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(detune, this.ctx.currentTime);

      // Higher harmonics softer
      const gainVal = Math.max(0.02, 0.12 - idx * 0.015);
      oscGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      this.padNodes.push(osc);
    });

    this.isMusicPlaying = true;
    this.updateButtonState(true);
  }

  stopCelestialMusic() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        this.padNodes.forEach(node => {
          try { node.stop(); node.disconnect(); } catch (e) {}
        });
        if (this.lfo) {
          try { this.lfo.stop(); this.lfo.disconnect(); } catch (e) {}
        }
        this.padNodes = [];
      }, 1300);
    }

    this.isMusicPlaying = false;
    this.updateButtonState(false);
  }

  toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopCelestialMusic();
    } else {
      this.startCelestialMusic();
    }
  }

  updateButtonState(playing) {
    const btn = document.getElementById('audiobutton');
    if (btn) {
      if (playing) {
        btn.classList.add('is-playing');
        btn.setAttribute('aria-label', 'Pausar: Danny Ocean - Tel Aviv');
        btn.title = 'Pausar: Danny Ocean - Tel Aviv';
      } else {
        btn.classList.remove('is-playing');
        btn.setAttribute('aria-label', 'Reproducir: Danny Ocean - Tel Aviv');
        btn.title = 'Reproducir: Danny Ocean - Tel Aviv';
      }
    }
  }

  /**
   * Vintage Typewriter Mechanical Keystroke Sound
   * Plays a crisp, warm mechanical tick with randomized pitch variation
   */
  playTypewriterKey(char = '') {
    if (!this.isTypewriterSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Special key handling: space is a softer, deeper tap
    if (char === ' ') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260 + (Math.random() * 20 - 10), t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
      return;
    }

    // Newline / punctuation chime or mechanical thud
    if (char === '\n' || char === '.') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(char === '\n' ? 620 : 440, t);
      osc.frequency.exponentialRampToValueAtTime(char === '\n' ? 1200 : 200, t + 0.08);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.095);
    }

    // Standard key strike: noise burst + tiny click transient
    // 1. Noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.025); // 25ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    const randFreq = 1400 + (Math.random() * 300 - 150);
    filter.frequency.setValueAtTime(randFreq, t);
    filter.Q.setValueAtTime(3.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t);

    // 2. Click transient
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(2600 + (Math.random() * 400 - 200), t);
    click.frequency.exponentialRampToValueAtTime(300, t + 0.012);

    clickGain.gain.setValueAtTime(0.06, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);

    click.start(t);
    click.stop(t + 0.015);
  }

  toggleTypewriterSound() {
    this.isTypewriterSoundEnabled = !this.isTypewriterSoundEnabled;
    return this.isTypewriterSoundEnabled;
  }
}

export const audio = new AudioEngine();
