
import { playAudio } from "./audio";
import { MSG_PLAY_AUDIO } from "./messages";

console.log("Offscreen script loaded");

// TODO 
// someone make it so that offscreen.html shows up properly

// Add message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  console.log('Sender:', sender);

  if (request.action === MSG_PLAY_AUDIO) {
    playAudio(request.sound);
    sendResponse({success: true});
    return true; // Required for async messaging in Manifest V3
  }

  return false;
});