$parent = Split-Path -Path $PSScriptRoot -Parent
$parent = Split-Path -Path $parent -Parent

$backendDir = "$parent\backend"
$webDir = "$parent\web"
Set-Location -Path $backendDir

$pythonExe = ".\.venv\Scripts\python.exe"
& "$pythonExe" ".\extract-openapi.py" "main:app"

Copy-Item -Path "openapi.yaml" -Destination "$webDir\openapi-backend.yaml"
