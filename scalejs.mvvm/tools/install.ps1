param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.mvvm'					: 'Scripts/scalejs.mvvm-$($package.Version)',
		'text'							: 'Scripts/text',
		'knockout'						: 'Scripts/knockout-2.2.1',
		'knockout.mapping'				: 'Scripts/knockout.mapping-latest'
	}" |
	Add-ScalejsExtension 'scalejs.mvvm' |
	Out-Null
