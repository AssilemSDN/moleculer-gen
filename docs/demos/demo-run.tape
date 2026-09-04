Output "docs/images/demo-run.gif"

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


# ─────────────────────────────────────────────────────────────
# Prepare isolated demo environment
# ─────────────────────────────────────────────────────────────

Hide

Type "rm -rf /tmp/moleculer-gen-vhs-demo"
Enter

Type "mkdir -p /tmp/moleculer-gen-vhs-demo/config"
Enter

Type "cp examples/config/init-project/demo.json /tmp/moleculer-gen-vhs-demo/config/init-project.json"
Enter

Type "cp examples/config/add-service/demo.json /tmp/moleculer-gen-vhs-demo/config/revisions-service.json"
Enter

Type "cp examples/config/add-services/demo.json /tmp/moleculer-gen-vhs-demo/config/add-services.json"
Enter

Type "cd /tmp/moleculer-gen-vhs-demo"
Enter


# ─────────────────────────────────────────────────────────────
# Generate complete demo project
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen init config/init-project.json"
Enter

Wait+Screen /Project "Wiwiki" initialized/

Type "cd wiwiki-backend"
Enter

Type "moleculer-gen add-service ../config/revisions-service.json"
Enter

Wait+Screen /Service "revisions" added/

Type "moleculer-gen add-services ../config/add-services.json"
Enter

Wait+Screen /2 services added/

Type "make stop >/dev/null 2>&1 || true"
Enter
Wait

Ctrl+L

Show
Sleep 1s


# ─────────────────────────────────────────────────────────────
# Build
# ─────────────────────────────────────────────────────────────

Type "make build"
Enter
Wait

Sleep 3s

Ctrl+L


# ─────────────────────────────────────────────────────────────
# Start
# ─────────────────────────────────────────────────────────────

Type "make start"
Enter
Wait

Sleep 3s


# ─────────────────────────────────────────────────────────────
# Status
# ─────────────────────────────────────────────────────────────

Type "make ps"
Enter
Wait

Sleep 8s