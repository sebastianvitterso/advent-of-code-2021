$lines = Get-Content .\input.txt
$sums = New-Object System.Collections.Generic.List[System.Object]

foreach($char in $lines[0].ToCharArray()) {
    $sums.Add(0)
}

foreach($line in $lines) {
    for($i = 0; $i -lt $line.ToCharArray().Length; $i++) {
        $char = $line.ToCharArray()[$i]
        $sums[$i] += [Convert]::ToInt32($char, 2)
    }
}

$gammaArr = New-Object System.Collections.Generic.List[System.Object]
$epsilonArr = New-Object System.Collections.Generic.List[System.Object]

for($i = 0; $i -lt $sums.Count; $i++) {
    $gammaArr.Add([System.Math]::Round($sums[$i] / $lines.Length))
    $epsilonArr.Add(1 - $gammaArr[$i])
}

$gamma = [Convert]::ToInt32($gammaArr -join "", 2)
$epsilon = [Convert]::ToInt32($epsilonArr -join "", 2)

Write-Output $gamma
Write-Output $epsilon
Write-Output ($gamma * $epsilon)