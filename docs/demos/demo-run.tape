Output "docs/images/demo-run.gif"

Set Shell "zsh"
Set Width 1200
Set Height 600
Set FontSize 22
Set Framerate 15
Set CursorBlink false

# Build/runtime output is rendered faster.
Set PlaybackSpeed 1
Set TypingSpeed 150ms

# Docker builds can legitimately take a while.
Set WaitTimeout 5m

Hide

Type "cd ~/Documents/moleculer-gen-projects/wiwiki-backend"
Enter
Wait

Type "make stop >/dev/null 2>&1 || true"
Enter
Wait

Ctrl+L

Show
Sleep 1s

Type "make build"
Enter
Wait

Sleep 3s

Ctrl+L

Type "make start"
Enter
Wait

Sleep 8s