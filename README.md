# toloko

[![toloko](icon.png)](http://raw.githubusercontent.com/drawnepicenter/toloko/master/icon.png)

Icon by [A’Design Award & Competition, Onur Müştak Çobanlı and Farhat Datta](http://www.languageicon.org)

_Toloko_ is [Sesotho](http://www.omniglot.com/writing/sesotho.htm) for **interpreter**.

## Introduction

Toloko is a text translation tool for the command line that supports dozens of source and target languages. It requires a terminal emulator that supports UTF-8 encoding; I prefer [Terminator](http://gnometerminator.blogspot.com/p/introduction.html). For more info, see the [wiki](https://github.com/drawnepicenter/toloko/wiki).

## Installation

To initialize the config file and load themes, your NODE_PATH environment variable must point to the **lib/node_modules** directory of the Node.js installation. You can set this path automatically like this:

    export NP=$(which node)
    export BP=${NP%bin/node} #this replaces the string '/bin/node'
    export LP="${BP}lib/node_modules"
    export NODE_PATH="$LP"
    
Provided these lines are towards the end of the shell initialization file (at least after any NVM stuff) this should work for a system installation of Node.js and [nvm](https://github.com/creationix/nvm).

- Put your [Yandex API key](https://translate.yandex.com/developers) into an environment variable **YANDEX**

Add all of this to .bashrc, .zshrc, Windows env, etc. then:

    npm install -g toloko
    toloko config init

## Usage

iloa has a built-in help system for CLI parameters and options. Access it with `toloko -h|--help [command] [subcommand]`. There is also the [wiki](https://github.com/drawnepicenter/toloko/wiki).

Here are some examples:
    
    // Get a translated sentence with the word 'tree' in German from Glosbe
    toloko gl ex --source eng --target deu tree
    
    // Translate 'despues' from Spanish to English using Hablaa
    toloko ha tr -s spa -t eng despues
    
    // List Hablaa's supported languages
    toloko ha ls
    
    // Translate 'hello' from English to Russian using Yandex
    toloko yx tr --dir en-ru hello
    
    // Detect language using Yandex
    toloko yx dt привет
    
    // List Yandex's supported languages
    toloko yx ls

See the [tests](https://github.com/drawnepicenter/toloko/blob/master/test/test.es6) for more.

## Trinity

Toloko is one of three command line utilities along with [Leximaven](https://github.com/drawnepicenter/leximaven) and [iloa](https://github.com/drawnepicenter/iloa) that puts enormous power at your fingertips. Try them alone or together!

## Resources

These following links can help you use Toloko or perform related tasks.

- A list of ISO 639-1 and 639-2 [language codes](http://www.loc.gov/standards/iso639-2/php/English_list.php) can be helpful in setting the source and target languages.
- [Google Translate](http://translate.google.com) is not perfect, but it does perform translation & transliteration in realtime (as you type). It even provides sound clips (some pre-recorded, some synthesized).
- [Yandex Translate](https://translate.yandex.com/) is similar to Google Translate
- [Omniglot](http://www.omniglot.com) is an amazing resource for learning about languages, writing systems, and related topics.
- [translit.cc](http://translit.cc/) Translation & transliteration services w/ virtual keyboards for Armenian, Belarusian, Bulgarian, Georgian, Greek, Russian, and Ukranian, plus other useful tools like spell-checking.
- [romaji.me](http://romaji.me/) Transliterate between Japanese text (Kanji, Hiragana, Katakana) and English.

## Gratitude

Many thanks to all contributors to the gems used in this project! And thanks to the creators and maintainers of the APIs that this tool consumes. Glosbe, Hablaa and Yandex are awesome!

Powered by [Hablaa](http://hablaa.com/)

Powered by [Yandex.Translate](http://translate.yandex.com)
