/**
 * Synthesizes subtle, professional UI sound effects using the Web Audio API.
 * Requires zero external audio files. Respects user sound preferences.
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Check saved preference or default to true
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('propease_sound_enabled');
      this.isEnabled = saved !== null ? saved === 'true' : true;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('propease_sound_enabled', enabled ? 'true' : 'false');
    }
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Delicate high-pitch blip for sending messages
   */
  public playSent() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio playback silently suppressed if blocked by autoplay policy
    }
  }

  /**
   * Warm dual-tone chime when receiving AI response
   */
  public playReceived() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const tones = [523.25, 659.25]; // C5, E5

      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.05, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {
      // Audio playback ignored
    }
  }

  /**
   * Rich brass-like harmonic arpeggio when a site visit is confirmed or duplicate merged
   */
  public playSuccess() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Arpeggio: F#4, A#4, C#5, F#5 (Luxurious major chord)
      const chord = [369.99, 466.16, 554.37, 739.99];

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Gentle tactile click for UI button interactions
   */
  public playClick() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // Ignored
    }
  }

  /**
   * Alert tone for concurrency clash or guardrail block
   */
  public playAlert() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Ignored
    }
  }
}

export const sounds = new SoundEffectsService();
