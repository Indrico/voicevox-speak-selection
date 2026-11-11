# VOICEVOX Speak Selection

A lightweight Chrome extension that reads selected Japanese text aloud using a locally running [VOICEVOX Engine](https://voicevox.hiroshiba.jp/).

Select text on a webpage, right-click, and choose **Speak with VOICEVOX**.

## Features

- Speak selected text from the browser context menu.
- Select among available VOICEVOX speakers and voice styles.
- Preview a sentence from the extension popup.
- Generate speech locally through the VOICEVOX Engine HTTP API.
- No cloud TTS account or API key required.

## Requirements

- Google Chrome with Manifest V3 support.
- VOICEVOX installed and running on the same computer.
- VOICEVOX Engine API available at `http://127.0.0.1:50021`.

The extension does not include the VOICEVOX Engine or voice models. Install them separately from the [official VOICEVOX website](https://voicevox.hiroshiba.jp/).

## Install from source

1. Clone or download this repository.
2. Start VOICEVOX Engine.
3. Open `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select this repository folder (the folder containing `manifest.json`).

## Use

1. Select Japanese text on a normal webpage.
2. Right-click the selection.
3. Choose **Speak with VOICEVOX**.

Use the extension toolbar button to choose a speaker/style and test a sentence.

## Troubleshooting

- Confirm VOICEVOX is running.
- Open `http://127.0.0.1:50021/speakers`. A JSON response indicates that the Engine API is reachable.
- If the popup cannot connect, restart VOICEVOX Engine and click **Refresh voices**.
- Extension errors can be inspected at `chrome://extensions`.

## Privacy

Selected text is sent to the VOICEVOX Engine running locally on the same computer at `127.0.0.1:50021` for speech synthesis. This extension does not intentionally send selected text to a remote TTS provider. The VOICEVOX application and voice packages are separate software and may have their own terms.

See [PRIVACY.md](PRIVACY.md).

## License

The extension source code is licensed under the MIT License. This license does not cover VOICEVOX, voice libraries, character artwork, names, or other third-party materials. Review the applicable terms before redistribution or commercial use.

## Credits

- [VOICEVOX](https://voicevox.hiroshiba.jp/) — speech synthesis engine.
