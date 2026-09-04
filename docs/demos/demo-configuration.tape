Output "docs/images/demo-configuration.gif"

Source ./common.tape


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

Ctrl+L

Show

Sleep 1s


# ─────────────────────────────────────────────────────────────
# Initialize project
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen init config/init-project.json"
Sleep 400ms
Enter

# Wait for project generation

Wait+Screen /Project "Wiwiki" initialized/
Sleep 1.5s


# ─────────────────────────────────────────────────────────────
# Enter generated project
# ─────────────────────────────────────────────────────────────

Type "cd wiwiki-backend"
Sleep 350ms
Enter

Sleep 700ms

Ctrl+L
Sleep 600ms


# ─────────────────────────────────────────────────────────────
# Add an internal CRUD service interactively
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen add-service ../config/revisions-service.json"
Sleep 350ms
Enter

# Wait for service generation

Wait+Screen /Service "revisions" added/

Sleep 2s

Ctrl+L
Sleep 600ms

# ─────────────────────────────────────────────────────────────
# Add multiple public services from configuration
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen add-services ../config/add-services.json"
Sleep 350ms
Enter

Wait+Screen /2 services added/

Sleep 3s 
