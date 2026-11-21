Add-Type -AssemblyName System.Drawing

$srcPath = "d:\samyak_hair\assets\samyak-hero-banner.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

$w = $img.Width   # 1024
$h = $img.Height  # 682

# In the 1024x682 collage:
# The top banner is from y = 0 to approximately y = 460 (about 67-68% of height)
# The bottom 4 tiles start at y = 460 or 470 to y = 682
# Let's inspect the boundary
Write-Host "Image size: $w x $h"

# Top banner: rect (0, 0, 1024, 464)
$topRect = New-Object System.Drawing.Rectangle(0, 0, $w, 464)
$topBmp = New-Object System.Drawing.Bitmap(1024, 464)
$gTop = [System.Drawing.Graphics]::FromImage($topBmp)
$gTop.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 1024, 464)), $topRect, [System.Drawing.GraphicsUnit]::Pixel)
$topBmp.Save("d:\samyak_hair\assets\samyak-hero-top.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$gTop.Dispose()
$topBmp.Dispose()

# Bottom 4 cards:
# y = 464 to 682 -> height is 218
# Width is 1024 -> 4 cards with small gutters:
# Card 1: x = 0 to 248
# Card 2: x = 258 to 506
# Card 3: x = 516 to 764
# Card 4: x = 774 to 1024

$cardH = 218
$yStart = 464

# Card 1
$c1Rect = New-Object System.Drawing.Rectangle(0, $yStart, 250, $cardH)
$c1Bmp = New-Object System.Drawing.Bitmap(250, $cardH)
$g1 = [System.Drawing.Graphics]::FromImage($c1Bmp)
$g1.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 250, $cardH)), $c1Rect, [System.Drawing.GraphicsUnit]::Pixel)
$c1Bmp.Save("d:\samyak_hair\assets\samyak-card-1.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g1.Dispose()
$c1Bmp.Dispose()

# Card 2
$c2Rect = New-Object System.Drawing.Rectangle(258, $yStart, 250, $cardH)
$c2Bmp = New-Object System.Drawing.Bitmap(250, $cardH)
$g2 = [System.Drawing.Graphics]::FromImage($c2Bmp)
$g2.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 250, $cardH)), $c2Rect, [System.Drawing.GraphicsUnit]::Pixel)
$c2Bmp.Save("d:\samyak_hair\assets\samyak-card-2.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g2.Dispose()
$c2Bmp.Dispose()

# Card 3
$c3Rect = New-Object System.Drawing.Rectangle(516, $yStart, 250, $cardH)
$c3Bmp = New-Object System.Drawing.Bitmap(250, $cardH)
$g3 = [System.Drawing.Graphics]::FromImage($c3Bmp)
$g3.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 250, $cardH)), $c3Rect, [System.Drawing.GraphicsUnit]::Pixel)
$c3Bmp.Save("d:\samyak_hair\assets\samyak-card-3.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g3.Dispose()
$c3Bmp.Dispose()

# Card 4
$c4Rect = New-Object System.Drawing.Rectangle(774, $yStart, 250, $cardH)
$c4Bmp = New-Object System.Drawing.Bitmap(250, $cardH)
$g4 = [System.Drawing.Graphics]::FromImage($c4Bmp)
$g4.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 250, $cardH)), $c4Rect, [System.Drawing.GraphicsUnit]::Pixel)
$c4Bmp.Save("d:\samyak_hair\assets\samyak-card-4.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g4.Dispose()
$c4Bmp.Dispose()

$img.Dispose()
Write-Host "Successfully cropped top hero and 4 category cards!"
