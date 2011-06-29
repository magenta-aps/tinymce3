The folder tiny_mce/ under this directory should only contain the source
code from the latest tinymce release. This is so the entire folder can
be replaced whenever moxiecode releases a new version.

Any extensions should be made as plugins and placed in the
obvius/plugins/ folder. General scripts that do not utilize the tinymce
API should be placed in the obvius/scripts/ folder.


When adding a new plugin or updating the tinymce code run the
./build_symlinks.sh script to recreate the necessary symlinks.
