#!/bin/bash

BASEDIR=`dirname $0`;

# Create general symlink for obvius extension scripts
if [ ! -s $BASEDIR/tiny_mce/obvius_scripts ]; then
    ln -s ../obvius/scripts $BASEDIR/tiny_mce/obvius_scripts
fi

if [ ! -s $BASEDIR/tiny_mce/obvius_css ]; then
    ln -s ../obvius/css $BASEDIR/tiny_mce/obvius_css
fi

for d in $BASEDIR/obvius/plugins/*; do
    NAME=`basename $d`
    LINKNAME=$BASEDIR/tiny_mce/plugins/$NAME
    if [ ! -s $LINKNAME ]; then
        ln -s "../../obvius/plugins/$NAME" "$LINKNAME"
    fi
done
