const API = "http://127.0.0.1:50021";
const voiceSelect = document.getElementById("voice");
const status = document.getElementById("status");

async function loadVoices() {
  try {
    status.textContent = "Connecting to VOICEVOX…";
    const response = await fetch(`${API}/speakers`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const speakers = await response.json();
    const styles = [];
    for (const speaker of speakers) {
      for (const style of speaker.styles || []) {
        styles.push({ id: style.id, label: `${speaker.name} — ${style.name}` });
      }
    }

    const saved = await chrome.storage.local.get({ speakerId: 1 });
    voiceSelect.replaceChildren();
    for (const item of styles) {
      voiceSelect.add(new Option(`${item.label} (ID ${item.id})`, item.id));
    }

    if (styles.some((item) => String(item.id) === String(saved.speakerId))) {
      voiceSelect.value = String(saved.speakerId);
    }
    status.textContent = `Connected. ${styles.length} voice styles found.`;
  } catch (error) {
    voiceSelect.replaceChildren(new Option("VOICEVOX unavailable", ""));
    status.textContent = `Cannot connect: ${error.message}\nStart VOICEVOX Engine and refresh.`;
  }
}

voiceSelect.addEventListener("change", async () => {
  await chrome.storage.local.set({ speakerId: Number(voiceSelect.value) });
});

document.getElementById("refresh").addEventListener("click", loadVoices);

document.getElementById("speak").addEventListener("click", async () => {
  try {
    const speakerId = Number(voiceSelect.value);
    const text = document.getElementById("sample").value.trim();
    if (!text || !voiceSelect.value) return;

    await chrome.storage.local.set({ speakerId });
    const queryUrl = new URL(`${API}/audio_query`);
    queryUrl.searchParams.set("text", text);
    queryUrl.searchParams.set("speaker", String(speakerId));

    const queryResponse = await fetch(queryUrl, { method: "POST" });
    if (!queryResponse.ok) throw new Error(`audio_query HTTP ${queryResponse.status}`);

    const synthesisResponse = await fetch(`${API}/synthesis?speaker=${speakerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await queryResponse.json())
    });
    if (!synthesisResponse.ok) throw new Error(`synthesis HTTP ${synthesisResponse.status}`);

    const objectUrl = URL.createObjectURL(await synthesisResponse.blob());
    const audio = new Audio(objectUrl);
    audio.onended = () => URL.revokeObjectURL(objectUrl);
    await audio.play();
    status.textContent = "Playing preview.";
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
  }
});

loadVoices();
