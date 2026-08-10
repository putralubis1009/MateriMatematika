$appDir = "c:\Users\TODAY TECH\Downloads\materi-matematika-ai\app\app"
$libDir = "c:\Users\TODAY TECH\Downloads\materi-matematika-ai\app\lib"

$dirs = @($appDir, $libDir)

foreach ($dir in $dirs) {
    $files = Get-ChildItem -Recurse -Include "*.ts","*.tsx" -Path $dir -ErrorAction SilentlyContinue
    foreach ($f in $files) {
        if ($f.FullName -like "*node_modules*") { continue }
        $content = Get-Content $f.FullName -Raw -Encoding UTF8
        if ($null -eq $content) { continue }
        if ($content -match 'createSupabaseServerClient') {
            $newContent = $content -replace 'from "@/lib/db"', 'from "@/lib/db.server"'
            if ($newContent -ne $content) {
                Set-Content -Path $f.FullName -Value $newContent -Encoding UTF8 -NoNewline
                Write-Host "Updated: $($f.Name)"
            }
        }
    }
}
Write-Host "Done!"
