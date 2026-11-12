Write-Host "Running vitest..."
npx vitest run 2>&1 | Out-File -FilePath "c:\Users\mathankumar.n\Downloads\HST_IDP\iet-ui-testtaker-1\vitest-output.txt" -Encoding utf8
Write-Host "Done. Exit code: $LASTEXITCODE"
Write-Host "Output saved to vitest-output.txt"
