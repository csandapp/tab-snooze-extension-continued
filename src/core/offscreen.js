
import { playAudio } from "./audio";
import { ensureOffscreenDocument } from "./backgroundMain";


// TODO 
// someone make it so that offscreen.html shows up properly

// Add message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  await ensureOffscreenDocument();
  
  console.log('Received message:', request);
  console.log('Sender:', sender);
  if (request.action === 'playAudio') {
    playAudio(request.sound);
    sendResponse({success: true});
  }
});