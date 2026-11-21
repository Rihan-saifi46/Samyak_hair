Add-Type -AssemblyName System.Drawing

$inputPath = "assets/samyak-hero-editorial-ref.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)

Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"

# In the 1024x572 image:
# Header is at top: roughly Y: 0 to 102
# Hero is below: Y: 102 to 572 (height ~470)
# Model portrait photo:
# Approx X: 512, Y: 138, Width: 256, Height: 395
# Flat lay photo:
# Approx X: 748, Y: 182, Width: 234, Height: 306

# Let's crop the model portrait:
$rectModel = New-Object System.Drawing.Rectangle(512, 138, 256, 395)
$modelBmp = $bmp.Clone($rectModel, $bmp.PixelFormat)
$modelBmp.Save("assets/samyak-hero-model-portrait.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$modelBmp.Dispose()

# Let's crop the flat-lay photo:
$rectFlatlay = New-Object System.Drawing.Rectangle(748, 182, 234, 306)
$flatlayBmp = $bmp.Clone($rectFlatlay, $bmp.PixelFormat)
$flatlayBmp.Save("assets/samyak-hero-flatlay.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$flatlayBmp.Dispose()

$bmp.Dispose()
Write-Host "Cropped photos saved successfully!"
