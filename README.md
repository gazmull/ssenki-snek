# 🐍 - SSenki Variant

[Derived from [kh-snek](https://github.com/gazmull/kh-snek)] Used to download and process assets (currently, images) from Soul Senki.


<h2 style="color:red">❗❗ Users below 18: STAY AWAY from this project</h2>

## 📒 Instructions
You don't.

### ⚠ Required Dependencies
- **NodeJS** 12
  - [**Direct installation**](https://nodejs.org/en/download/)
- **Yarn** (optional but recommended)
  - [**Direct installation**](https://classic.yarnpkg.com/en/)
- **FFmpeg** (yes, either installation method is fine)
  - [**NPM**](https://www.npmjs.com/package/ffmpeg-static) (`npm i ffmpeg-static`)
  - [**Direct installation**](https://www.ffmpeg.org/download.html)

> `$` denotes it should be executed within your CLI.

1. `$ git clone https://github.com/gazmull/ssenki-snek.git`
2. `$ cd ssenki-snek`
3. Make a new file `config.yaml`; get template from `config.example.yaml`
4. `$ yarn` or `$ npm install`
5. `$ yarn test` or `$ npm test`
6. `$ node .`

## ❔ FAQ

Before the actual questions: Yes, you need some computer knowledge to use this tool. If you're an average linux user, then you'll have no problems.

<br>

> ### Okay, okay, so tell me how to install this and that?
- No. You learn it yourself. This isn't meant for newbies— if it was, then I would've written a GUI for it instead. (hint: `Google` or just take a nice look at their documentation)

> ### Why is FFmpeg needed?
- Because this tool converts the JPG sequences (animation) to MP4 (500~KB max) instead of GIF (4-7~MB unless compressed to the ugliest which is bad).
- I may consider having the tool do convert to GIF, but not anytime soon or feel free to fork this repository and file a pull request.

> ### There are characters missing
- Either there are new characters or I missed them out being out of range of digging.
  Anyhow, feel free to modify the `range` option in your `config.yaml`.
- If you found any characters out of range, feel free to file an issue so I can update the default `range`.

> ### There are characters who have incomplete images or missing MP4 file
- Just re-run the tool until it doesn't say anything about detected errors.

> ### Will you update this tool to extract sounds/script as well?
- No. This is something I've written while procrastinating. Feel free to contribute.

## 🧾 License
> [**MIT**](/LICENSE)

© 2020 [Euni](https://github.com/gazmull)
