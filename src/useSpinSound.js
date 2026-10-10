import { useState, useEffect } from 'react'

// Plays sounds while the wheel is spinning, a tick as each item passes the
// pointer, and an optional sound via `finish()` when a spin ends.
// Call `start(wheel)` from the wheel's `onSpin` event. Because `Wheel.stop()`
// (used by the Stop button and when the user grabs the wheel) doesn't raise
// `onRest`, the wheel's speed is watched every frame instead, and the sounds
// stop the moment it reaches 0.
// Call `tick()` from `onCurrentIndexChange` to click as each item passes the
// pointer. Ticks use the Web Audio API so rapid clicks don't lag: either a
// custom sound file or a short built-in synthesized click.
const MIN_TICK_INTERVAL = 0.03; // seconds; avoids a buzz at very high speeds

class SpinSoundPlayer {
  options = {
    sounds: [], mode: 'all', volume: 1, loop: true, stopSound: null,
    tickEnabled: true, tickSound: null, tickVolume: 0.5,
  };
  playing = [];
  frame = null;
  stopAudio = null;
  audioContext = null;
  tickBuffer = null;
  tickBufferUrl = null;
  lastTickTime = 0;

  setOptions(options) {
    this.options = options;
    // Apply volume / loop changes to sounds that are already playing
    for (const audio of this.playing) {
      audio.volume = options.volume;
      audio.loop = options.loop;
    }
    this.loadTickSound(options.tickSound?.url ?? null);
  }

  getAudioContext() {
    this.audioContext ??= new AudioContext();
    // Browsers start audio contexts suspended until the user interacts with the page
    if (this.audioContext.state === 'suspended') this.audioContext.resume();
    return this.audioContext;
  }

  loadTickSound(url) {
    if (url === this.tickBufferUrl) return;
    this.tickBufferUrl = url;
    this.tickBuffer = null;
    if (!url) return;
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => this.getAudioContext().decodeAudioData(data))
      .then((buffer) => {
        if (this.tickBufferUrl === url) this.tickBuffer = buffer;
      })
      .catch(() => {});
  }

  tick() {
    const { tickEnabled, tickVolume } = this.options;
    if (!tickEnabled || tickVolume === 0) return;

    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    if (now - this.lastTickTime < MIN_TICK_INTERVAL) return;
    this.lastTickTime = now;

    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (this.tickBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = this.tickBuffer;
      gain.gain.value = tickVolume;
      source.connect(gain);
      source.start(now);
      return;
    }

    // Built-in click: a very short falling blip
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.03);
    gain.gain.setValueAtTime(tickVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  start(wheel) {
    const { sounds, mode, volume, loop } = this.options;
    this.stopAudio?.pause();
    if (sounds.length === 0) return;

    if (this.playing.length === 0) {
      const chosen = mode === 'random'
        ? [sounds[Math.floor(Math.random() * sounds.length)]]
        : sounds;
      this.playing = chosen.map((sound) => {
        const audio = new Audio(sound.url);
        audio.loop = loop;
        audio.volume = volume;
        audio.play().catch(() => {});
        return audio;
      });
    }

    const watch = () => {
      if (wheel.rotationSpeed === 0) {
        this.stop();
      } else {
        this.frame = requestAnimationFrame(watch);
      }
    };
    if (this.frame === null) this.frame = requestAnimationFrame(watch);
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
    for (const audio of this.playing) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.playing = [];
  }

  // Call when a spin finishes (comes to rest or is stopped with the Stop button)
  finish() {
    this.stop();
    const { stopSound, volume } = this.options;
    if (!stopSound) return;
    this.stopAudio = new Audio(stopSound.url);
    this.stopAudio.volume = volume;
    this.stopAudio.play().catch(() => {});
  }
}

export function useSpinSound({ sounds, mode, volume, loop, stopSound, tickEnabled, tickSound, tickVolume }) {
  const [player] = useState(() => new SpinSoundPlayer());

  useEffect(() => {
    player.setOptions({ sounds, mode, volume, loop, stopSound, tickEnabled, tickSound, tickVolume });
  }, [player, sounds, mode, volume, loop, stopSound, tickEnabled, tickSound, tickVolume]);

  // Stop everything on unmount
  useEffect(() => () => {
    player.stop();
    player.stopAudio?.pause();
  }, [player]);

  return player;
}
