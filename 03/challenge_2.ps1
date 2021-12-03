$lines = Get-Content .\input.txt
$oxygenLines = @() + $lines
$co2Lines = @() + $lines

for ($i = 0; $i -lt $lines[0].Length; $i++) {
    $ones = 0
    $zeros = 0
    foreach($line in $oxygenLines) { 
        If ($line.ToCharArray()[$i] -eq "1") {$ones++} Else {$zeros++}
    }
    $mostCommonBit = If ($ones -ge $zeros) {1} Else {0}
    $oxygenLines = @($oxygenLines | Where-Object { $_[$i] -eq $mostCommonBit.ToString()})
    
    if($oxygenLines.Length -eq 1) { break }
}

for ($i = 0; $i -lt $lines[0].Length; $i++) {
    $ones = 0
    $zeros = 0
    foreach($line in $co2Lines) { 
        If ($line.ToCharArray()[$i] -eq "1") {$ones++} Else {$zeros++}
    }
    $mostCommonBit = If ($ones -ge $zeros) {1} Else {0}

    $co2Lines = @($co2Lines | Where-Object { $_[$i] -ne $mostCommonBit.ToString()})
    
    if($co2Lines.Length -eq 1) { break }
}

Write-Output $oxygenLines[0]
Write-Output $co2Lines[0]
$oxygenRating = [Convert]::ToInt32($oxygenLines[0], 2)
$co2Rating = [Convert]::ToInt32($co2Lines[0], 2)

Write-Output $oxygenRating
Write-Output $co2Rating
Write-Output ($oxygenRating * $co2Rating)
