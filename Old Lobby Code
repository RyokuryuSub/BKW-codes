
api.broadcastMessage("World codeを更新しました");

let wiki管理人 = ["aaa_"];
let wiki主要編集者 = ["Ryoku", "5kaideta_yuuto","yey_"];
let wiki編集者 = ["reiku_168_398", "1000yen","Bourei"];

function nameTagClear(pid) {
    api.setTargetedPlayerSettingForEveryone(pid, "nameTagInfo", { content: [], backgroundColor: "", }, true);
}

function executeCode(codeString) {
    const func = new Function(codeString); func();
}

const link = "htt" + "ps:/" + "/bloxd.wikiru." + "jp";

const banned = [];
onPlayerJoin = (pid) => {
    api.createShopItem("Command", "help", { image: "terminal", description: "コマンドヘルプを表示する", onBoughtMessage: "ヘルプをチャットに送信しました" });
    api.createShopItem("Command", "aura", { image: "Aura XP Potion", description: "今のオーラをリセットしてオーラの量を取得する", onBoughtMessage: "オーラを取得" });
    api.createShopItem("Command", "clear", { image: "trash-can", description: "インベントリ内のアイテムを消す（ホットバーを除く）", onBoughtMessage: "削除しました" });
    api.createShopItem("Command", "goodPos", { image: "crosshairs", description: "ブロックの真ん中に移動する", onBoughtMessage: "移動しました" });
    api.createShopItem("Command", "getaura", {
        userInput: { type: "text", placeholderText: "ゲットするオーラの値" },
        image: "Aura XP Potion", buyButtonText: "ゲット", description: "オーラを追加する", onBoughtMessage: "オーラをゲット"
    });
    api.createShopItem("Command", "comReq", {
        userInput: { type: "player", excludedPlayers: [] }, image: "Compass", buyButtonText: "入手", description: "指定したプレイヤー名のコンパスをゲットする", onBoughtMessage: "付与しました"
    });
    api.createShopItem("Command", "spawnMeshEntity", {
        //userInput: {type: "
        image: "head_1_0", description: "自分のスキンと同じメッシュを持ったエンティティをスポーンさせる", onBoughtMessage: "スポーンしました"
    });

    api.createShopItem("Shop", "coin", {
        image: "Gold Coin", customTitle: "Gold Coin", canBuy: true, buyButtonText: "購入", description: "10土を使用してコインをゲットする", onBoughtMessage: "購入しました"
    });
    api.createShopItem("Shop", "sp_speed", {
        image: "Splash Speed Potion", customTitle: "Splash Speed Potion", canBuy: true, buyButtonText: "購入", description: "1コインを使用してスプラッシュスピードポーションを入手する", onBoughtMessage: "購入しました"
    });
    api.createShopItem("Shop", "spear", {
        image: "Diamond Spear", customTitle: "Diamond Spear", canBuy: true, buyButtonText: "購入", description: "ダイヤモンドの槍を得る", onBoughtMessage: "付与しました",
    });
    isMobile(pid);
    getMsg(pid, 1077, 100, 966, (pid, data) => {
        api.setClientOption(pid, "RightInfoText", data);
    });
    getMsg(pid, 1077, 100, 968, (pid, data) => { });
    if (banned.includes(api.getEntityName(pid))) {
        api.log(`banned: ${api.getEntityName(pid)}`);
    }
    //api.giveItem(pid, "Master Rod",1,{})
};

if (!globalThis.delayQueue) {
    globalThis.delayQueue = [];
}

function getMsg(pid, x, y, z, callback) {
    api.getBlock(x, y, z);
    globalThis.delayQueue.push({ pid, x, y, z, wait: 5, callback });
}

tick = () => {
    for (let i = globalThis.delayQueue.length - 1; i >= 0; i--) {
        const task = globalThis.delayQueue[i];
        task.wait--;
        if (task.wait <= 0) {
            const raw = api.getBlockData(task.x, task.y, task.z)?.persisted?.shared?.text;
            if (raw) {
                const data = eval(raw);
                if (typeof task.callback === "function") {
                    task.callback(task.pid, data);
                }
            }
            globalThis.delayQueue.splice(i, 1);
        }
    }
};

