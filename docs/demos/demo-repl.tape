Output "docs/images/demo-repl.gif"

Set Shell bash
Set Width 1200
Set Height 600
Set FontSize 22
Set Framerate 15
Set CursorBlink false

Set PlaybackSpeed 1
Set TypingSpeed 150ms
Set WaitTimeout 5m

Require make
Require docker

Hide

Type "cd \"$MOLECULER_GEN_DEMO_PATH\""
Enter
Wait

Type "make start >/dev/null 2>&1"
Enter
Wait

Ctrl+L

Show
Sleep 1s

Type "make repl"
Enter
Wait+Line /^mol \$$/

Sleep 3s

Type "services"
Enter
Wait+Line /^mol \$$/

Sleep 3s

Ctrl+L

Type "actions -f articles.*"
Enter
Wait+Line /^mol \$$/

Sleep 3s

Ctrl+L

Type "call articles.create '{}'"
Enter
Wait+Line /^mol \$$/

Sleep 3s

Type "call articles.list"
Enter
Wait+Line /^mol \$$/

Sleep 8s
