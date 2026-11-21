$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9333
$tempDir = Join-Path $env:TEMP ("chrome_dbg_" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--remote-debugging-port=$port", "--user-data-dir=$tempDir", "--window-size=1600,1200", "http://127.0.0.1:9292/" -PassThru

Start-Sleep -Seconds 3

try {
    $resp = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json"
    $page = $resp | Where-Object { $_.type -eq "page" } | Select-Object -First 1
    if ($page) {
        $wsUrl = $page.webSocketDebuggerUrl
        $ws = New-Object System.Net.WebSockets.ClientWebSocket
        $cts = New-Object System.Threading.CancellationTokenSource
        $task = $ws.ConnectAsync([System.Uri]$wsUrl, $cts.Token)
        $task.Wait()

        function Send-CDP($method, $params) {
            $cmd = @{
                id = [System.Environment]::TickCount
                method = $method
                params = $params
            } | ConvertTo-Json -Compress

            $bytes = [System.Text.Encoding]::UTF8.GetBytes($cmd)
            $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
            $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

            $ms = New-Object System.IO.MemoryStream
            $buffer = New-Object byte[] 65536
            do {
                $seg = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
                $res = $ws.ReceiveAsync($seg, $cts.Token)
                $res.Wait()
                $ms.Write($buffer, 0, $res.Result.Count)
            } while (!$res.Result.EndOfMessage)

            $bytesOut = $ms.ToArray()
            $ms.Dispose()
            return [System.Text.Encoding]::UTF8.GetString($bytesOut)
        }

        function Measure-Viewport($w, $h, $name) {
            $overrideParams = @{
                width = $w
                height = $h
                deviceScaleFactor = 1
                mobile = ($w -lt 600)
            }
            Send-CDP "Emulation.setDeviceMetricsOverride" $overrideParams | Out-Null
            Start-Sleep -Milliseconds 600

            $measureJs = @"
(function() {
    var header = document.querySelector('#header-component');
    var hero = document.querySelector('.samyak-main-hero-section');
    var img = document.querySelector('.samyak-hero-banner-img');
    return JSON.stringify({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        headerHeight: header ? header.offsetHeight : 0,
        heroHeight: hero ? hero.offsetHeight : 0,
        totalFirstScreen: (header ? header.offsetHeight : 0) + (hero ? hero.offsetHeight : 0),
        imgWidth: img ? Math.round(img.getBoundingClientRect().width) : 0,
        imgHeight: img ? Math.round(img.getBoundingClientRect().height) : 0,
        imgNaturalWidth: img ? img.naturalWidth : 0,
        imgNaturalHeight: img ? img.naturalHeight : 0,
        scrollY: window.scrollY
    });
})()
"@
            $evalRes = Send-CDP "Runtime.evaluate" @{ expression = $measureJs; returnByValue = $true }
            $evalJson = $evalRes | ConvertFrom-Json
            Write-Output "=== VIEWPORT: $name ($w x $h) ==="
            Write-Output $evalJson.result.result.value

            $outImg = [System.IO.Path]::GetFullPath("scratch/shot_$name.png")
            $shot = Send-CDP "Page.captureScreenshot" @{ format = "png" }
            $shotJson = $shot | ConvertFrom-Json
            if ($shotJson.result -and $shotJson.result.data) {
                $b = [System.Convert]::FromBase64String($shotJson.result.data)
                [System.IO.File]::WriteAllBytes($outImg, $b)
                Write-Output "Saved screenshot: $outImg ($($b.Length) bytes)"
            }
        }

        Measure-Viewport 1440 900 "1440x900"
        Measure-Viewport 1280 800 "1280x800"
        Measure-Viewport 390 844 "390x844"

        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()
    }
} finally {
    if (!$proc.HasExited) { $proc.Kill() }
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
