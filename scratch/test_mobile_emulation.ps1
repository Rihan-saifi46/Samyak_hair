$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9333
$out390 = [System.IO.Path]::GetFullPath("scratch/snap_390_emulated.png")
$tempDir = Join-Path $env:TEMP ("chrome_dbg_" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--remote-debugging-port=$port", "--user-data-dir=$tempDir", "--window-size=600,1000", "http://127.0.0.1:9292/" -PassThru

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

        # 1. Set Device Metrics Override for 390 x 844 Mobile
        $overrideParams = @{
            width = 390
            height = 844
            deviceScaleFactor = 1
            mobile = $true
        }
        Send-CDP "Emulation.setDeviceMetricsOverride" $overrideParams | Out-Null

        Start-Sleep -Milliseconds 600

        # 2. Capture screenshot
        $shotParams = @{
            format = "png"
        }
        $raw = Send-CDP "Page.captureScreenshot" $shotParams
        $json = $raw | ConvertFrom-Json
        if ($json.result -and $json.result.data) {
            $bytes = [System.Convert]::FromBase64String($json.result.data)
            [System.IO.File]::WriteAllBytes($out390, $bytes)
            Write-Output "snap_390_emulated.png created: $($bytes.Length) bytes"
        } else {
            Write-Output "Screenshot data not found in response"
        }

        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()
    }
} finally {
    if (!$proc.HasExited) { $proc.Kill() }
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