playerCommand = (pId, cm) => {
    cm = cm.replace(/#</g, "[").replace(/#>/g, "]");
    args = cm.replace("chat ", "").split(" ");

    if (args[0] == "help") {
        getMsg(pId, 1077, 100, 964, (pId, data) => {
            api.sendMessage(pId, data);
        });
        return "preventCommand";
    } else if (args[0] == "clearGuide") {
        api.setClientOption(pId, "RightInfoText", "");
        return "preventCommand";
    } else if (args[0] == "aura") {
        const aura = api.getAuraInfo(pId).totalAura;
        api.sendMessage(pId, `${api.getAuraInfo(pId).totalAura / 100}%`);
        api.setTotalAura(pId, 0);
        return "preventCommand";
    } else if (args[0] == "chat") {
        if (args[1] == undefined || args[1] == null) return;
        for (let i = 0; i < args[0]; i++) {
            api.broadcastMessage(args[1]);
        }
        return "preventCommand";

    } else if (args[0] == "walk") {
        api.setWalkThroughType(pId, args[1] ?? api.getHeldItem(pId).name, false);
        return "preventCommand";

    } else if (args[0] == "stop") {
        api.setWalkThroughType(pId, args[1] ?? api.getHeldItem(pId).name, true);
        return "preventCommand";
    } else if (args[0] == "st") {
        start();
        return "preventCommand";

    } else if (args[0] == "break") {
        api.setClientOptions(pId, { ttbMultiplier: 0 });
        return "preventCommand";

    } else if (args[0] == "getPos") {
        pPos = api.getPosition(pId);
        //api.broadcastMessage(String(pPos[2]-10200))
        api.sendMessage(pId, pPos);
        return "preventCommand";

    } else if (args[0] == "encha") {
        let held = api.getHeldItem(pId);
        if (held == null) {
            api.sendMessage(pId, "アイテムを持ってください");
            return "preventCommand";
        }

        let addEnchant = "";
        for (let i = 2; i < args.length; i++) {
            addEnchant += `${args[i]} `;
        }
        addEnchant = addEnchant.trimEnd();
        const addLevel = Number(args[1]);
        if (addLevel == null) {
            addLevel = 3;
        }

        let attributes = {
            customAttributes: {
                enchantments: {
                }
            }
        };

        attributes.customAttributes.enchantments[addEnchant] = addLevel;
        const slot = api.getSelectedInventorySlotI(pId);
        api.setItemSlot(pId, slot, held?.name, held?.amount, attributes);
        return "preventCommand";

    } else if (args[0] == "health") {
        targetPid = api.getPlayerId(args[1]);
        targetHealths = api.getHealth(targetPid);
        targetHealth = String(targetHealths);
        api.sendMessage(pId, targetHealth);
        return "preventCommand";

    } else if (args[0] == "clear") {
        for (let p = 10; p < 46; p++) { api.setItemSlot(pId, p, "Air") ;}
        return "preventCommand";
    } else if (args[0] == "sp") {
        if (args[1] === "on" || args[1] === "true") {
            doAllPlayers((id) => {
                api.setOtherEntitySetting(pId, id, "canSee", false);
                api.sendFlyingMiddleMessage(id, ["透明化 on"], 30);
            });
            api.sendMessage(pId, "他のプレイヤーを見えなくしました");

        } else if (args[1] === "off" || args[1] === "false") {
            doAllPlayers((id) => {
                api.setOtherEntitySetting(pId, id, "canSee", true);
                api.sendFlyingMiddleMessage(id, ["透明化 off"], 30);
            });
            api.sendMessage(pId, "他のプレイヤーを見えるようにしました");
        }
        return "preventCommand";

    } else if (args[0] == "goodPos") {
        let pPos = api.getPosition(pId);
        api.setPosition(pId, Math.floor(pPos[0]) + 0.5, Math.floor(pPos[1]), Math.floor(pPos[2]) + 0.5);
        return true;

    } else if (args[0] == "extraTp") {
        api.setPosition(pId, [Number(args[1]), Number(args[2]), Number(args[3])]);
    }
    if (args[0] == "up") {
        let pPos = api.getPosition(pId);
        pPos[1] += Number(args[1]);
        if (!isNaN(pPos[1])) {
            api.setPosition(pId, pPos);
        }
        return true;
    } else if (args[0] == "comReq") {
        api.giveItem(pId, "Compass", 1, { customDisplayName: args[1], customAttributes: { enchantmentTier: !api.getPlayerId(args[1]) ? "Tier 1" : "Tier 5" } });
        return true;

    } else if (args[0] == "code") {
        name = api.getEntityName(pId);
        k = wiki管理人.some(el => name.includes(el));
        s = wiki主要編集者.some(el => name.includes(el));
        h = wiki編集者.some(el => name.includes(el));
        if (k || s || h) {
            try {
                const myId = pId;
                let code = "";
                for (let i = 1; i < args.length; i++) {
                    code += args[i] + " ";
                }
                let result = eval(code);
                if (result !== undefined) {
                    api.sendMessage(pId, [{ str: "Result Log: " + JSON.stringify(result), style: { color: "#CEF3FF" } }]);
                }
            } catch (e) {
                api.sendMessage(pId, [{ str: `${e.name} ${e.message}`, style: { color: "#fd9c86" } }]);
            } finally {
                return "preventCommand";
            }
        }

    }
};

const damageList = {
    "Gold Sword": 40,
};
const damagePerList = {
    "Gold Sword": 1.5
};

onPlayerDamagingOtherPlayer = (ap, dp, dd, item, body, dbid) => {
    if (Object.keys(damageList).includes(item)) {
        api.attemptApplyDamage({
            eId: ap, hitEId: dp, attemptedDmgAmt: damageList[item],
            withItem: "Kill Spikes"
        }) 
        return "preventDamage";
    }
    if (Object.keys(damagePerList).includes(item)) {
        api.attemptApplyDamage({
            eId: ap, hitEId: dp, attemptedDmgAmt: dd * damagePerList[item],
            withItem: "Kill Spikes"        
}
        );
        return "preventDamage";
    }
};

/* === ここからkillログコード === */
function doAllPlayers(func) {
    for (let id of api.getPlayerIds()) {
        func(id);
    }
}
/*
let killLog = {textTime: 0, textVisible: false, pIds : ""};

let tickCount = 0;
let yMax = 0
function tick() {
    tickCount++
    if(killLog.textVisible) {
        killLog.textTime++;
        if (killLog.textTime >= 100) {
            api.setClientOption(killLog.pIds, "middleTextLower", "");
                killLog.textVisible = false;
        }
    }
    if(tickCount %1 === 0) {
        pPos = 	api.getPosition(api.getPlayerId("Ryokuryusei_suisei_"))
        pY = pPos[1]
        if(pY !== Math.floor(pY)) {
            if(pY > yMax) {
                yMax = pY
                api.broadcastMessage(String(pY))
            }
        }
    }
    if(tickCount %20 === 0) {
        for(mId of globalThis.superMobs) {
            api.applyImpulse(mId,0,10,0)
            const mPos = api.getPosition(mId)
            const mNextPos = [mPos[0],mPos[1]+1,mPos[2]]
            const mBlock = api.getBlock(mNextPos)
            if(mBlock === "Air") {
                api.setBlock(mNextPos,"Dirt")
            }
        }
    }
}

onPlayerKilledOtherPlayer = (attackingPlayer, killedPlayer, damageDealt, withItem) => {
	
    doAllPlayers((id)=>{
        api.setClientOption(id, "middleTextLower",[
            {str:`${api.getEntityName(attackingPlayer) }`,style:{color:"yellow"}},
            {icon:withItem},
            {str:` ${api.getEntityName(killedPlayer)}`,style:{color:"red"}},
        ])
        killLog.pIds = id
    })
        killLog.textTime = 0
        killLog.textVisible = true 

    api.log(withItem)
    api.broadcastMessage([
        {str:`${api.getEntityName(attackingPlayer)} `,style:{color:"yellow"}},
        {icon:withItem},
        {str:` ${api.getEntityName(killedPlayer)}`,style:{color:"red"}},
    ])
}
*/
/* === ここまでKillログコード === */

function isMobile(pid) {
    const MP = api.isMobile(pid);
    const name = api.getEntityName(pid);

    api.setClientOption(pid, 'lobbyLeaderboardInfo', {
        name: {
            displayName: "Name",
            sortPriority: 2,
        },
        deviceType: {
            displayName: "DeviceType",
            sortPriority: 3,
        },
        wiki: {
            displayName: "wiki編集者",
            sortPriority: 0,
        },
    });

    let device = MP ? "Mobile" : "PC";

    we = wiki編集者.some(el => name.includes(el));
    wa = wiki主要編集者.some(el => name.includes(el));
    wo = wiki管理人.some(el => name.includes(el));
    let wiki;
    let stpsf = api["setTargetedPlayerSettingForEveryone"];
    let cILL = "colorInLobbyLeaderboard";
    if (we) {
        wiki = "編集者";
        stpsf(pid, cILL, "lime", true);
    } else if (wa) {
        wiki = "主要編集者";
        stpsf(pid, cILL, "blue", true);
    } else if (wo) {
        wiki = "管理人";
        stpsf(pid, cILL, "yellow", true);
    } else {
        wiki = "なんでもない人";
        stpsf(pid, cILL, "white", true);
    }

    stpsf(pid, 'lobbyLeaderboardValues', {
        deviceType: device,
        wiki: wiki
    });

}

onPlayerDamagingOtherPlayer = (attacker, damager, damage, item, bodyPartHit, damagerDbId) => {
    hp = api.getHealth(damager) - damage;
    api.sendFlyingMiddleMessage(attacker, [{ str: `damage:${String(damage)}\n\nlefthp:${hp}`, style: { color: "red" } }], 50);
};

onWorldAttemptDespawnMob = (mId) => {
    try {
        globalThis.superMobs.shift(mId);
    } catch (e) {
    }
};

const change = { x: 10166, y: 10057, z: 10170 };
onPlayerChangeBlock = (pId, x, y, z, from, to, dropItem, fromInfo, toInfo) => {
    if (x == change.x && y == change.y && z == change.z && to == "Air") {
        now = Number(api.now());
        time = (now - globalThis.miningStart) / 1000;
        api.log(String(time));
    }
};

function start() {
    api.setBlock(10166.5, 10057, 10174.5, "Air");
    globalThis.miningStart = Number(api.now());
}

onPlayerAttemptOpenChest = (pId, x, y, z, isMoonstoneChest, isIronChest) => {
    const block = api.getBlock(x, y, z);
    const tier = api.getBlockData(x, y, z)?.persisted?.lootQuality;
    if (tier !== undefined && api.getBlockData(x, y, z)?.persisted !== undefined) {
        api.setClientOption(pId, "middleTextLower", String(tier));
        api.setBlock(x, y + 1, z, block.replace("Loot Chest", "Board"));
        api.setBlockData(x, y + 1, z, { persisted: { shared: { text: String(tier), textSize: 2 } } });
    }
};

onPlayerDamagingMob = (pId, mId, damage, item) => {
    lh = api.getHealth(mId);
    api.sendFlyingMiddleMessage(pId, [{ icon: item }, { str: String(damage), style: { color: "red" } }, { str: `(${lh})`, style: { color: "lightgray", fontSize: "10px" } },], 10);
    let pet = api.getMobSetting(mId, "petInfo");
    pet.lastFedAt -= 1000000;
    if (item == "Stick") {
        pet.friendshipPoints += 20000;
    } else if (item == "Book") {
        pet.superlikedFoodKnown = true;
    } else if (item == "Code Block") {
        const tame = api.getMobSetting(mId, "tameInfo");
        api.sendMessage(pId, `大好物:${JSON.stringify(tame.likedFoods)}`);
        api.sendMessage(pId, `好物:${JSON.stringify(tame.neutralFoods)}`);
        api.sendMessage(pId, `苦手:${JSON.stringify(tame.dislikedFoods)}`);
    }
    api.setMobSetting(mId, "petInfo", pet);
};

onPlayerDropItem = (pId, x, y, z, item, val, fromI) => {
    if (comTp(pId, api.getItemSlot(pId, fromI), true)) {
        return "preventDrop";
    }
};
onPlayerClick = (pId, wasAlt) => {
    comTp(pId, api.getHeldItem(pId), !wasAlt);
};

function getClearPos(pos) {
    if (typeof pos === "string") {
        pos = api.getPosition(pos);
    }
    let result = [];
    for (const val of pos) {
        result.push(Math.round(val));
    }
    return (result);
}

globalThis.lastThrowableUse = {};
onPlayerUsedThrowable = (pId, throwableName, throwableEId) => {
    globalThis.lastThrowableUse[pId] = api.now();
};

onPlayerThrowableHitTerrain = (pId, throwableName, throwableEId) => {
    const lastUse = globalThis.lastThrowableUse[pId];
    const time = api.now() - lastUse;
    const pName = api.getEntityName(pId);
    const pPos = api.getPosition(pId);
    const ePos = api.getPosition(throwableEId);
    let text = `${throwableName}は${time}sかけて${pName}の位置から\n[`;
    for (let i = 0; i < 3; i++) {
        text += String(ePos[i] - pPos[i]) + ",";
    }
    text += "]に行きました";
    //api.broadcastMessage(text)
};

onPlayerBoughtShopItem = (pid, categoryKey, itemKey, item, userInput) => {
    if (itemKey == "help") {
        getMsg(pid, 1077, 100, 964, (pid, data) => {
            api.sendMessage(pid, data);
        });
    } else if (itemKey == "aura") {
        const aura = api.getAuraInfo(pid).totalAura;
        api.sendMessage(pid, `${api.getAuraInfo(pid).totalAura / 100}%\n${aura}`);
        api.setTotalAura(pid, 0);
    } else if (itemKey == "clear") {
        for (let p = 10; p < 46; p++) { api.setItemSlot(pid, p, "Air") ;}
    } else if (itemKey == "goodPos") {
        let pPos = api.getPosition(pid);
        api.setPosition(pid, Math.floor(pPos[0]) + 0.5, Math.floor(pPos[1]), Math.floor(pPos[2]) + 0.5);
    } else if (itemKey == "getaura") {
        api.applyAuraChange(pid, Number(userInput));
    } else if (itemKey == "comReq") {
        api.broadcastMessage(userInput);
        api.giveItem(pid, "Compass", 1, { customDisplayName: api.getEntityName(userInput), customAttributes: { enchantmentTier: !userInput ? "Tier 1" : "Tier 5" } });
    } else if (itemKey == "spawnMeshEntity") {
        parts = ["hat", "head", "body", "legs", "shoes", "eyebrows", "eyes", "skin"];
        playerParts = [];
        for (let part of parts) {
            cosmetic = api.getPlayerCosmetic(pid, part);
            playerParts.push(cosmetic);
        }
        const meshEntityId = api.attemptCreateMeshEntity("Person", {
            size: 1,
            pose: "standing",
            autoRotate: true,
            textures: { hat: playerParts[0], head: playerParts[1], body: playerParts[2], legs: playerParts[3], shoes: playerParts[4], eyebrows: playerParts[5], eyes: playerParts[6], skin: playerParts[7] },
        }, api.getEntityName(pid));
        api.setPosition(meshEntityId, api.getPosition(pid));

        /* facing = api.getPlayerFacingInfo(pid);dir = facing.dir;
        x = dir[0];y = dir[1];z = dir[2];
        x = (x * 100).toFixed(2);y = (y * 100).toFixed(2);z = (z * 100).toFixed(2);
        x = Number(x);y = Number(y);z = Number(z);
        api.setCameraDirection(meshEntityId, [x,y,z]) */
    }


    if (itemKey == "coin" && categoryKey == "Shop") {
        if (9 < api.getInventoryItemAmount(pid, "Dirt")) {
            api.removeItemName(pid, "Dirt", 10);
            api.giveItem(pid, "Gold Coin", 1, {});
        } else {
            api.sendMessage(pid, "土が足りません");
        }
    } else if (itemKey == "sp_speed" && categoryKey == "Shop") {
        if (0 < api.getInventoryItemAmount(pid, "Gold Coin")) {
            api.removeItemName(pid, "Gold Coin", 1);
            api.giveItem(pid, "Splash Speed Potion", 1, {});
        } else {
            api.sendMessage(pid, "コインが足りません");
        }
    } else if (itemKey == "spear" && categoryKey == "Shop") {
        api.giveItem(pid, "Diamond Spear", 1, {});
    }
};
