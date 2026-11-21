$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out1440 = [System.IO.Path]::GetFullPath("scratch/snap_1440.png")
$out390 = [System.IO.Path]::GetFullPath("scratch/snap_390.png")
$tempDir = Join-Path $env:TEMP ("chrome_snap_" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1", "--user-data-dir=$tempDir", "--window-size=1440,1100", "--screenshot=$out1440", "http://127.0.0.1:9292/" -Wait
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1", "--user-data-dir=$tempDir", "--window-size=390,844", "--screenshot=$out390", "http://127.0.0.1:9292/" -Wait

if (Test-Path $out1440) {
    Write-Output "snap_1440 size: $(Get-Item $out1440 | Select-Object -ExpandProperty Length) bytes"
}

if (Test-Path $out390) {
    Write-Output "snap_390 size: $(Get-Item $out390 | Select-Object -ExpandProperty Length) bytes"
}

Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
