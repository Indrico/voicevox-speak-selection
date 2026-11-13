const API = "http://127.0.0.1:50021";
const voiceSelect = document.getElementById("voice");
const presetSelect = document.getElementById("preset");
const speakButton = document.getElementById("speak");
const refreshButton = document.getElementById("refresh");
const status = document.getElementById("status");
let speakers = [];

// Character UUIDs stay the same even when the Engine changes a display name.
// Readings follow https://voicevox.hiroshiba.jp/product/ character pages.
const CHARACTER_NAMES = {
  "7ffcb7ce-00ec-4bdc-82cd-45a8889e43ff": "Shikoku Metan",
  "388f246b-8c41-4ac1-8e2d-5d79f3ff56d9": "Zundamon",
  "35b2c544-660e-401e-b503-0e14c635303a": "Kasukabe Tsumugi",
  "3474ee95-c274-47f9-aa1a-8322163d96f1": "Amehare Hau",
  "b1a81618-b27b-40d2-b0ea-27a9ad408c4b": "Namine Ritsu",
  "c30dc15a-0992-4f8d-8bb8-ad3b314e6a6f": "Kurono Takehiro",
  "e5020595-5c5d-4e87-b849-270a518d0dcf": "Shirakami Kotarou",
  "4f51116a-d9ee-4516-925d-21f183e2afad": "Aoyama Ryusei",
  "8eaad775-3119-417e-8cf4-2a10bfd592c8": "Meimei Himari",
  "481fb609-6446-4870-9f46-90c4dd623403": "Kyushu Sora",
  "9f3ee141-26ad-437e-97bd-d22298d02ad2": "Mochiko-san",
  "1a17ca16-7ee5-4ea5-b191-2f02ace24d21": "Kenzaki Mesuo",
  "67d5d8da-acd7-4207-bb10-b5542d3a663b": "WhiteCUL",
  "0f56c2f2-644c-49c9-8989-94e11f7129d0": "Goki",
  "044830d2-f23b-44d6-ac0d-b5d733caa900": "No.7",
  "468b8e94-9da4-4f7a-8715-a22a48844f9e": "Chibishiki-jii",
  "0693554c-338e-4790-8982-b9c6d476dc69": "Ouka Miko",
  "a8cc6d22-aad0-4ab8-bf1e-2f843924164a": "SAYO",
  "882a636f-3bac-431a-966d-c5e6bba9f949": "Nurse Robo Type T",
  "471e39d2-fb11-4c8c-8d89-4b322d2498e0": "Holy Knight Benizakura",
  "0acebdee-a4a5-4e12-a695-e19609728e30": "Wakamatsu Akashi",
  "7d1e7ba7-f957-40e5-a3fc-da49f769ab65": "Kigashima Sourin",
  "ba5d2428-f7e0-4c20-ac41-9dd56e9178b4": "Haruka Nana",
  "00a5c10c-d3bd-459f-83fd-43180b521a44": "Nekotsuka Aru",
  "c20a2254-0349-4470-9fc8-e5c0f8cf3404": "Nekotsuka Bi",
  "1f18ffc3-47ea-4ce0-9829-0576d03a7ec8": "Chugoku Usagi",
  "04dbd989-32d0-40b4-9e71-17c920f2a8a9": "Kurita Maron",
  "dda44ade-5f9c-4a3a-9d2c-2a976c7476d9": "Aierutan",
  "287aa49f-e56b-4530-a469-855776c84a8d": "Manbetsu Hanamaru",
  "97a4af4b-086e-4efd-b125-7ae2da85e697": "Kotoyomi Nia",
  "0ebe2c7d-96f3-4f0e-a2e3-ae13fe27c403": "Voidoll",
  "0156da66-4300-474a-a398-49eb2e8dd853": "Zonko",
  "4614a7de-9829-465d-9791-97eb8a5f9b86": "Chubu Tsurugi",
  "3b91e034-e028-4acb-a08d-fbdcd207ea63": "Rito",
  "0b466290-f9b6-4718-8d37-6c0c81e824ac": "Kurosawa Kohaku",
  "462cd6b4-c088-42b0-b357-3816e24f112e": "Yurei-chan",
  "80802b2d-8c75-4429-978b-515105017010": "Tohoku Zunko",
  "1bd6b32b-d650-4072-bbe5-1d0ef4aaa28b": "Tohoku Kiritan",
  "ab4c31a3-8769-422a-b412-708f5ae637e8": "Tohoku Itako",
  "3be49e15-34bb-48a0-9e2f-9b80c96e9905": "Ankomon",
  "d3be2066-205b-47f6-8818-1d93a9ca9cef": "Yogatari Tobari",
  "aca7de06-9ff9-49a3-9f08-9d3bc19689e5": "Akatsuki Mitama",
  "cc7baa71-6c74-4399-803b-b60576176a08": "Satoishi Yuka",
  "0d1745d9-ba28-4bf1-b792-3e670ee980ee": "Buibui Kobako"
};

