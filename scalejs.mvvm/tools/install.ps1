param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.mvvm'					: 'Scripts/scalejs.mvvm-$($package.Version)',
		'text'							: 'Scripts/text',
		'knockout'						: 'Scripts/knockout-3.0.0.debug',
		'knockout.mapping'				: 'Scripts/knockout.mapping-latest.debug',
		'bindings'						: 'Scripts/scalejs.mvvm.bindings',
		'views'							: 'Scripts/scalejs.mvvm.views'
	}" |
	Add-ScalejsExtension 'scalejs.mvvm' |
	Out-Null
