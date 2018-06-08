# xml-to-srt-cli

------

<p align="center">
  <b>Convert XML subtitles (EBU-TT format) from online broadcasting platforms like MediathekView (Germany) or the BBC (UK) into SRT (SubRip) subtitles.<br><br>
  Available for macOS, Windows and Linux.
</p>

------


## Contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [Example](#example)
1. [Platform Support](#platform-support)
1. [Contribute](#contribute)
1. [Author](#author)


## <a name="installation"/></a> Installation

### Installation as global CLI module

```bash
$ npm install --global xml-to-srt-cli
```


## <a name="usage"/></a> Usage

```bash
$ xml-to-srt <subtitle-file>
```

- Parameter
   - **<subtitle-file>** (String) - Full path to XML subtitle file


## <a name="examples"/></a> Example

```bash
$ xml-to-srt Tatort_2323.xml
>> [xml-to-srt] XML Subtitle successfully converted to SRT (SubRip) format: Tatort_2323.srt
```


### Show Help

```bash
$ xml-to-srt --help
```

### Show Version

```bash
$ xml-to-srt --version
```


## <a name="platform-support"/></a> Platform Support

Tested on:

- macOS High Sierra 10.13.4
- Windows 10 Spring Creators Update
- Ubuntu 18.04


## <a name="contribute"/></a> Contribute ![Contribute](https://img.shields.io/badge/contributions-wanted-red.svg?style=flat-square)

Read the [contribution documentation](https://github.com/sidneys/xml-to-srt-cli/blob/release/CONTRIBUTING.md) first.

- [Dev Chat](http://gitter.im/sidneys/xml-to-srt-cli): Talk about features and suggestions.
- [Issues](http;//github.com/sidneys/xml-to-srt-cli/issues) File bugs and document issues.


## <a name="author"/></a> Author

[sidneys.github.io](http://sidneys.github.io) 2018

