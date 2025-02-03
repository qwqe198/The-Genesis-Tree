addLayer("p", {
    name: "粒子", // 这是可选的，仅在少数地方使用。如果省略，则使用层的ID。
    symbol: "P", // 显示在层的节点上。默认是ID的首字母大写
    position: 0, // 行内的水平位置。默认按ID字母顺序排序
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#777799",
    requires: new Decimal(10), // 可以是一个函数，考虑需求的增加
    resource: "粒子", // 重置货币的名称
    baseResource: "点数", // 重置基于的资源名称
    baseAmount() {return player.points}, // 获取当前基础资源的数量
    type: "normal", // normal: 获得货币的成本取决于获得的量。static: 成本取决于你已经拥有的量
    exponent: 0.5, // 重置货币的指数
    gainMult() { // 计算来自奖励的主货币乘数
        mult = new Decimal(1)
        if(hasUpgrade('i',11)) mult = mult.mul(layerEffect('i'))
        return mult
    },
    gainExp() { // 计算来自奖励的主货币指数
        return new Decimal(1)
    },
    row: 0, // 层在树中的行（0是第一行）
    hotkeys: [
        {key: "p", description: "P: 创建粒子", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription:'创建 ',
    layerShown(){return true},
    effect(){
        if (!hasUpgrade('p',12)) return decimalOne
        if (hasUpgrade('p',25)){
            mult = player.p.best.add(1)
            exp = 0.4
            if(hasUpgrade('s',22)) exp = 0.5
            mult = mult.pow(exp)
        }else{
            mult = player.p.best.add(1).log2().add(1)
            if(hasUpgrade('p',13)) mult = mult.pow(upgradeEffect('p',13))
        }
        return mult
    },
    effectDescription(){
        if (!hasUpgrade('p',12)) return "没有效果。"
        let dis = "将点数获取速度提升 x"+layerText("h2", "p", format(tmp.p.effect))
        return dis
    },
    passiveGeneration(){
        if (hasUpgrade('t',11)) return layerEffect('t')
        else return decimalZero
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone('i', 1) && resettingLayer=='i' || hasMilestone('s', 0) && resettingLayer=='s' || hasMilestone('t', 0)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows:2,
        cols:5,
        11:{
            title: "P11:开始",
            description: "开始生成点数。",
            cost: new Decimal(0),
            effect(){return true},
        },
        12:{
            title: "P12:粒子力量",
            description: "最佳粒子提升点数获取速度。",
            cost: new Decimal(1),
            effect(){return true},
            unlocked(){
                return hasUpgrade('p',11)
            }
        },
        13:{
            title: "P13:更多粒子力量",
            description: "粒子效果平方。",
            cost: new Decimal(5),
            effect(){
                if(hasUpgrade('p',25)) return decimalOne
                let exp = new Decimal(2)
                if(hasUpgrade('p',21)) exp = exp.add(2)
                if(hasUpgrade('p',23)) exp = exp.add(3)
                if(hasUpgrade('p',24)) exp = exp.add(5)
                return exp
            },
            effectDisplay(){
                if(hasUpgrade('p',25)) return "已禁用"
                return "^" + format(upgradeEffect('p',13))
            },
            unlocked(){
                return hasUpgrade('p',12)
            }
        },
        14:{
            title: "P14:点数协同",
            description: "点数提升点数获取速度。",
            cost: new Decimal(50),
            effect(){
                if(hasUpgrade('p',22)){
                    mult = player.points.add(1)
                    exp = 0.46
                    if(hasUpgrade('s',23)) exp = 0.5
                }else{
                    mult = player.points.max(10).div(10).add(1).log2()
                    exp = 2
                    if(hasUpgrade('i',12) && hasUpgrade('p',15)) exp *= 2
                }
                return mult.pow(exp)
            },
            effectDisplay(){
                return format(upgradeEffect('p',14)) + "x"
            },
            unlocked(){
                return hasUpgrade('p',13)
            }
        },
        15:{
            title: "P15:纠缠",
            description(){
                dis = "解锁下一层"
                if(hasUpgrade('i',12) && !hasUpgrade('p',22)) dis = dis + "，并使P14效果平方。"
                else dis = dis + "。"
                return dis
            },
            cost: new Decimal(500),
            pay(){return},
            effect(){
                return hasUpgrade('i',12)? decimalOne : decimalZero
            },
            unlocked(){
                return hasUpgrade('p',14)
            }
        },
        21:{
            title: "P21:受限粒子力量",
            description: "P13效果指数+2。",
            cost(){return (player.s.unlockOrder)?(new Decimal(1e22)):(new Decimal(1e6))},
            effect(){
                return new Decimal(2)
            },
            effectDisplay(){
                return "+" + format(upgradeEffect('p',21))
            },
            unlocked(){
                return hasUpgrade('s',12) || hasUpgrade('p',21)
            }
        },
        22:{
            title: "P22:成形点数协同",
            description: "改进点数协同公式。",
            cost(){return (player.s.unlockOrder)?(new Decimal(1e26)):(new Decimal(1e12))},
            effect(){return true},
            unlocked(){
                return (hasUpgrade('s',12) && hasUpgrade('p',21)) || hasUpgrade('p',22)
            }
        },
        23:{
            title: "P23:受限粒子力量 II",
            description: "P13效果指数+3。",
            cost(){return (player.s.unlockOrder)?(new Decimal(1e33)):(new Decimal(2e13))},
            effect(){
                return new Decimal(3)
            },
            effectDisplay(){
                return "+" + format(upgradeEffect('p',23))
            },
            unlocked(){
                return (hasUpgrade('s',12) && hasUpgrade('p',22)) || hasUpgrade('p',23)
            }
        },
        24:{
            title: "P24:受限粒子力量 III",
            description: "P13效果指数+5。",
            cost: new Decimal(1e62),
            effect(){
                return new Decimal(5)
            },
            effectDisplay(){
                return "+" + format(upgradeEffect('p',24))
            },
            unlocked(){
                return (hasUpgrade('s',12) && hasUpgrade('p',23)) || hasUpgrade('p',24)
            }
        },
        25:{
            title: "P25:成形粒子力量",
            description: "改进粒子效果公式。禁用P13。",
            cost: new Decimal(1e98),
            effect(){return true},
            unlocked(){
                return (hasUpgrade('s',12) && hasUpgrade('p',24)) || hasUpgrade('p',25)
            }
        },
    }
})

addLayer("i", {
    name: "纠缠",
    symbol: "I",
    position: 1,
    startData(){ return {
                unlocked: false,
                points: decimalZero,
                best: decimalZero,
                total: decimalZero,
        }},
    color: "#EEEEEE",
    requires: new Decimal(500),
    resource: "纠缠", 
    baseResource: "粒子", 
    baseAmount() {return player.p.points}, 
    type: "normal", 
    exponent: 0.25, 
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade('s',11)) mult = mult.mul(layerEffect('s'))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1, 
    branches: ["p"],
    hotkeys: [
        {key: "i", description: "I: 重置以获取纠缠", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription:"纠缠粒子以获取",
    layerShown(){
        return hasUpgrade('p',15) || player.i.unlocked
    },
    effect(){
        if (!hasUpgrade('i',11)) return decimalOne
        if (hasUpgrade('i',23)){
            mult = player.i.best.add(1)
            exp = 0.4
            if(hasUpgrade('s',21)) exp = exp + 0.1
            if(hasUpgrade('s',25)) exp = exp + 0.05
            mult = mult.pow(exp)
        }else{
        mult = player.i.best.add(1).log2().mul(2).add(1)
        if (hasUpgrade('i',13)) mult = mult.pow(upgradeEffect('i',13))
        }
        return mult
    },
    effectDescription(){
        if (!hasUpgrade('i',11)) return "没有效果。"
        let dis = "提升粒子"
        if (hasUpgrade('i',14)) dis = dis + "和点数"
        dis = dis + "获取速度x"+layerText("h2", "i", format(tmp.i.effect))
        return dis
    },
    passiveGeneration(){
        if (hasUpgrade('t',12)) return layerEffect('t')
        else return decimalZero
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone('t',0)) keep.push('milestones')
        if (hasMilestone('t',1) && resettingLayer == 't') keep.push('upgrades')
        if (hasMilestone('s',1) && resettingLayer == 's') keep.push('upgrades','milestones')
        //T和S层也会重置此层
        if (layers[resettingLayer].row > this.row || resettingLayer == 't' || resettingLayer == 's') layerDataReset(this.layer, keep)
    },
    milestones: {
        0:{
            requirementDescription: "(I0)3总纠缠",
            done() { return player.i.total.gte(3) },
            effectDescription: "重置此层或更高层时，以10点数开始。"
        },
        1:{
            requirementDescription: "(I1)20总纠缠",
            done() { return player.i.total.gte(20) },
            unlocked() { return hasMilestone('i',0) || hasMilestone('i',1)},
            effectDescription: "在纠缠重置时保留粒子升级。"
        }
    },
    upgrades: {
        rows: 2,
        cols: 5,
        11:{
            title: "I11:粒子纠缠",
            description: "最佳纠缠提升粒子获取速度。",
            cost: new Decimal(1),
            effect(){return true},
        },
        12:{
            title: "I12:纠缠粒子",
            description: "使P15生效。",
            cost: new Decimal(4),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',11)
            }
        },
        13:{
            title: "I13:强力纠缠",
            description: "纠缠效果平方。",
            cost: new Decimal(30),
            effect(){
                if (hasUpgrade('i',23)) return decimalOne
                let exp = new Decimal(2)
                if (hasUpgrade('i',21)) exp = exp.add(upgradeEffect('i',21))
                return exp
            },
            effectDisplay(){
                if(hasUpgrade('i',23)) return "已禁用"
                return '^' + format(upgradeEffect('i',13))
            },
            unlocked(){
                return hasUpgrade('i',12)
            }
        },
        14:{
            title: "I14:点数纠缠",
            description: "纠缠也提升点数获取速度。",
            cost: new Decimal(100),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',13)
            }
        },
        15:{
            title: "I15:时空",
            description: "解锁2个层。",
            cost: new Decimal(500),
            pay(){return},
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',14)
            }
        },
        21:{
            title: "I21:受限纠缠",
            description: "I13效果指数+2。",
            cost(){return (player.s.unlockOrder)?(new Decimal(1e25)):(new Decimal(1e10))},
            effect(){
                return new Decimal(2)
            },
            effectDisplay(){
                return "+" + format(upgradeEffect('i',21))
            },
            unlocked(){
                return hasUpgrade('s',14) || hasUpgrade('i',21)
            }
        },
        22:{
            title: "I22:纠缠组织",
            description: "S13效果指数+1。",
            cost(){return (player.s.unlockOrder)?(new Decimal(1e31)):(new Decimal(1e25))},
            effect(){
                return new Decimal(1)
            },
            effectDisplay(){
                return "+" + format(upgradeEffect('i',22))
            },
            unlocked(){
                return hasUpgrade('s',14) && hasUpgrade('i',21) || hasUpgrade('i',22)
            }
        },
        23:{
            title: "I23:成形纠缠",
            description: "改进纠缠效果公式。禁用I13。",
            cost:new Decimal(3e41),
            effect(){return true},
            unlocked(){
                return hasUpgrade('s',14) && hasUpgrade('i',22) || hasUpgrade('i',23)
            }
        },
        24:{
            title: "I24:时空流形",
            description: "空间和时间层的行为如同首次解锁。",
            cost: new Decimal(1e30),
            effect(){return true},
            onPurchase(){
                player.s.unlockOrder=0
                player.t.unlockOrder=0
                return null
            },
            unlocked(){
                return hasUpgrade('s',15) && hasUpgrade('t',15)
            }
        },
        25:{
            title: "I25:流形成形",
            description: "解锁5个空间升级（S21-S25）。",
            cost: new Decimal(1e50),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',24)
            }
        },
    },
    
})

