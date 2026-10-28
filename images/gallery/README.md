# Gallery photos go here

The Gallery page (gallery.html) looks for files in this folder, named
to match the `file` field of each entry in js/gallery.js's
`GALLERY_ITEMS` array — for example:

    images/gallery/uav-missions-01.jpg
    images/gallery/crop-health-02.jpg

Until a matching file exists, that frame shows a generated placeholder
(category icon + the filename it's waiting for) instead of a broken
image. Just drop a same-named .jpg/.png/.webp into this folder and the
placeholder is replaced automatically — no HTML or CSS changes needed.

To add, remove, reorder, or recaption frames, edit the GALLERY_ITEMS
array at the top of js/gallery.js — each object is one frame, and its
`file` value is the filename this folder should contain.

Recommended: photos around 1600px on the long edge, compressed
(~200–400KB each) keep the page fast. Images load lazily, so file
count doesn't hurt initial page load.
