$pages = Get-ChildItem 'c:\Users\ayaz\Pictures\LedgerBandhu\frontend\src\pages' -Filter '*.jsx' | Where-Object { $_.Name -ne 'Home.jsx' -and $_.Name -ne 'AdminDashboard.jsx' }

foreach ($file in $pages) {
    $content = Get-Content $file.FullName -Raw

    # Page backgrounds
    $content = $content -replace 'min-h-screen bg-\[#050505\]', 'min-h-screen bg-gray-50'
    $content = $content -replace "bg-\[#050505\]", 'bg-white'
    $content = $content -replace "bg-\[#0F1115\]", 'bg-white'
    $content = $content -replace "bg-\[#161B22\]", 'bg-gray-50'
    $content = $content -replace "bg-white/5\b", 'bg-gray-50'
    $content = $content -replace "bg-white/10\b", 'bg-gray-100'
    $content = $content -replace "bg-white/20\b", 'bg-gray-200'

    # Text colors
    $content = $content -replace 'text-white/90', 'text-gray-800'
    $content = $content -replace 'text-white/80', 'text-gray-700'
    $content = $content -replace 'text-white/70', 'text-gray-500'
    $content = $content -replace 'text-white/60', 'text-gray-500'
    $content = $content -replace 'text-white/40', 'text-gray-400'
    $content = $content -replace 'text-white/30', 'text-gray-500'
    $content = $content -replace 'text-white/20', 'text-gray-300'
    $content = $content -replace '\btext-white\b', 'text-[#111111]'

    # Borders
    $content = $content -replace 'border-white/5\b', 'border-gray-100'
    $content = $content -replace 'border-white/10\b', 'border-gray-200'
    $content = $content -replace 'border-white/20\b', 'border-gray-200'
    $content = $content -replace 'border-white/30\b', 'border-gray-300'

    # Inputs
    $content = $content -replace 'placeholder-white/10', 'placeholder-gray-300'
    $content = $content -replace 'placeholder-white/30', 'placeholder-gray-300'
    $content = $content -replace 'focus:bg-white/10', 'focus:bg-white'

    # Dividers
    $content = $content -replace 'divide-white/5', 'divide-gray-100'
    $content = $content -replace 'divide-white/10', 'divide-gray-200'

    Set-Content $file.FullName $content -NoNewline
    Write-Host "Updated: $($file.Name)"
}
Write-Host "All done!"
