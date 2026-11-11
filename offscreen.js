chrome.runtime.onMessage.addListener((message) => {
  if (message?.target !== "voicevox-offscreen" || message.type !== "PLAY_AUDIO") return;

  try {
    const binary = atob(message.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
    const audio = new Audio(objectUrl);

    audio.onended = () => URL.revokeObjectURL(objectUrl);
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      console.error("VOICEVOX audio playback failed.");
    };
    audio.play().catch((error) => {
      URL.revokeObjectURL(objectUrl);
      console.error("VOICEVOX playback:", error);
    });
  } catch (error) {
    console.error("VOICEVOX offscreen playback:", error);
  }
});
