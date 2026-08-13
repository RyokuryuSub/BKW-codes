api.broadcastMessage("World codeを更新しました");

function executeCode(codeString) {
    const func = new Function(codeString); func();
}

const link = "htt" + "ps:/" + "/bloxd.wikiru." + "jp";
const customRightInfoText = [
    {str:"Bloxd攻略 Wiki\n\t\t\t\t撮影用広場\n",style:{color:"lime",fontSize:"20px"}},
    {str:"--------------------------------\n"},
    {str:"Basic Info\n",style:{color:"gold"}},
    {str:"・"},{icon:"fa-solid fa-globe",style:{color:"blue"}},{str:" Wikiru\n"},
    {str:`\t${link}\n`},
    {str:"・"},{icon:"youtube",style:{color:"red"}},{str:" YoutubeCh\n"},
    {str:"\t@Bloxd攻略Wiki動画用ch\n"},
    {str:"・"},{icon:"fa-solid fa-hammer",style:{color:"purple"}},{str:" 地形破壊禁止\n"},
    {str:"New Things\n",style:{color:"gold"}},
    //{str:"・Rodをもって右クリック!\n"},
    {str:"・[Coder向け] getMsg関数\n"},
    {str:"・[試験的] ショップメニュー\n\tCommandタブ\n\tspawnMeshEnt" + "ity\n"},
    {str:"Previous New Things\n",style:{color:"gold"}},
    {str:"・/helpコマンド\n"},
    {str:"・コンパスのtp機能\n"}
];
const wikiPositions = [
    {
        name:"wiki管理人",
        color:"lime",
        level:3,
        pDbIds:[
            "h3UneKWxIbhyJNmqWZR2q",//aaa_
        ]
    },
    {
        name:"wiki主要編集者",
        color:"blue",
        level:2,
        pDbIds:[
            "Vqkj12sBFK_2wpcaFcWGz", //Ryokuryusei_
            //Bourei
            //1000yen
            //Zombiekun
            "CQnbbdHCm0azGbxQhIAe5"//yuuto
        ]
    },
    {
        name:"wiki編集者",
        color:"yellow",
        level:1,
        pDbIds:[
            //reiku
            "-rNnqMMTdKschR4LkpCja"//yey
        ]
    },
    {
        name:"閲覧者",
        color:"white",
        level:0,
        pDbIds:[]
    }
]
const customlobbyLeaderboardInfo = {
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
    }
};
const customCms = {
    customhelp:{
        settings:{
            image: "fa-solid fa-circle-info",
            description: "コマンドヘルプを表示する",
            onBoughtMessage: "ヘルプをチャットに送信しました",
            buyButtonText: "送信"
        },
        code:function(pId){
            let text = "現在実装されているコマンド一覧\n";
            for(let customCm in customCms) {
                let cm = customCms[customCm];
                text += `・/${customCm}\n`;
                text += `\t${cm.settings.description.replace("\n","\n\t")}\n`
            }
            api.sendMessage(pId,[{str:text}])
        }
    },
    toggleShowRightInfo:{
        settings:{
            image:"fa-solid fa-file-lines",
            description:"右の情報表示を切り替え",
            onBoughtMessage:"情報の表示を切り替えました",
            buyButtonText:"変更"
        },
        code:function(pId,toggle){
            toggle ??= api.getClientOption(pId,"RightInfoText")
            api.setClientOption(pId,"RightInfoText",toggle ? "" : customRightInfoText);
        }
    },
    toggleShowDirection:{
        settings:{
            image:"fa-solid fa-arrows",
            description:"X,Z方向を表示",
            onBoughtMessage:"X,Z方向表示を切り替えました",
            buyButtonText:"変更"
        },
        code:function(pId){
            const axisNames = ["X","Y","Z"];
            const sings = [{str:"-",color:"lightblue"},{str:"+",color:"orange"}];
            const pPos = api.getPosition(pId);
            const key = `${pId}_showDirectionArrow`
            
            for(let axisI = 0; axisI<3; axisI+=2) { //0,2
                const axis = axisNames[axisI];
                for(let singI = -1; singI<2; singI+=2) { //-1,1
                    const sing = sings[(singI+1)/2];
                    if(globalThis[key]) {
                        api.clearDirectionArrow(pId,`${axis}${sing.str}`);
                    }else {
                        const arrowPos = [...pPos];
                        arrowPos[axisI] += singI*100;
                        api.setDirectionArrow(pId,`${axis}${sing.str}`,arrowPos,[{str:`${axis}${sing.str}`,style:{color:sing.color,fontSize:"15px"}}]);
                    }
                }
            }
            
            globalThis[key] = globalThis[key] ? false : true;
        }
    },
    clear:{
        settings:{
            image: "trash-can", 
            description: "インベントリ内のアイテムを消す\nホットバーを含めるかをtrue/falseで設定可能", 
            onBoughtMessage: "削除しました",
            buyButtonText: "削除",
            userInput:{type:"dropdown",dropdownOptions:["true","false"]}
        },
        code:function(pId,option){
            for(let i = (JSON.parse(option) ?? false) ? 0 : 10; i < 46; i++) {
                api.setItemSlot(pId, i, "Air");
            }
        }
    },
    aura:{
        settings:{
            image: "Aura XP Potion",
            description: "経験値情報を取得",
            onBoughtMessage: "取得しました",
            buyButtonText: "取得"
        },
        code:function(pId){
            const xpInfos = api.getAuraInfo(pId);
            api.sendMessage(pId,[{icon:"Aura XP Orb"},{str:`${xpInfos.totalAura} (${xpInfos.level}Lv ${xpInfos.totalAura%xpInfos.auraPerLevel}%)`}])
        }
    },
    health:{
        settings:{
            image: "fa-solid fa-heart",
            description:"プレイヤーの体力を取得",
            onBoughtMessage: "取得しました",
            buyButtonText: "取得",
            userInput: {type:"player", excludedPlayers:[]}
        },
        forCm:function(args) {
            const targetPId = api.getPlayerId(args[0]);
            return(targetPId ? [targetPId] : "Error:指定されたプレイヤーが見つかりません")
        },
        code:function(pId,targetPId){
            api.sendMessage(pId,[{str:api.getEntityName(targetPId)},{str:": "},{str:`${api.getHealth(targetPId)}`,style:{color:"pink"}},{icon:"fa-solid fa-heart",style:{color:"red"}}])
        }
    },
    clearPos:{
        settings:{
            image: "crosshairs",
            description: "ブロックの端へ移動する\n0:切り捨て,1:切り上げ,2:四捨五入を設定可能",
            onBoughtMessage: "移動しました",
            buyButtonText: "移動",
            userInput:{type:"dropdown",dropdownOptions:["切り捨て","切り上げ","四捨五入"]}
        },
        forCm:function(arg){
            return(customCms.clearPos.settings.userInput.dropdownOptions[JSON.parse(arg)]);
        },
        code:function(pId,option){
            let position = api.getPosition(pId),
                newPos = [],
                change = {
                    "切り捨て":"floor",
                    "切り上げ":"ceil",
                    "四捨五入":"round"
                };
            position.forEach(pos => {
                newPos.push(Math[change[option]](pos));
            });
            api.setPosition(pId,newPos);
            return(newPos);
        }
    },
    goodPos:{
        settings:{
            image: "crosshairs",
            description: "ブロックの中心へ移動する\n0:切り捨て,1:切り上げ,2:四捨五入を設定可能",
            onBoughtMessage: "移動しました",
            buyButtonText: "移動",            
            userInput:{type:"dropdown",dropdownOptions:["切り捨て","切り上げ","四捨五入"]}
        },
        forCm:function(arg){
            return(customCms.clearPos.settings.userInput.dropdownOptions[JSON.parse(arg)]);
        },
        code:function(pId,option){
            let pos = customCms.clearPos.code(pId,option),
                newPos = [];
            pos.forEach(pos => newPos.push(pos+0.5));
            api.setPosition(pId,newPos);
        }
    },
    walk:{
        settings:{
            image: "fa-solid fa-person-arrow-down-to-line",
            description: "ブロックをすり抜け可能に\n手持ち以外のブロックも指定可能",
            onBoughtMessage: "すり抜け可能になりました",
            buyButtonText: "変更",
            userInput:{type:"text",placeholderText:"blockname"}
        },
        forCm:function(args){
            args.unshift(false)
            return(args);
        },
        forShop:function(userInput){
            userInput.unshift(false)
            return(userInput);
        },
        code:function(pId,toggle,...block){
            let blockName = "";
            block.forEach(piece => {blockName += piece + " ";})
            try {
                api.setWalkThroughType(pId, 
                    (blockName == "") ? api.getHeldItem(pId)?.name ?? "Air" : blockName.trimEnd(),
                toggle);
            }catch (e) {
                return("Error:ブロック名に不備があります")
            }
        }
    },
    stop:{
        settings:{
            image: "fa-solid fa-person-arrow-up-from-line",
            description: "ブロックをすり抜け不可に\n手持ち以外のブロックも指定可能",
            onBoughtMessage: "すり抜け不可になりました",
            buyButtonText: "変更",
            userInput:{type:"text",placeholderText:"blockname"}
        },
        code:function(pId,...block){
            return(customCms.walk.code(pId,true,...block))
        }
    },
    walks:{
        settings:{
            image: "fa-solid fa-door-open",
            description: "ブロックを一括すり抜け可能に\nJS配列[]のみ対応",
            onBoughtMessage: "一括すり抜け可能になりました",
            buyButtonText: "変更",
            userInput:{type:"text",placeholderText:"blocknames"}
        },
        code:function(pId,blockList) {
            JSON.parse(blockList).forEach(block=>{api.setWalkThroughType(pId,block,false);})
        }
    },
    stops:{
        settings:{
            image: "fa-solid fa-door-closed",
            description: "ブロックを一括すり抜け不可に\nJS配列[]のみ対応",
            onBoughtMessage: "一括すり抜け不可になりました",
            buyButtonText: "変更",
            userInput:{type:"text",placeholderText:"blocknames"}
        },
        code:function(pId,blockList) {
            JSON.parse(blockList).forEach(block=>{api.setWalkThroughType(pId,block,true);})
        }
    },
    togglehide:{
        settings:{
            image: "fa-solid fa-eye-slash",
            description: "プレイヤーを表示/非表示",
            onBoughtMessage: "表示を変更しました",
            buyButtonText: "変更",
            userInput:{type:"dropdown",dropdownOptions:["true","false"]}
        },
        code:function(pId,toggle) {
            api.setEveryoneSettingForPlayer(pId,"canSee",JSON.parse(toggle))
        }
    },
    getPos:{
        settings:{
            image: "fa-solid fa-flag",
            description: "プレイヤーの位置を取得\nスパムへの悪用厳禁",
            onBoughtMessage: "位置をチャットに送信しました",
            buyButtonText: "取得",
            userInput: {type:"player", excludedPlayers:[]}
        },
        forCm:function(args) {
            const targetPId = api.getPlayerId(args[0]);
            return(targetPId ? [targetPId] : "Error:指定されたプレイヤーが見つかりません")
        },
        code:function(pId,targetPId) {
            const targetPos = api.getPosition(targetPId),
                  targetName = api.getEntityName(targetPId),
                  posName = ["x","y","z"];
            let msg = [{str:`${targetName}の現在地:\n`}];
            for(let i = 0; i <3; i++) {
                let coord = targetPos[i],
                    coordName = posName[i],
                    intPart = String(Math.floor(coord)),
                    fractionalPart = String(coord-intPart).replace("0.","");
                
                    msg.push({str:intPart,style:{color:"#1E90FF"}},(coord == intPart) ? {str:"\n"} : {str:"."+fractionalPart+"\n",style:{color:"#32CD32"}});                
            }
            api.sendMessage(pId,msg);
        }
    },
    extraHP:{
        settings:{
            image: "fa-solid fa-heart",
            description: "体力を上昇",
            onBoughtMessage: "体力を増やしました",
            buyButtonText: "調整",
            userInput:{type:"dropdown",dropdownOptions:["true","false"]}
        },
        code:function(pId,toggle) {
            let clientOpts = {
                maxHealth:1000000000,
                initialHealth:1000000000,
                healthRegenAmount:1000000000,
            	healthRegenInterval:1,
            	healthRegenStartAfter:0
            };
            if(JSON.parse(toggle)) {
                api.setHealth(pId,1000000000,pId,true);
                api.setClientOptions(pId,clientOpts);
            }else {
                api.setHealth(pId,100);
                for(clientOpt in clientOpts) {
                    api.setClientOptionToDefault(pId,clientOpt);
                }
            }
        }
    },
    extraDamage:{
        settings:{
            image: "fa-solid fa-swords",
            description: "攻撃力を上昇",
            onBoughtMessage: "攻撃力を増やしました",
            buyButtonText: "調整",
            userInput:{type:"dropdown",dropdownOptions:["true","false"]}
        },
        code:function(pId,toggle) {
            api.setClientOption(pId,"dealingDamageMultiplier",JSON.parse(toggle) ? 10869565.2 : 1);
        }
    },
    openMoonstoneChest:{
        settings:{
            image: "Moonstone Chest",
            description: "ムーンストーンチェストを開く\n開かれない場合はもう一度実行してください",
            onBoughtMessage: "開きました",
            buyButtonText: "開く"
        },
        code:function(pId) {
            const moonstoneChestPos = [100,100,100];
            api.openChestForPlayer(pId,...moonstoneChestPos)
        }
    },
    openChest:{
        settings:{
            image: "Chest",
            description: "特定の座標のチェストを開く\n開かれない場合はもう一度実行してください",
            onBoughtMessage: "開きました",
            buyButtonText: "開く",
            userInput:{type:"text",placeholderText:"chestPos"}
        },
        code:function(pId,x,y,z) {
            let pos = z ? [Number(x),Number(y),Number(z)] : JSON.parse("["+x.replace(/[\[\]]/g,"").replace(/ /g, ",")+"]")
            if(pos.includes(NaN)) return("Error:無効な座標です")
            api.openChestForPlayer(pId,...pos);
        }
    },
    moveDirection:{
        settings:{
            image: "fa-solid fa-arrows",
            description: "移動方向の編集(現在X方向)\n/moveと組み合わせて使用",
            onBoughtMessage: "方向を変更しました",
            buyButtonText: "変更",
            userInput:{type:"dropdown",dropdownOptions:["X","Y","Z"]}
        },
        code:function(pId,select) {
            const direction = {X:0,Y:1,Z:2};
            globalThis[`${pId}Direction`] = direction[select];
            api.updateShopItemForPlayer(pId,"Command","move",{description:`現在設定中の${select}方向へ移動\n/moveDirectionと組み合わせて使用`});
            api.updateShopItemForPlayer(pId,"Command","moveDirection",{description:`移動方向の編集(現在${select}方向)\n/moveと組み合わせて使用`})
        }
    },
    move:{
        settings:{
            image: "fa-solid fa-feather-pointed",
            description: "現在設定中のX方向へ移動\n/moveDirectionと組み合わせて使用",
            onBoughtMessage: "移動しました",
            buyButtonText: "移動",
            userInput:{type:"number",placeholderText:"moveAmount"}
        },
        code:function(pId,moveAmt) {
            const pDirection = globalThis?.[`${pId}Direction`] ?? 0;
                  pPos = api.getPosition(pId);
            pPos[pDirection] += Number(moveAmt);
            api.setPosition(pId,pPos);
        }
    },
    extraTp:{
        settings:{
            image: "fa-solid fa-globe",
            description: "指定座標にTP\n/tp posの範囲外も対応",
            onBoughtMessage: "TPしました",
            buyButtonText: "TP",
            userInput:{type:"text",placeholderText:"chestPos"}
        },
        code:function(pId,x,y,z) {
            let pos = z ? [Number(x),Number(y),Number(z)] : JSON.parse("["+x.replace(/[\[\]]/g,"").replace(/ /g, ",")+"]")
            if(pos.includes(NaN)) return("Error:無効な座標です")
            api.setPosition(pId,...pos)
        }
    },
    code:{
        settings:{
            image: "Code Block",
            description: "指定されたコードを実行\n編集者専用",
            onBoughtMessage: "実行しました",
            buyButtonText: "実行",
            userInput:{type:"text",placeholderText:"code"}
        },
        code:function(pId,code) {
            if(customCms.getWikiPosition.code(pId,false).level <2) return("Error:権限が不足しています");
            let result = eval(code);
            if(result) api.sendMessage(pId, [{str:"Result Log: " +JSON.stringify(result), style: { color: "#CEF3FF" } }]);
        }
    },
    encha:{
        settings:{
            image: "Diamond Enchanting Table",
            description: "手に持ってるアイテムにエンチャント\nレベル エンチャント名で指定可能",
            onBoughtMessage: "エンチャントしました",
            buyButtonText: "実施",
            userInput:{type:"text",placeholderText:"enchantOption"}
        },
        forShop:function(userInput) {
            return(userInput[0].replace(/#</g, "[").replace(/#>/g, "]").replace("chat ", "").split(" "));
        },
        code:function(pId,...enchantOpts) {
            let slot = api.getSelectedInventorySlotI(pId),
                held = api.getHeldItem(pId),
                nowEnchant = held?.attributes?.customAttributes?.enchantments ?? {};
                addEnchant = {
                    level:parseFloat(enchantOpts.shift()),
                    name:""
                };
            if(!held) return("Error:手にアイテムがありません");
            enchantOpts.forEach(enchantNamePiece => {addEnchant.name+=enchantNamePiece+" "});
            nowEnchant[addEnchant.name.trimEnd()] = addEnchant.level;
            held.attributes = held?.attributes ? held.attributes : {};
            held.attributes.customAttributes = held.attributes?.customAttributes ? held.attributes.customAttributes : {};
            held.attributes.customAttributes.enchantments = nowEnchant;
            api.setItemSlot(pId,slot,held?.name,held?.amount,held.attributes);
        }
    },
    instantEncha:{
        settings:{
            image: "Wood Enchanting Table",
            description: "/enchaと同様にエンチャント\n元のエンチャントなどの設定を無視します",
            onBoughtMessage: "エンチャントしました",
            buyButtonText: "実施",
            userInput:{type:"text",placeholderText:"enchantOption"}
        },
        forShop:function(userInput) {
            return(userInput[0].replace(/#</g, "[").replace(/#>/g, "]").replace("chat ", "").split(" "));
        },
        code:function(pId,...enchantOpts) {
            let slot = api.getSelectedInventorySlotI(pId),
                held = api.getHeldItem(pId),
                addEnchant = {
                    level:parseFloat(enchantOpts.shift()),
                    name:""
                };
            if(!held) return("Error:手にアイテムがありません");
            enchantOpts.forEach(enchantNamePiece => {addEnchant.name+=enchantNamePiece+" "});
            api.setItemSlot(pId,slot,held?.name,held?.amount,{customAttributes:{enchantments:{[addEnchant.name.trimEnd()]:addEnchant.level}}});
        }
    },
    getWikiPosition:{
		settings:{
			image: "fa-solid fa-lock-open",
			description: "BKWでのロールを確認します",
			onBoughtMessage: "表示しました",
			buyButtonText: "確認"
		},
		code:function(pId,sendMessage=true) {
			const pDbId = api.getPlayerDbId(pId);
			let pWikiPosition = wikiPositions[wikiPositions.length-1];
			wikiPositions.forEach(wikiPosition=>{
				if(wikiPosition.pDbIds.includes(pDbId)) pWikiPosition = wikiPosition;
			});
			if(sendMessage) api.sendMessage(pId,[{str:"あなたのBKWでのロール: "},{str:pWikiPosition.name,style:{color:pWikiPosition.color}}]);
            return(pWikiPosition);
		}
	}
};

onPlayerJoin = (pId) => {
    for(let customCm in customCms) {
        api.createShopItem("Command",customCm,customCms[customCm].settings)
    }
    const wikiPosition = customCms.getWikiPosition.code(pId,false);
    api.setClientOption(pId, 'lobbyLeaderboardInfo', customlobbyLeaderboardInfo);
    api.setTargetedPlayerSettingForEveryone(pId,"lobbyLeaderboardValues",{
        deviceType: api.isMobile(pId) ? "Mobile" : "PC",
        wiki: wikiPosition.name
    },true);
    api.setTargetedPlayerSettingForEveryone(pId,"colorInLobbyLeaderboard",wikiPosition.color,true);
	customCms.toggleShowRightInfo.code(pId,false);
}

function judgeError(pId,check) {
    if(check.includes("Error")) {
        api.sendMessage(pId,check.slice(6));
        return("Error")
    }
}

playerCommand = (pId,cm) => {
    cm = cm.replace(/#</g, "[").replace(/#>/g, "]");
    let args = cm.replace("chat ", "").split(" ");

    const customCm = customCms?.[args[0]];
    if(customCm) {
        args = (customCm?.forCm) ? customCm.forCm(args.slice(1)) : args.slice(1);
        let argsToCode = Array.isArray(args) ? args : [args]
        if(!judgeError(pId,String(argsToCode[0]))) {
            let result = customCm.code(pId, ...argsToCode);
            if(!judgeError(pId,result ?? "safe")) api.sendMessage(pId,customCm.settings.onBoughtMessage);
        }
        return "preventCommand"
    }
}

onPlayerBoughtShopItem = (pId, categoryKey, itemKey, item, userInput) => {
    let customCm = customCms?.[itemKey];
    if(customCm) {
        userInput = (customCm?.forShop) ? customCm?.forShop([userInput]) : [userInput];
        customCm.code(pId,...userInput);
    }
}

function sendDamageMessage(attacker,damager,damage,item) {
    const health = api.getHealth(damager) -damage,
        msg = [
            {icon:item,style:{fontSize:"16px"}},
            {str:String(damage),style:{color:"red"}}
        ];
    if(health >0) {
        msg.push(
            {str:"\n"},{icon:"fa-solid fa-heart",style:{color:"red",fontSize:"16px"}},
            {str:String(health),style:{color:"lime"}}
        );
    }
    api.sendFlyingMiddleMessage(attacker,msg,25);
}
onPlayerDamagingOtherPlayer = sendDamageMessage;
onPlayerDamagingMob = sendDamageMessage;

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