addLayer("t", {
    name: "时间",
    symbol: "T",
    position: 2,
    startData(){ return {
                unlocked: false,
                points: decimalZero,
                best: decimalZero,
                unlockOrder:0
        }},
    color: "#E145E4", //这个颜色看起来不太对，114514，哼，哼，啊啊啊啊啊
    requires(){return (player.t.unlockOrder)?(new Decimal(2e12)):(new Decimal(200))},
    resource: "时间力量", 
    baseResource: "纠缠", 
    baseAmount() {return player.i.points}, 
    type: "static", 
    exponent(){return (player.t.unlockOrder)?(1.5):(1.4)}, 
    base: 2,
    gainMult() { return new Decimal(1)},
    gainExp() { return new Decimal(1)},
    row: 1, 
    branches: ["i"],
    hotkeys: [
        {key: "t", description: "T: 重置以获取时间力量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription:'形成 ',
    layerShown(){
        return hasUpgrade('i',15) || player.t.unlocked
    },
    increaseUnlockOrder:["s"],
    effect(){
        //影响非自动购买过程
        mult = player.t.best.add(1)

        if(hasUpgrade('t',13)) mult = mult.mul(buyableEffect('t',11))
        return mult
    },
    effectDescription(){
        return "将时间速度提升 x" + layerText("h2", "t", format(tmp.t.effect))
    },
    milestones: {
        0:{
            requirementDescription: "(T0)1时间力量",
            done() { return player.t.points.gte(1) },
            effectDescription: "重置时保留粒子升级和纠缠里程碑。"
        },
        1:{
            requirementDescription: "(T1)3时间力量",
            done() { return player.t.points.gte(3) },
            effectDescription: "时间重置时保留纠缠升级。"
        },
        2:{
            requirementDescription: "(T2)12时间力量",
            done() { return player.t.points.gte(12) },
            effectDescription: "时间可购买物不会减少时间力量。",
            unlocked(){
                return hasUpgrade('t',13) || hasMilestone('t',2)
            }
        },
        3:{
            requirementDescription: "(T3)50时间力量",
            done() { return player.t.points.gte(50) },
            effectDescription: "时间力量不重置任何内容，并且你可以购买最大值。",
            unlocked(){
                return hasUpgrade('i',24) || hasMilestone('t',3)
            }
        }
    },
    canBuyMax(){ return hasMilestone('t',3)},
    resetsNothing(){ return hasMilestone('t',3)},
    doReset(resettingLayer) {
        let keep = []
        //此层直到很晚才重置
        if (layers[resettingLayer].row >= 5) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 1,
        cols: 5,
        11:{
            title: "T11:粒子流动",
            description: "自动生成粒子。",
            cost: new Decimal(1),
            effect(){return true},
        },
        12:{
            title: "T12:纠缠流动",
            description: "自动生成纠缠。",
            cost: new Decimal(2),
            effect(){return true},
            unlocked(){
                return hasUpgrade('t',11)
            }
        },
        13:{
            title: "T13:时间增强",
            description: "解锁一个可购买物以提升时间速度。",
            cost: new Decimal(5),
            effect(){return true},
            unlocked(){
                return hasUpgrade('t',12)
            }
        },
        14:{
            title: "T14:增强提升",
            description: "解锁另一个可购买物以提升上一个可购买物。",
            cost: new Decimal(9),
            effect(){return true},
            unlocked(){
                return hasUpgrade('t',13)
            }
        },
        15:{
            title: "T15:时间流形",
            description: "时空流形的一部分。",
            cost: new Decimal(17),
            effect(){return true},
            unlocked(){
                return hasUpgrade('t',14)
            }
        },
    },
    buyables: {
        rows: 1,
        cols: 3,
        11:{
            title: "时间增强器",
            cost(x=player.t.buyables[11]) { // 购买第x个可购买物的成本，如果有多种货币可以是对象
                let cost = Decimal.pow(1.4,x).ceil().add(2)
                return cost
            },
            base() { 
                let base = new Decimal(2)
                if(hasUpgrade('t',14)) base = base.add(tmp.t.buyables[12].effect)
                return base
            },
            effect() { // 拥有x个物品的效果，x是一个十进制数
                if(!hasUpgrade('t',12)) return decimalOne
                let x = getBuyableAmount('t',11)
                let base = tmp.t.buyables[11].base
                return Decimal.pow(base, x);
            },
            display() { // 在可购买按钮中显示的其他内容
                if (player.tab != "t") return 
                return "将时间速度乘以 "+format(this.base())+"。\n\
                成本: " + format(tmp.t.buyables[11].cost)+" 时间力量\n\
                效果: " + format(tmp.t.buyables[11].effect)+"x\n\
                数量: " + formatWhole(getBuyableAmount("t", 11)) 
            },
            unlocked() { return hasUpgrade('t',13) }, 
            canAfford() { return player.t.points.gte(tmp.t.buyables[11].cost)},
            buy() { 
                cost = tmp.t.buyables[11].cost
                if (tmp.t.buyables[11].canAfford) {
                    if(!hasMilestone('t',2)) player.t.points = player.t.points.sub(cost).max(0)
                    player.t.buyables[11] = player.t.buyables[11].add(1).max(1)
                }
            },
        },
        12:{
            title: "增强器提升器",
            cost(x=player.t.buyables[12]) { // 购买第x个可购买物的成本，如果有多种货币可以是对象
                let cost = Decimal.pow(1.6,x).mul(4).ceil().add(4)
                return cost
            },
            base() { 
                let base = new Decimal(1)
                return base
            },
            effect() { // 拥有x个物品的效果，x是一个十进制数
                if(!hasUpgrade('t',14)) return decimalZero
                let x = getBuyableAmount('t',12)
                let base = tmp.t.buyables[12].base
                return base.mul(x);
            },
            display() { // 在可购买按钮中显示的其他内容
                if (player.tab != "t") return 
                return "将上一个可购买物的基数增加 "+format(this.base())+"。\n\
                成本: " + format(tmp.t.buyables[12].cost)+" 时间力量\n\
                效果: +" + format(tmp.t.buyables[12].effect)+"\n\
                数量: " + formatWhole(getBuyableAmount("t", 12)) 
            },
            unlocked() { return hasUpgrade('t',14) }, 
            canAfford() { return player.t.points.gte(tmp.t.buyables[12].cost)},
            buy() { 
                cost = tmp.t.buyables[12].cost
                if (tmp.t.buyables[12].canAfford) {
                    if(!hasMilestone('t',2)) player.t.points = player.t.points.sub(cost).max(0)
                    player.t.buyables[12] = player.t.buyables[12].add(1).max(1)
                }
            },
        },
    }
})

addLayer("s", {
    name: "空间",
    symbol: "S",
    position: 0,
    startData(){ return {
                unlocked: false,
                points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                softcapEffect: decimalOne,
                unlockOrder:0
        }},
    color: "#334477",
    requires(){return (player.s.unlockOrder)?(new Decimal(2e12)):(new Decimal(200))},
    resource: "空间", 
    baseResource: "纠缠", 
    baseAmount() {return player.i.points}, 
    type: "normal", 
    exponent: 0.2, 
    gainMult() { 
        mult = new Decimal(1)
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    softcap(){
        //能量和星星提升此值
        let cap = new Decimal(1e30)
        return cap
    },
    softcapPower(){
        //维度提升此值，稍后解锁
        let dim = new Decimal(3)
        return decimalOne.div(dim)
    },
    //softcapEffect: new decimal(1),
    getResetGain(){
        gain = player.i.points.pow(0.2)
        if (gain.gt(tmp.s.softcap)){
            softcapEffect = gain.log(tmp.s.softcap).pow(tmp.s.softcapPower)
            player.s.softcapEffect = softcapEffect
            gain = gain.root(softcapEffect)
        }else{
            player.s.softcapEffect = decimalOne
        }
        return gain
    },
    row: 1, 
    branches: ["i"],
    hotkeys: [
        {key: "s", description: "S: 重置以获取空间", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription:'构建 ',
    layerShown(){
        return hasUpgrade('i',15) || player.s.unlocked
    },
    increaseUnlockOrder:["t"],
    effect(){
        if(!hasUpgrade('s',11)) return decimalOne
        if(hasUpgrade('s',24)){
            mult = player.s.best.add(1)
            exp = new Decimal(0.9)
        }else{
            mult = player.s.best.add(1).log2().mul(2).add(1)
            exp = new Decimal(2)
            if(hasUpgrade('s',13)) exp = exp.mul(upgradeEffect('s',13))
        }
        return mult.pow(exp)
    },
    effectDescription(){
        if(!hasUpgrade('s',11)) return "没有效果。"
        return "将纠缠和点数获取速度提升 x" + layerText("h2", "s", format(tmp.s.effect))
    },
    milestones: {
        0:{
            requirementDescription: "(S0)3次总空间",
            done() { return player.s.total.gte(3) },
            effectDescription: "空间重置时保留粒子升级和纠缠里程碑。"
        },
        1:{
            requirementDescription: "(S1)50次总空间",
            done() { return player.s.total.gte(50) },
            effectDescription: "空间重置时保留纠缠升级。"
        }
    },
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 2,
        cols: 5,
        11:{
            title: "S11:空间管理",
            description: "最佳空间提升点数和纠缠。",
            cost: new Decimal(1),
            effect(){return true},
        },
        12:{
            title: "S12:粒子容器",
            description: "解锁5个更多粒子升级（P21-P25）。",
            cost: new Decimal(5),
            effect(){return true},
            unlocked(){
                return hasUpgrade('s',11)
            }
        },
        13:{
            title: "S13:空间组织",
            description: "组织空间以将空间效果提升^2。",
            cost: new Decimal(15),
            effect(){
                if(hasUpgrade('s',24)) return decimalOne
                exp = new Decimal(2)
                if(hasUpgrade('i',22)) exp = exp.add(upgradeEffect('i',22))
                return exp
            },
            effectDisplay(){
                if(hasUpgrade('s',24)) return "已禁用"
                return '^' + format(upgradeEffect('s',13))
            },
            unlocked(){
                return hasUpgrade('s',12)
            }
        },
        14:{
            title: "S14:纠缠背景",
            description: "解锁3个更多纠缠升级（I21-I23）。",
            cost: new Decimal(100),
            effect(){return true},
            unlocked(){
                return hasUpgrade('s',13)
            }
        },
        15:{
            title: "S15:空间流形",
            description: "时空流形的一部分。",
            cost: new Decimal(20000),
            effect(){return true},
            unlocked(){
                return hasUpgrade('s',14)
            }
        },
        21:{
            title: "S21:纠缠精细成形",
            description: "进一步改进I23。",
            cost: new Decimal(1e10),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',25) || hasUpgrade('s',21)
            }
        },
        22:{
            title: "S22:粒子精细成形",
            description: "进一步改进P22。",
            cost: new Decimal(1e11),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',25) && hasUpgrade('s',21) || hasUpgrade('s',22)
            }
        },
        23:{
            title: "S23:点数精细成形",
            description: "进一步改进P25。",
            cost: new Decimal(1e14),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',25) && hasUpgrade('s',22) || hasUpgrade('s',23)
            }
        },
        24:{
            title: "S24:空间成形",
            description: "改进S11公式。禁用S13。",
            cost: new Decimal(1e17),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',25) && hasUpgrade('s',23) || hasUpgrade('s',24)
            }
        },
        25:{
            title: "S25:纠缠精确成形",
            description: "进一步改进I23。",
            cost: new Decimal(1e23),
            effect(){return true},
            unlocked(){
                return hasUpgrade('i',25) && hasUpgrade('s',24) || hasUpgrade('s',25)
            }
        },
    },
    tabFormat: {
        "主界面":{content:[
            "main-display",
            "prestige-button",
            "blank",
            "resource-display",
            "milestones",
            "upgrades"
        ]},
        "重力":{content:[
            "main-display",
            "prestige-button",
            "blank","blank",
            ["display-text",function(){return "\
                空间获取超过 " + layerText("h2", "t", format(tmp.s.softcap)) + " 时，\
                获取指数变为 " + layerText("h2", "t", format(decimalOne.sub(tmp.s.softcapPower))) + "。\n\n\
                这将你的当前空间获取变为原来的 " + layerText("h2", "t", format(player.s.softcapEffect)) + "次方根。"
            }]
        ],
        unlocked(){return hasAch(22)}
        },
    },
})


