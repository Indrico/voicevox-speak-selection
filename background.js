const API = "http://127.0.0.1:50021";
const MENU_ID = "voicevox-speak-selection";
let creatingOffscreen = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Speak with VOICEVOX",
      contexts: ["selection"]
    });
  });
});

async function ensureOffscreenDocument() {
  const url = chrome.runtime.getURL("offscreen.html");
  const existing = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [url]
  });
  if (existing.length > 0) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play audio synthesized by the locally running VOICEVOX Engine."
  });

  try {
    await creatingOffscreen;
  } finally {
    creatingOffscreen = null;
  }
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID || !info.selectionText) return;

  try {
    const { speakerId = 1 } = await chrome.storage.local.get({ speakerId: 1 });
    const text = info.selectionText.trim();
    if (!text) return;

    const queryUrl = new URL(`${API}/audio_query`);
    queryUrl.searchParams.set("text", text);
    queryUrl.searchParams.set("speaker", String(speakerId));

    const queryResponse = await fetch(queryUrl, { method: "POST" });
    if (!queryResponse.ok) {
      throw new Error(`VOICEVOX audio_query failed (HTTP ${queryResponse.status}).`);
    }
    const audioQuery = await queryResponse.json();

    const synthesisResponse = await fetch(
      `${API}/synthesis?speaker=${encodeURIComponent(speakerId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audioQuery)
      }
    );
    if (!synthesisResponse.ok) {
      throw new Error(`VOICEVOX synthesis failed (HTTP ${synthesisResponse.status}).`);
    }

    const audioBytes = new Uint8Array(await synthesisResponse.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < audioBytes.length; offset += 32768) {
      binary += String.fromCharCode(...audioBytes.subarray(offset, offset + 32768));
    }

    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({
      target: "voicevox-offscreen",
      type: "PLAY_AUDIO",
      base64: btoa(binary)
    });
  } catch (error) {
    console.error("VOICEVOX Speak Selection:", error);
  }
});
