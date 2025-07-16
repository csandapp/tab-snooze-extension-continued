// @flow
// import bugsnag from '../bugsnag';

// export const SOUND_TAB_SNOOZE1 = 'sounds/snooze1.mp3';
// export const SOUND_TAB_SNOOZE2 = 'sounds/snooze2.mp3';
// export const SOUND_TAB_SNOOZE3 = 'sounds/snooze3.mp3';
export const SOUND_SNOOZE = 'sounds/snooze.m4a';
export const SOUND_WAKEUP = 'sounds/wakeup_notification.mp3';

export function loadAudio(sound: string): HTMLAudioElement {
  const audio = new window.Audio();
  audio.src = sound;
  audio.preload = 'auto';

  // lower volume to we don't annoy user
  audio.volume = 0.5;

  return audio;
}

export function loadSoundEffect(sound: string): HTMLAudioElement {
  return loadAudio(sound);
}

export function playAudio(sound: string): void {
  try {
    loadAudio(sound).play();
  } catch (err) {
    console.error('Error playing snooze sound:', err);
    // bugsnag.notify(err);
  }
}
