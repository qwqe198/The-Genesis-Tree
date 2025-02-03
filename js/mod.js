let modInfo = {
	name: "创世之树",
	id: "genesistree",
	author: "lingluo",
	pointsName: "点数",
	modFiles: ["layers.js", "tree.js","achievements.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // 用于硬重置和新玩家
	offlineLimit: 1/60,  // 以小时为单位
}

// 设置版本号和名称
let VERSION = {
	num: "0.0.1",
	name: "起步阶段",
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>v0.0.1</h3><br>
		- 修复了一些措辞。<br>
		- 改进了生活质量并削弱了一些时间墙。<br>
		- 修复了I22的一个严重错误。<br>
		- 为重力软上限添加了专用标签。<br>
	<br>
	<h3>v0.0</h3><br>
		- 添加了粒子纠缠层。<br>
		- 添加了空间和时间层。<br>
		- 添加了质量层，但尚未添加内容。<br>`

let winText = `恭喜！你已经到达终点并完成了这个游戏，但暂时就到这里...`


// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
	let points = new Decimal(modInfo.initialStartPoints)
	if (hasMilestone('i',0)) points = points.add(10)
    return points
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade('p',11)
}

// Calculate points/sec!
function getPointGen() {
	if(!hasUpgrade('p',11)) return decimalZero
	
	let gain = new Decimal(1)
	if (hasUpgrade('p',12)) gain = gain.mul(layerEffect('p'))
	if (hasUpgrade('p',14)) gain = gain.mul(upgradeEffect('p',14))
	if (player.t.unlocked) gain = gain.mul(layerEffect('t'))
	if (hasUpgrade('s',11)) gain = gain.mul(layerEffect('s'))
	
	if (hasUpgrade('i',14)) gain = gain.mul(layerEffect('i'))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	shiftAlias: false,
	controlAlias: false
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1145141919810"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(30) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}