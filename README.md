# toloko

[![Build Status](https://travis-ci.org/drawnepicenter/toloko.svg?branch=master)](https://travis-ci.org/drawnepicenter/toloko) [![Dependency Status](https://gemnasium.com/badges/github.com/drawnepicenter/toloko.svg)](https://gemnasium.com/github.com/drawnepicenter/toloko) [![npm version](https://badge.fury.io/js/toloko.svg)](https://badge.fury.io/js/toloko) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![toloko](icon.png)](http://raw.githubusercontent.com/drawnepicenter/toloko/master/icon.png)

Icon by [A’Design Award & Competition, Onur Müştak Çobanlı and Farhat Datta](http://www.languageicon.org)

_Toloko_ is [Sesotho](http://www.omniglot.com/writing/sesotho.htm) for **interpreter**.

## Introduction

Toloko is a text translation tool for the command line that supports dozens of source and target languages. It requires a terminal emulator that supports UTF-8 encoding; I prefer [Terminator](http://gnometerminator.blogspot.com/p/introduction.html). For more info, see the [wiki](https://github.com/drawnepicenter/toloko/wiki).

## Platform

Looking for testers on OSX. Developed and tested on Linux. Works on Windows, see [Windows](#windows-installation) below.

Supported Node.js versions:

- 7.x
- 6.x
- 5.x
- 4.x - Works but it's really slow

## Install

### Linux installation

To initialize the config file and load themes, your NODE_PATH environment variable must point to the **lib/node_modules** directory of the Node.js installation. You can set this path automatically like this:

    export NP=$(which node)
    export BP=${NP%bin/node} #this replaces the string '/bin/node'
    export LP="${BP}lib/node_modules"
    export NODE_PATH="$LP"

Provided these lines are towards the end of the shell initialization file (at least after any NVM stuff) this should work for a system installation of Node.js and [nvm](https://github.com/creationix/nvm).

- Put your [Yandex API key](https://translate.yandex.com/developers) into an environment variable **YANDEX**

Add all of this to .bashrc, .zshrc, etc. then:

    npm install -g toloko
    toloko config init

### Windows installation

I highly recommend using [nodist](https://github.com/marcelklehr/nodist) to install Node.js on Windows. It automatically sets %NODE_PATH% for you, though you may have to edit it to make sure it doesn't contain itself (i.e. C:\...\...\node_modules;%NODE_PATH%). If you install Node.js manually, `npm install --global leximaven` will install the package in C:\Users\username\AppData\Roaming\npm\node_modules. And if you just do `npm install leximaven` then it will install the package to a subfolder of the Node.js installation, but that won't be the NODE_PATH folder unless you manually set it. Either way, you're going to have to mess around with Windows environment variables to get it to work. And don't forget to put your [Yandex API key](https://translate.yandex.com/developers) into an environment variable **YANDEX**

As for getting the ANSI color escape codes to work, [Cmder](http://cmder.net/) seems to be the easiest way. It doesn't install a full linux environment like Cygwin, but you can still use some linux commands like **which**, **cat**, and **ls**.

## Usage

toloko has a built-in help system for CLI parameters and options. Access it with `toloko -h|--help [command] [subcommand]`. There is also the [wiki](https://github.com/drawnepicenter/toloko/wiki).

Here are some examples:

    // Get a translated sentence with the word 'tree' in German from Glosbe
    toloko glosbe example --source eng --target deu tree

    // Translate 'despues' from Spanish to English using Hablaa
    toloko hablaa translate -s spa -t eng despues

    // List Hablaa's supported languages
    toloko hablaa list

    // Translate 'hello' from English to Russian using Yandex
    toloko yandex translate --dir en-ru hello

    // Detect language using Yandex
    toloko yandex detect привет

    // List Yandex's supported languages
    toloko yandex list

See the [tests](https://github.com/drawnepicenter/toloko/blob/master/test/test.es6) for more.

## Resources

These following links can help you use Toloko or perform related tasks.

- A list of ISO 639-1 and 639-2 [language codes](http://www.loc.gov/standards/iso639-2/php/English_list.php) can be helpful in setting the source and target languages.
- [Google Translate](http://translate.google.com) is not perfect, but it does perform translation & transliteration in realtime (as you type). It even provides sound clips (some pre-recorded, some synthesized).
- [Yandex Translate](https://translate.yandex.com/) is similar to Google Translate
- [Frengly](http://www.frengly.com/translate) is yet another
- [Omniglot](http://www.omniglot.com) is an amazing resource for learning about languages, writing systems, and related topics.
- [translit.cc](http://translit.cc/) Translation & transliteration services w/ virtual keyboards for Armenian, Belarusian, Bulgarian, Georgian, Greek, Russian, and Ukranian, plus other useful tools like spell-checking.
- [romaji.me](http://romaji.me/) Transliterate between Japanese text (Kanji, Hiragana, Katakana) and English.

## License

MIT :copyright: 2017 Andrew Prentice

## Powered by

[Glosbe](http://glosbe.com), [Hablaa](http://hablaa.com/), and [Yandex.Translate](http://translate.yandex.com)

## Extras

### Take Command

See [take-command](https://github.com/drawnepicenter/take-command).
