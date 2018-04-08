# Default Keycodes

These are default key codes that are used to map characters used in layout blocks to QMK variable names. You may declare your own in your own project and overwrite these values if necessary.

## Letters

```keycodes
A KC_A
B KC_B
C KC_C
D KC_D
E KC_E
F KC_F
G KC_G
H KC_H
I KC_I
J KC_J
K KC_K
L KC_L
M KC_M
N KC_N
O KC_O
P KC_P
Q KC_Q
R KC_R
S KC_S
T KC_T
U KC_U
V KC_V
W KC_W
X KC_X
Y KC_Y
Z KC_Z
```

## Numbers

```keycodes
1 KC_1
2 KC_2
3 KC_3
4 KC_4
5 KC_5
6 KC_6
7 KC_7
8 KC_8
9 KC_9
0 KC_0
```

## Function

```keycodes
F1 KC_F1
F2 KC_F2
F3 KC_F3
F4 KC_F4
F5 KC_F5
F6 KC_F6
F7 KC_F7
F8 KC_F8
F9 KC_F9
F10 KC_F10
F11 KC_F11
F12 KC_F12
F13 KC_F13
F14 KC_F14
F15 KC_F15
F16 KC_F16
F17 KC_F17
F18 KC_F18
F19 KC_F19
F20 KC_F20
F21 KC_F21
F22 KC_F22
F23 KC_F23
F24 KC_F24
```

## Actions

```keycodes
⏎ ⌤ ENT KC_ENTER
⎋ ESC KC_ESCAPE
⌫ BSPC KC_BSPACE
⌦ DEL KC_DELETE
⌧ KC_CLEAR
⇥ TAB KC_TAB
␣ SPC KC_SPACE
INS KC_INSERT
APP KC_APPLICATION
```

## Symbols

There are also keycodes like `KC_NONUS_BSLASH` and `KC_NONUS_HASH`. Consider using these for non-US layouts.

```keycodes
- KC_MINUS
= KC_EQUAL
[ KC_LBRACKET
] KC_RBRACKET
\ KC_BSLASH
; KC_SCOLON
' KC_QUOTE
` KC_GRAVE
, KC_COMMA
. KC_DOT
/ KC_SLASH
```

## US ANSI Shifted Keys

```keycodes
~ KC_TILDE
! KC_EXCLAIM
@ KC_AT
# KC_HASH
$ KC_DOLLAR
% KC_PERCENT
^ KC_CIRCUMFLEX
& KC_AMPERSAND
* KC_ASTERISK
( KC_LEFT_PAREN
) KC_RIGHT_PAREN
_ KC_UNDERSCORE
+ KC_PLUS
{ KC_LEFT_CURLY_BRACE
} KC_RIGHT_CURLY_BRACE
| KC_PIPE
: KC_COLON
" KC_DOUBLE_QUOTE
< KC_LEFT_ANGLE_BRACKET
> KC_RIGHT_ANGLE_BRACKET
? KC_QUESTION
```

## Modifiers

```keycodes
⌃ CTRL KC_LCTRL
⇧ SHFT KC_LSHIFT
⌥ ALT KC_LALT
⌘ GUI KC_LGUI
⇪ CAPS KC_CAPSLOCK
⇭ NLCK KC_NUMLOCK
```

## Navigation

```keycodes
⇞ PGUP KC_PGUP
⇟ PGDN KC_PGDOWN
⇱ HOME KC_HOME
⇲ END KC_END
↑ KC_UP
↓ KC_DOWN
← KC_LEFT
→ KC_RIGHT
```

## Media
```keycodes
MUTE KC_AUDIO_MUTE
VOL+ KC_AUDIO_VOL_UP
VOL- KC_AUDIO_VOL_DOWN
⏏ KC_EJCT
```

## System
```keycodes
⌽ PWR KC_SYSTEM_POWER
```

## Quantum

```keycodes
#### KC_NO
RSET RESET
DBUG DEBUG
LEAD KC_LEAD
LOCK KC_LOCK
```

## LED Backlighting

```keycodes
LED BL_TOGG
LED+ BL_INC
LED- BL_DEC
```

## RGB Backlighting

```keycodes
RGB RGB_TOG
RGB+ RGB_VAI
RGB- RGB_VAD
HUE+ RGB_HUI
HUE- RGB_HUD
SAT+ RGB_SAI
SAT- RGB_SAD
RGBM RGB_MODE_FORWARD
```
