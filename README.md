# QMK Premap

QMK Premap compiles simple Markdown file code snippets into C code layer definitions for [QMK](https://docs.qmk.fm/).

## Why

QMK keymaps are fairly simple already, but they can be a little verbose and hard to read at a glance. Take this example:

```c
/* LAYER 1
 * ,-------------------------------.
 * |  ESC  |   +   |   -   | COPY  |
 * |-------+-------+-------+-------|
 * |  BSPC |   *   |   /   | PASTE |
 * |-------+-------+-------+-------|
 * |  0    |   .   |   =   | SHIFT+|
 * `-------------------------------'
 */
[_MISC] = KEYMAP( \
  KC_ESC,  KC_PLUS, KC_MINS, RCTL(KC_C), \
  KC_BSPC, KC_ASTR, KC_SLSH, RCTL(KC_V), \
  KC_0,    KC_DOT,  KC_EQL,  MT(MOD_RSFT, OSM(MOD_RALT)) \
)
```

The fact that authors often feel the need to add a human-readable comment to explain their keymaps speaks for itself. The same keymap can be expressed with a QMK Premap snippet:

```keymap
# layer: _MISC
# charWidth: 7

  ┌───────┬───────┬───────┬───────┐
  │  ESC  │   +   │   -   │  ⌃c   │
  ├───────┼───────┼───────┼───────┤
  │   ⌫   │   *   │   /   │  ⌃v   │
  ├───────┼───────┼───────┼───────┤
  │   0   │   .   │   =   │ ⇧‖⇧…  │
  └───────┴───────┴───────┴───────┘
```

## Installation

```bash
npm i qmk-premap
```

## Usage

```bash
qmk-premap -o ./dist/keymap_layers.c keymap.md keycodes.md
```

## Key Codes

Keycodes are defined in Markdown documents, as follows:

```keycodes
~ KC_TILDE
! KC_EXCLAIM
@ KC_AT
# KC_HASH
```

The above are already included in the [default key codes](./lib/defaultKeycodes.md).

```keycodes
COPY RCTL(KC_C)
PASTE {⌃v}
SHIFT+ {⇧‖⇧…}
HELLO "Hello World!"
```
