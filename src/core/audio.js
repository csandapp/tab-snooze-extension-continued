// @flow
import { getSettings } from './settings';

export const SOUND_TAB_SNOOZE1 = 'sounds/snooze1.mp3';
export const SOUND_TAB_SNOOZE2 = 'sounds/snooze2.mp3';
export const SOUND_TAB_SNOOZE3 = 'sounds/snooze3.mp3';
export const SOUND_NOTIFICATION = 'sounds/wakeup_notification.mp3';

let playSoundEffects = true;
getSettings().then(
  settings => (playSoundEffects = settings.playSoundEffects)
);

export function loadAudio(sound: string): HTMLAudioElement {
  const audio = new window.Audio();
  audio.src = sound;
  audio.preload = 'auto';

  // lower volume to we don't annoy user
  audio.volume = 0.5;

  return audio;
}

export function loadSoundEffect(sound: string): HTMLAudioElement {
  if (playSoundEffects) {
    return loadAudio(sound);
  } else {
    // return dummy stub func
    return new window.Audio();
  }
}

export function playAudio(sound: string) {
  if (playSoundEffects) {
    loadAudio(sound).play();
  }
}
