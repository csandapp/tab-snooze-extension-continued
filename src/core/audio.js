// @flow

export const SOUND_TAB_SNOOZE1 = 'sounds/snooze1.mp3';
export const SOUND_TAB_SNOOZE2 = 'sounds/snooze2.mp3';
export const SOUND_TAB_SNOOZE3 = 'sounds/snooze3.mp3';
export const SOUND_NOTIFICATION = 'sounds/wakeup_notification.mp3';

export function loadAudio(sound: string): HTMLAudioElement {
  const audio = new window.Audio();
  audio.src = sound;
  audio.preload = 'auto';

  // lower volume to we don't annoy user
  // audio.currentTime = 0.02;
  audio.volume = 0.5;
  return audio;
}

export function playAudio(sound: string) {
  loadAudio(sound).play();
}
