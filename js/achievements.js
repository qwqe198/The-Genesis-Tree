addLayer("a",{
    name: "成就",
    symbol: "A",
    position: 2,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip: "成就",
    color: "#FFFF00",
    resource: "成就点数",
    type: "none",
    row: "side",
    achievements: {
        rows: 5,
        cols: 6,
        11: {
            name: "开始",
            tooltip: "通过粒子开始生成点数。",
            done() {
                return hasUpgrade('p',11)
            },
        },
        12: {
            name: "粒子的力量",
            tooltip: "通过粒子进一步增加点数生成。",
            done() {
                return hasUpgrade('p',12)
            },
        },
        13: {
            name: "相互作用",
            tooltip: "将粒子纠缠成相互作用。",
            done() {
                return player.i.unlocked
            },
        },
        14: {
            name: "时空",
            tooltip: "解锁空间或时间。",
            done() {
                return player.s.unlocked || player.t.unlocked
            },
        },
        15: {
            name: "时空连续体",
            tooltip: "同时解锁空间和时间。",
            done() {
                return player.s.unlocked && player.t.unlocked
            },
        },
        16: {
            name: "协调",
            tooltip: "构建时空流形。",
            done() {
                return hasUpgrade('i',24)
            },
        },
        21: {
            name: "成形",
            tooltip: "塑造P、I、S的层级效果和点数协同。",
            done() {
                return hasUpgrade('p',25) && hasUpgrade('i',23) && hasUpgrade('s',24)
            },
        },
        22: {
            name: "重力",
            tooltip: "达到1e30空间并被重力软上限限制。奖励：解锁一个标签页。",
            done() {
                return player.s.points.gte(1e30)
            },
        },
    },
    tabFormat: [
        "blank","blank","blank",
        "achievements"
    ],
})