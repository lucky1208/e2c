function preferredEnglishVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => /^en([-_]|$)/i.test(voice.lang) && /natural|google|aria|jenny|samantha|zira/i.test(voice.name)) ||
    voices.find((voice) => /^en([-_]|$)/i.test(voice.lang)) ||
    null
  );
}

export function speakEnglish(text: string) {
  const value = text.trim();
  if (!value || typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = preferredEnglishVoice();
  if (voice) utterance.voice = voice;

  try {
    synth.cancel();
  } catch {
    // The next speak call can still recover.
  }

  window.setTimeout(() => {
    try {
      if (synth.paused) synth.resume();
      synth.speak(utterance);
    } catch {
      // Some browsers reject speech synthesis when no voice is installed.
    }
  }, 60);
}