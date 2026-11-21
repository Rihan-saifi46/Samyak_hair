$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out1440 = [System.IO.Path]::GetFullPath("scratch/screenshot_1440.png")
$out390 = [System.IO.Path]::GetFullPath("scratch/screenshot_390.png")

Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=3000", "--window-size=1440,1100", "--screenshot=$out1440", "http://127.0.0.1:9292/" -Wait
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=3000", "--window-size=390,844", "--screenshot=$out390", "http://127.0.0.1:9292/" -Wait

if (Test-Path $out1440) {
    Write-Output "1440 screenshot captured: $(Get-Item $out1440 | Select-Object -ExpandProperty Length) bytes"
} else {
    Write-Output "1440 screenshot failed"
}

if (Test-Path $out390) {
    Write-Output "390 screenshot captured: $(Get-Item $out390 | Select-Object -ExpandProperty Length) bytes"
} else {
    Write-Output "390 screenshot failed"
}
