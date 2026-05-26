# 定義
<dl>
  <dt>当サーバー</dt>
  <dd>Bloxd 攻略 WikiのBloxdサーバー、「Wiki撮影用広場」</dd>
  <dt>当コード</dt>
  <dd>当サーバーでのワールドコード</dd>
  <dt>当プロジェクト</dt>
  <dd>BKW-codesリポジトリでの活動</dd>
</dl>

# 目的
改善前、当コードには大きな問題点がありました。
当時のコードについては[Old Lobby Code.js](./Old%20Lobby%20Code.js)を参照してください。
<p><strong>主な問題</strong></p>

- 大量のコールバック
  - ラグの原因となっていました。
- 認証システムの脆弱性
  - 名前に特定の文字列を含めるだけで管理者の判定を得られました。
- 無駄な機能
  - ショップなどの機能は本来の目的である撮影/検証から大きく外れていました。
  - 他にも邪魔な表示やスパムとなり得る要素がいくつかありました。

これらの改善のため、当プロジェクトは始動しました。

# 編集内容
## コマンド
<details>
<summary>対応コード</summary>

```js
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
            description: "ムーンストーンチェストを開く",
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
            description: "特定の座標のチェストを開く",
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
            updateCustomCm(pId,"move",settings => {
                settings.description = `現在設定中の${select}`+settings.description.slice(7);
                return(settings);
            });
            updateCustomCm(pId,"moveDirection",settings => {
                settings.description = `移動方向の編集(現在${select}`+settings.description.slice(11);
                return(settings);
            });
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
            if(getWikiPosition(pId).level <2) {
                return("Error:権限が不足しています")
            }
            let result = eval(code);
            if(result) api.sendMessage(pId, [{str:"Result Log: " +JSON.stringify(result), style: { color: "#CEF3FF" } }]);
        }
    },
    encha:{
        settings:{
            image: "fa-solid fa-gem",
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
            image: "fa-solid fa-gem",
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
};
```

</details>
<p><strong>評価</strong></p>

- [x] コマンド管理のためのコード編集が容易に。
- [x] ひとつのオブジェクトで管理でするため簡潔なコード


