Output "docs/images/demo-interactive.gif"

Set Shell "zsh"
Set Width 1600
Set Height 800
Set FontSize 22
Set TypingSpeed 100ms
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

# Clear preparation commands before recording becomes visible
Ctrl+L

Show

Sleep 2s

# Initialize project

Type "moleculer-gen init"

Sleep 700ms
Enter

Wait+Screen /Project name:/
Sleep 1.5s

Type "Wiwiki Backend"
Sleep 1.5s

Enter

# Database

Wait+Screen /Choose a database:/
Sleep 1.5s

Enter

# Transporter

Wait+Screen /Choose a transporter:/
Sleep 1.5s

Enter

# Optional infrastructure

Wait+Screen /Select optional infrastructure modules:/
Sleep 2s

Down
Sleep 1s

Space
Sleep 1.5s

Enter

# Wait until project generation is actually finished

Wait+Screen /project initialization completed/
Sleep 3s

# Enter generated project

Type "cd wiwiki-backend"

Sleep 700ms
Enter

Sleep 5s

Ctrl+L
Sleep 2s

# Add service interactively

Type "moleculer-gen add-service"

Sleep 700ms
Enter

# Service name

Wait+Screen /Service name/
Sleep 1.5s

Type "Articles"

Sleep 700ms
Enter

# CRUD

Wait+Screen /Is this a CRUD service?/
Sleep 1.5s

Enter

# Service file name

Wait+Screen /Service file name:/
Sleep 2s

Enter

# Service directory

Wait+Screen /Service directory name:/
Sleep 2s

Enter

# API exposure

Wait+Screen /Expose CRUD operations via API Gateway?/
Sleep 1.5s

Enter

# Model file

Wait+Screen /Model file name:/
Sleep 2s

Enter

# Model name

Wait+Screen /Model name:/
Sleep 2s

Enter

# Model variable

Wait+Screen /Model variable name:/
Sleep 2s

Enter

# Schema

Wait+Screen /Schema name:/
Sleep 2s

Enter

# Collection

Wait+Screen /Collection\/table name:/
Sleep 1.5s

Enter

# Wait until service generation is finished

Wait+Screen /service addition completed/
Sleep 5s

Ctrl+L
Sleep 2s

# Add multiple services from configuration

Type "moleculer-gen add-services ../config/add-services.json"

Sleep 1s
Enter

Wait+Screen /batch services addition completed/

# Keep final result visible
Sleep 10s