addLayer("m", {
    name: "质量",
    symbol: "M",
    position: 0,
    startData(){ return {
                unlocked: false,
                points: decimalZero,
                best: decimalZero,
                total: decimalZero
        }},
    color: "#554422",
    requires: new Decimal(1e32),
    resource: "质量", 
    baseResource: "空间", 
    baseAmount() {return player.s.points}, 
    type: "normal", 
    exponent: 0.05, 
    gainMult() { 
        mult = new Decimal(1)
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    row: 2, 
    branches: ["i","s"],
    hotkeys: [
        //{key: "m", description: "M: 重置以获取质量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription:'凝聚 ',
    layerShown(){
        return hasAch(22) || player.m.unlocked
    },
    increaseUnlockOrder:["t"],
    effect(){
        if(!hasUpgrade('m',11)) return decimalOne
        mult = player.m.best.add(1).pow(5)
        return mult
    },
    effectDescription(){
        if(!hasUpgrade('m',11)) return "没有效果。"
        return "将???获取速度提升 x" + layerText("h2", "m", format(tmp.s.effect))
    },
    milestones: {
        0:{
            requirementDescription: "(M0)114514总质量",
            done() { return false },
            effectDescription: "保留1919810。"
        }
    },
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 2,
        cols: 5,
        11:{
            title: "S11:质量影响",
            description: "最佳质量提升???。",
            cost: new Decimal(1),
            effect(){return true},
        },
    },
})