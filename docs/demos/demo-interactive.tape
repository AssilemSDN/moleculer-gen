Output "docs/images/demo-interactive.gif"

Set Shell "zsh"
Set Width 1200
Set Height 600
Set FontSize 22
Set Framerate 15
Set CursorBlink false


# ─────────────────────────────────────────────────────────────
# Prepare isolated demo environment
# ─────────────────────────────────────────────────────────────

Hide

Type "rm -rf /tmp/moleculer-gen-vhs-demo"
Enter

Type "mkdir -p /tmp/moleculer-gen-vhs-demo/config"
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

Type "moleculer-gen init"
Sleep 400ms
Enter


# Project name

Wait+Screen /Project name:/
Sleep 600ms

Type "Wiwiki Backend"
Sleep 350ms
Enter


# Database

Wait+Screen /Database:/
Sleep 600ms

# Keep default database
Enter


# Transporter

Wait+Screen /Transporter:/
Sleep 600ms

# Keep default transporter
Enter


# Optional infrastructure

Wait+Screen /Infrastructure modules:/
Sleep 700ms

# Select an additional infrastructure module
Down
Sleep 250ms

Space
Sleep 400ms

Enter


# Wait for project generation

Wait+Screen /Project "Wiwiki Backend" initialized/
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

Type "moleculer-gen add-service"
Sleep 350ms
Enter


# Service name

Wait+Screen /Service name:/
Sleep 500ms

Type "Revisions"
Sleep 400ms
Enter


# CRUD service

Wait+Screen /CRUD service:/
Sleep 400ms

# Keep CRUD enabled
Enter


# Service file
# Accept generated convention

Wait+Screen /Service file:/
Sleep 400ms
Enter


# Service directory
# Accept generated convention

Wait+Screen /Service directory:/
Sleep 400ms
Enter


# API exposure
# Revisions stays internal

Wait+Screen /Expose via API Gateway:/
Sleep 600ms

Type "n"
Sleep 400ms
Enter


# Model file
# Accept generated convention

Wait+Screen /Model file:/
Sleep 400ms
Enter


# Model name
# Accept generated convention

Wait+Screen /Model name:/
Sleep 400ms
Enter


# Model variable
# Accept generated convention

Wait+Screen /Model variable:/
Sleep 400ms
Enter


# Schema
# Accept generated convention

Wait+Screen /Schema:/
Sleep 400ms
Enter


# Collection
# Accept generated convention

Wait+Screen /Collection\/table:/
Sleep 400ms
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