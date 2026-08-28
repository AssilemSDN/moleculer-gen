Output "docs/images/demo-interactive.gif"

Set Shell "zsh"
Set Width 1600
Set Height 800
Set FontSize 22
Set TypingSpeed 110ms
Set PlaybackSpeed 0.50
Set WaitTimeout 30s

# Prepare isolated environment

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

Sleep 2s

# Initialize project

Type "moleculer-gen init"
Sleep 1s
Enter

# Project name

Wait+Screen /Project name:/
Sleep 1.5s

Type "Wiwiki Backend"
Sleep 1.5s
Enter

# Database

Wait+Screen /Database:/
Sleep 1.5s
Enter

# Transporter

Wait+Screen /Transporter:/
Sleep 1.5s
Enter

# Optional infrastructure

Wait+Screen /Infrastructure modules:/
Sleep 2s

Down
Sleep 1s

Space
Sleep 1.5s

Enter

# Project generation

Wait+Screen /Project "Wiwiki Backend" initialized/
Sleep 3s

# Enter generated project

Type "cd wiwiki-backend"
Sleep 1s
Enter

Sleep 2s

Ctrl+L
Sleep 2s

# Add service interactively

Type "moleculer-gen add-service"
Sleep 1s
Enter

# Service name

Wait+Screen /Service name:/
Sleep 1.5s

Type "Articles"
Sleep 1.5s
Enter

# CRUD service

Wait+Screen /CRUD service:/
Sleep 1.5s
Enter

# Service file

Wait+Screen /Service file:/
Sleep 1.5s
Enter

# Service directory

Wait+Screen /Service directory:/
Sleep 1.5s
Enter

# API exposure

Wait+Screen /Expose via API Gateway:/
Sleep 2.5s

Type "n"

Sleep 2s
Enter

# Model file

Wait+Screen /Model file:/
Sleep 1.5s
Enter

# Model name

Wait+Screen /Model name:/
Sleep 1.5s
Enter

# Model variable

Wait+Screen /Model variable:/
Sleep 1.5s
Enter

# Schema

Wait+Screen /Schema:/
Sleep 1.5s
Enter

# Collection

Wait+Screen /Collection\/table:/
Sleep 1.5s
Enter

# Service generation

Wait+Screen /Service "articles" added/
Sleep 3s

Ctrl+L
Sleep 2s

# Add multiple services from configuration

Type "moleculer-gen add-services ../config/add-services.json"
Sleep 1s
Enter

Wait+Screen /Skipped services: articles/
Sleep 1.5s

Wait+Screen /1 service added, 1 service skipped/

# Keep final result visible

Sleep 6s
