Output "docs/images/demo-interactive.gif"

Source "docs/demos/common.tape"


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
# Initialize project interactively
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen init"
Sleep 400ms
Enter


# Project name

Wait+Screen /Project name:/
Sleep 500ms

Type "Wiwiki"
Sleep 300ms
Enter


# Project output directory

Wait+Screen /Project output directory/
Sleep 500ms

Type "wiwiki-backend"
Sleep 300ms
Enter


# Database
# Keep default

Wait+Screen /Database:/
Sleep 500ms
Enter


# Transporter
# Keep default

Wait+Screen /Transporter:/
Sleep 500ms
Enter


# Optional infrastructure
# Enable an additional module

Wait+Screen /Infrastructure modules:/
Sleep 600ms

Down
Sleep 200ms

Space
Sleep 350ms

Enter


# Wait for project generation

Wait+Screen /Project "Wiwiki" initialized/
Sleep 1.5s


# ─────────────────────────────────────────────────────────────
# Enter generated project
# ─────────────────────────────────────────────────────────────

Type "cd wiwiki-backend"
Sleep 300ms
Enter

Sleep 600ms

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
Sleep 450ms

Type "Revisions"
Sleep 300ms
Enter


# CRUD service
# Enable

Wait+Screen /CRUD service:/
Type "y"
Sleep 400ms
Enter


# Service file
# Keep generated convention

Wait+Screen /Service file:/
Sleep 400ms
Enter


# Service directory
# Keep generated convention

Wait+Screen /Service directory:/
Sleep 400ms
Enter


# API exposure
# Keep service internal

Wait+Screen /Expose via API Gateway:/
Sleep 400
Enter


# Model file
# Keep generated convention

Wait+Screen /Model file:/
Sleep 400ms
Enter


# Model name
# Keep generated convention

Wait+Screen /Model name:/
Sleep 400ms
Enter


# Model variable
# Keep generated convention

Wait+Screen /Model variable:/
Sleep 400ms
Enter


# Schema
# Keep generated convention

Wait+Screen /Schema:/
Sleep 400ms
Enter


# Collection
# Keep generated convention

Wait+Screen /Collection\/table:/
Sleep 400ms
Enter


# Wait for service generation

Wait+Screen /Service "revisions" added/
Sleep 1.8s

Ctrl+L
Sleep 600ms


# ─────────────────────────────────────────────────────────────
# Add multiple services from configuration
# ─────────────────────────────────────────────────────────────

Type "moleculer-gen add-services ../config/add-services.json"
Sleep 350ms
Enter

Wait+Screen /2 services added/
Sleep 2s