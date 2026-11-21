$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9333
$tempDir = Join-Path $env:TEMP ("chrome_dbg_" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--remote-debugging-port=$port", "--user-data-dir=$tempDir", "--window-size=390,844", "http://127.0.0.1:9292/" -PassThru

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

        $js = @"
(function() {
    var out = [];
    document.querySelectorAll('*').forEach(function(el) {
        if (el.scrollWidth > 395 || el.offsetWidth > 395) {
            if (el.tagName !== 'HTML' && el.tagName !== 'BODY' && !el.className.includes('page-wrapper')) {
                out.push({
                    tag: el.tagName,
                    id: el.id,
                    className: (typeof el.className === 'string') ? el.className.slice(0, 50) : '',
                    scrollWidth: el.scrollWidth,
                    offsetWidth: el.offsetWidth
                });
            }
        }
    });
    return JSON.stringify(out.slice(0, 10));
})()
"@
        $cmd = @{
            id = 1
            method = "Runtime.evaluate"
            params = @{
                expression = $js
                returnByValue = $true
            }
        } | ConvertTo-Json -Compress

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($cmd)
        $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        $buffer = New-Object byte[] 65536
        $seg = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
        $res = $ws.ReceiveAsync($seg, $cts.Token)
        $res.Wait()

        $rawJson = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $res.Result.Count)
        Write-Output "CDP SCROLLWIDTH RESPONSE:"
        Write-Output $rawJson
        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()
    }
} finally {
    if (!$proc.HasExited) { $proc.Kill() }
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
