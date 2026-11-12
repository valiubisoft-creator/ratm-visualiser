// Runs inside the YouTube embed. Only acts when the embed sits in a page served from localhost.
// It attaches a Web Audio analyser to the player's <video> element and posts spectrum + waveform
// bytes to the parent page every frame. Nothing is recorded or stored.
(() => {
  const parentOrigin = (location.ancestorOrigins && location.ancestorOrigins[0]) || '';
  if (window.top === window || !/^http:\/\/localhost(:\d+)?$/.test(parentOrigin)) return;
  let ctx, analyser, freq, time, hooked = null;
  function hook(video) {
    if (hooked === video) return; hooked = video;
    try {
      ctx = ctx || new AudioContext();
      const src = ctx.createMediaElementSource(video);
      analyser = ctx.createAnalyser(); analyser.fftSize = 4096; analyser.smoothingTimeConstant = 0.55;
      src.connect(analyser); analyser.connect(ctx.destination);
      freq = new Uint8Array(analyser.frequencyBinCount); time = new Uint8Array(analyser.fftSize);
      const wake = () => { if (ctx.state !== 'running') ctx.resume(); };
      ['play', 'playing', 'seeked', 'volumechange'].forEach(ev => video.addEventListener(ev, wake)); wake();
    } catch (e) { console.warn('[ratm tap]', e); }
  }
  function tick() {
    const v = document.querySelector('video');
    if (v) hook(v);
    if (analyser && hooked && !hooked.paused) {
      analyser.getByteFrequencyData(freq); analyser.getByteTimeDomainData(time);
      const f = freq.slice(), t = time.slice();
      parent.postMessage({ ratmTap: 1, sr: ctx.sampleRate, state: ctx.state, f, t }, parentOrigin, [f.buffer, t.buffer]);
    }
  }
  // setInterval rather than requestAnimationFrame: the embed sits behind the canvas and may be frame-throttled
  setInterval(tick, 1000 / 60);
})();
