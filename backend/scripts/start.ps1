$parentPath = Split-Path -parent $PSScriptRoot
Set-Location $parentPath

$uvicornExe = "$parentPath\.venv\Scripts\uvicorn.exe"

& "$uvicornExe" "main:app" "--reload"