#!/bin/bash

PROGDIR=`dirname $0`;

mono $PROGDIR/../../../tools/jstrim_mono.exe "$PROGDIR/editor_plugin_src.js" "$PROGDIR/editor_plugin.js"