const PRESET_NAMES = {
  "ノーマル": "Normal",
  "ふつう": "Normal",
  "あまあま": "Sweet",
  "甘々": "Sweet",
  "ツンツン": "Tsundere",
  "セクシー": "Sexy",
  "ささやき": "Whisper",
  "囁き": "Whisper",
  "ヒソヒソ": "Hushed",
  "ヘロヘロ": "Exhausted",
  "へろへろ": "Exhausted",
  "なみだめ": "Teary-eyed",
  "クイーン": "Queen",
  "喜び": "Joyful",
  "ツンギレ": "Furious",
  "悲しみ": "Sad",
  "かなしみ": "Sad",
  "かなしい": "Sad",
  "哀しみ": "Sorrowful",
  "わーい": "Cheerful",
  "びくびく": "Nervous",
  "おこ": "Angry",
  "びえーん": "Wailing",
  "熱血": "Passionate",
  "不機嫌": "Grumpy",
  "しっとり": "Gentle",
  "セクシー／あん子": "Sexy / Anko",
  "泣き": "Crying",
  "怒り": "Angry",
  "のんびり": "Relaxed",
  "たのしい": "Happy",
  "人間ver.": "Human",
  "ぬいぐるみver.": "Plush Toy",
  "人間（怒り）ver.": "Human (Angry)",
  "鬼ver.": "Oni",
  "アナウンス": "Announcement",
  "読み聞かせ": "Storytelling",
  "第二形態": "Second Form",
  "ロリ": "Loli",
  "楽々": "Easygoing",
  "恐怖": "Fearful",
  "内緒話": "Secret Talk",
  "おちつき": "Calm",
  "うきうき": "Excited",
  "つよつよ": "Strong",
  "人見知り": "Shy",
  "おどろき": "Surprised",
  "こわがり": "Scared",
  "元気": "Energetic",
  "ぶりっ子": "Cutesy",
  "ボーイ": "Boy",
  "低血圧": "Low Blood Pressure",
  "覚醒": "Awakened",
  "実況風": "Commentary",
  "おどおど": "Timid",
  "絶望と敗北": "Despair and Defeat",
  "シリアス": "Serious",
  "ツクモちゃん": "Tsukumo-chan",
  "よわよわ": "Weak",
  "けだるげ": "Weary",
  "明るい": "Bright",
  "呆れ": "Exasperated",
  "つぼみ": "Bud"
};

function populatePresets(speakerId) {
  const speaker = speakers.find((item) => item.speaker_uuid === voiceSelect.value);
  presetSelect.replaceChildren();
  for (const style of speaker.styles) {
    presetSelect.add(new Option(PRESET_NAMES[style.name] ?? style.name, style.id));
  }

  const selected = speaker.styles.find((style) => String(style.id) === String(speakerId))
    || speaker.styles.find((style) => /^(ノーマル|ふつう|normal)$/i.test(style.name))
    || speaker.styles[0];
  presetSelect.value = String(selected.id);
}

async function savePreset() {
  if (presetSelect.disabled || !presetSelect.value) return;
  await chrome.storage.local.set({ speakerId: Number(presetSelect.value) });
}

async function loadVoices() {
  voiceSelect.disabled = true;
  presetSelect.disabled = true;
  speakButton.disabled = true;
  refreshButton.disabled = true;
  try {
    status.textContent = "Connecting to VOICEVOX…";
    const response = await fetch(`${API}/speakers`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    speakers = (await response.json()).filter((speaker) => speaker.styles?.length > 0);
    voiceSelect.replaceChildren();
    presetSelect.replaceChildren();
    if (!speakers.length) {
      voiceSelect.add(new Option("No characters available", ""));
      presetSelect.add(new Option("No presets available", ""));
      status.textContent = "Connected, but no voice styles were found. Refresh after adding voices.";
      return;
    }

    const saved = await chrome.storage.local.get({ speakerId: 1 });
    for (const speaker of speakers) {
      voiceSelect.add(new Option(CHARACTER_NAMES[speaker.speaker_uuid] ?? speaker.name, speaker.speaker_uuid));
    }
    const selected = speakers.find((speaker) => speaker.styles.some((style) => String(style.id) === String(saved.speakerId)))
      || speakers[0];
    voiceSelect.value = selected.speaker_uuid;
    populatePresets(saved.speakerId);
    voiceSelect.disabled = false;
    presetSelect.disabled = false;
    speakButton.disabled = false;
    await savePreset();
    const styleCount = speakers.reduce((count, speaker) => count + speaker.styles.length, 0);
    status.textContent = `Connected. ${speakers.length} characters and ${styleCount} presets found.`;
  } catch (error) {
    speakers = [];
    voiceSelect.replaceChildren(new Option("VOICEVOX unavailable", ""));
    presetSelect.replaceChildren(new Option("Presets unavailable", ""));
    voiceSelect.disabled = true;
    presetSelect.disabled = true;
    speakButton.disabled = true;
    status.textContent = `Cannot connect: ${error.message}\nStart VOICEVOX Engine and refresh.`;
  } finally {
    refreshButton.disabled = false;
  }
}

voiceSelect.addEventListener("change", async () => {
  if (voiceSelect.disabled || !voiceSelect.value) return;
  populatePresets();
  await savePreset();
});

presetSelect.addEventListener("change", savePreset);

refreshButton.addEventListener("click", loadVoices);

speakButton.addEventListener("click", async () => {
  try {
    const speakerId = Number(presetSelect.value);
    const text = document.getElementById("sample").value.trim();
    if (!text || presetSelect.disabled || !presetSelect.value) return;

    await savePreset();
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
