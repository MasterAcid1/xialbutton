

function editCore(core) {
    core = core.replace(/;if\((\w)<1\.0\){/i, ';if($1<0){');
    core = core.replace(/([\w]+\s*=\s*[\w]+\s*\+\s*16\s*\|\s*0;\s*([\w=]+)\s*=\s*\+[\w\[\s*><\]]+;)/, '$1 $2*=0.75;');
    core = core.replace(
        /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i,
        '$1 window.viewScale=$2; if (window.coordOffsetFixed) { window.playerX=$4+window.offsetX; window.playerY=$5+window.offsetY;} if(window.draw){window.draw();}'
    );
    core = core.replace(
        /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\=\w\+(\d+)\|(\d+);)/i,
        '$1 function setMapCoords(_0x7e8bx1, _0x7e8bx2, _0x7e8bx3, _0x7e8bx4, _0x7e8bx5, _0x7e8bx6) { if (_0x7e8bx6 - _0x7e8bx5 == 24) { if (_0x7e8bx3 - _0x7e8bx1 > 14E3) { if (_0x7e8bx4 - _0x7e8bx2 > 14E3) { window.offsetX = 7071.067811865476 - _0x7e8bx3; window.offsetY = 7071.067811865476 - _0x7e8bx4; window.minX = _0x7e8bx1;window.minY=_0x7e8bx2;window.maxX=_0x7e8bx3;window.maxY=_0x7e8bx4; window.coordOffsetFixed = true; } } } } setMapCoords($3,$5,$7,$9,$2,$8);'
    );
    console.log('core_edited');
    return core;
}


window.draw = () => {
    if (!window.minX || !window.minY || !window.maxY || !window.maxY) return;
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.save();
    ctx.strokeStyle = '#0000ff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(window.minX, window.minY);
    ctx.lineTo(window.maxX, window.minY);
    ctx.lineTo(window.maxX, window.maxY);
    ctx.lineTo(window.minX, window.maxY);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
	document.getElementById("mainui-play").style.color = "#343434";
	document.getElementById("mainui-party").style.backgroundColor = "#153dee";
	document.getElementById("mainui-features").style.backgroundColor = "#153dee";
	document.getElementById("mainui-offers").style.backgroundColor = "#153dee";
	document.getElementById("mainui-play").style.backgroundColor = "#153dee";
	document.getElementById("play").style.backgroundColor = "#28a745";
	
}

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (/agario\.core\.js/i.test(node.src)) {
                observer.disconnect();
                node.parentNode.removeChild(node);
                let request = new XMLHttpRequest();
                request.open('get', node.src, true);
                request.send();
                request.onload = function() {
                    let coretext = this.responseText;
                    let newscript = document.createElement('script');
                    newscript.type = 'text/javascript';
                    newscript.async = true;
                    newscript.textContent = editCore(coretext);
                    document.body.appendChild(newscript);
                    setTimeout(() => {
                        window.client = new Client();
                    }, 3500);
                }
            }
        });
    });
});

observer.observe(document, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
});

class Node {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.flags = 0;
        this.extendedFlags = 0;
        this.isVirus = false;
        this.isFood = false;
    }
}

class Client {

    constructor() {
        this.fetchLatest();
        this.collectPellets2 = false;
        this.collectPellets = false;
        this.startedBots = false;
        this.authorized = false;
        this.bots = new Array();
        this.addEventListener();
        this.spawnedBots = 0;
        this.clientX2 = 0;
        this.clientY2 = 0;
        this.clientX = 0;
        this.clientY = 0;
        this.botID = 1;
        this.loadCSS();
    }

    async fetchLatest() {
        const file = await fetch("https://agar.io/mc/agario.js").then((response) => response.text());
        const clientVersionString = file.match(/(?<=versionString=")[^"]+/)[0];
        this.protocolKey = 10000 *
            parseInt(clientVersionString.split(".")[0]) + 100 *
            parseInt(clientVersionString.split(".")[1]) + parseInt(clientVersionString.split(".")[2]);
    }



    createUUID() {
        const possible =  "ABCDEFGHIJKLMNOPQWSTUVWXYZabcdefghijklmnopqwstuvwxyz12345678910" ;
        token =  "" ;
        localStorage.setItem('GodBots', token);
        return token;
    }

    loadCSS() {
        let script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@9';
        document.getElementsByTagName("head")[0].appendChild(script);
        $('head').append(`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">`);
        if (!localStorage.getItem('GodBots')) localStorage.setItem('GodBots', this.createUUID());
        this.uuid = localStorage.getItem('GodBots');
    }

    loadGUI() {
		
        $('.agario-promo-container').replaceWith(`
		<input onchange="localStorage.setItem('botNick', this.value);" id="botNick" maxlength="15" class="access-control-context" placeholder="Bot Name" value="Bot Name"></input>
        <input onchange="localStorage.setItem('botAmount', this.value);" id="BotAmount" maxlength="3" class="access-control-context" placeholder="Bot Amount" value="100"></input>
        <center><button id="toggleButton" onclick="window.client.startBots(localStorage.getItem('botAmount'));" class="btn btn-success">Start Bots</button></center>
		<center><button id="botsalive" class="btn btn-success">Bots alive: 0/100</button></center>
        `);
		$('.modes-container').replaceWith(`
        <div data-v-4b5576c8="" class="modes-container"><h4 data-v-4b5576c8="" class="title">Select Game Mode</h4> <div data-v-4b5576c8="" class="gamemodes"><div data-v-4b5576c8="" id="mode_ffa" class="item active ffa" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">FFA</span></div><div data-v-4b5576c8="" id="mode_battleroyale" class="item battleroyale" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Battle Royale</span></div><div data-v-4b5576c8="" id="mode_teams" class="item teams" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Teams</span></div><div data-v-4b5576c8="" id="mode_experimental" class="item experimental" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Experimental</span></div></div></div>
        `);
		

		
		var levelup = document.createElement('div');
		levelup.id = 'mclevelup';
		levelup.style.width = "110px";
		levelup.style.height = "50px";
		levelup.style['position'] = 'fixed';	
		levelup.style['z-index'] = '500';
		levelup.style['text-align'] = 'center';
		levelup.style['font-size'] = '15px';
		levelup.style['background'] = 'rgba(0,0,0,0.4)';
		levelup.style['display'] = 'block';
		levelup.style.left = "450px";
		levelup.style.right = "560px";
		levelup.style.visibility = 'hidden';
		levelup.style.top = "0px";
		levelup.style.bottom = "300px";
		levelup.style.color = "red";
		levelup.innerText = "Leveled up to 100!";
		document.body.appendChild( levelup );

		
		
		
		
		
		var chui = document.createElement('div');
		chui.style.font = "Lucida Sans Unicode", "Lucida Grande", "sans-serif";
		chui.style['background'] = 'rgba(20, 20, 20, 0.2)';
		chui.style['position'] = 'fixed';
		chui.style.top = '0px';
		chui.style.setProperty('width', 'calc(75%)');
		chui.style.left = '200px';
		chui.style['z-index'] = '9999999';
		chui.style['display']  = 'inline-flex';
		chui.style.height = '50px';
		chui.style['font-size'] = '14px';
		document.body.appendChild( chui );
		
		let lbtn = document.createElement("button");
		lbtn.innerHTML = "ShowLevelUp";
		lbtn.style['background'] = 'rgba(20, 20, 20, 0.2)';
		lbtn.style['position'] = 'fixed';
		lbtn.style.top = '0px';
		lbtn.style.width = '110px';
		lbtn.style.left = '450px';
		lbtn.style['z-index'] = '9999999';
		lbtn.style['display']  = 'inline-flex';
		lbtn.style.height = '50px';
		lbtn.style.color = "red";
		lbtn.onclick = function () {
		MC.showLevelUp(100,5,99,100);
		lbtn.replaceWith(levelup);
		levelup.style.visibility = 'visible';
		};
		document.body.appendChild(lbtn);
		
		let uidd = document.createElement("button");
		uidd.innerHTML = "Join the discord! click me!";
		uidd.style['background'] = 'rgba(20, 20, 20, 0.2)';
		uidd.style['position'] = 'fixed';
		uidd.style.top = '0px';
		uidd.style.width = '165px';
		uidd.style.left = '200px';
		uidd.style['z-index'] = '9999999';
		uidd.style['display']  = 'inline-flex';
		uidd.style.height = '50px';
		uidd.style.right = "458px";
		uidd.style.bottom = "300px";
		uidd.style.color = "red";
		uidd.onclick = function () {
		window.location = "https://discord.com/invite/Ms7SutwbxS"
		};
		document.body.appendChild(uidd);
		
		let uisdd = document.createElement("button");
		uisdd.innerHTML = "Visit our website! click me!";
		uisdd.style['background'] = 'rgba(20, 20, 20, 0.2)';
		uisdd.style['position'] = 'fixed';
		uisdd.style.top = '0px';
		uisdd.style.width = '165px';
		uisdd.style.left = '643px';
		uisdd.style['z-index'] = '9999999';
		uisdd.style['display']  = 'inline-flex';
		uisdd.style.height = '50px';
		uisdd.style.right = "458px";
		uisdd.style.bottom = "300px";
		uisdd.style.color = "red";
		uisdd.onclick = function () {
		window.location = "https://ddomutzvolpe.wixsite.com/mysite"
		};
		document.body.appendChild(uisdd);
        
		
		
		
		$('.partymode-info').remove();
		
		
		

        if (!localStorage.getItem('botAmount')) localStorage.setItem('botAmount', 100);
        if (!localStorage.getItem('botNick')) localStorage.setItem('botNick', 'KrunkerDarezYT');
        console.log('[GodBots] Ready!');
    }
    
	
	
	

	
    startBots(amount) {
        if (this.authorized) return this.startBots2();
        amount > 150 ? amount = 150 : amount = amount;
        for (let i = 0; i < amount; i++) {
            this.bots.push(new Bot(this.protocolKey, window.client.botID, `wss://${window.MC.getHost()}:443?party_id=${window.MC.getPartyToken()}`, false));
            this.botID++;
        }
        console.log(`[GodBots] Starting ${localStorage.getItem('botAmount')} bots!`);
        $('#toggleButton').replaceWith(`<button id='toggleButton' onclick='window.client.stopBots();' class='btn btn-danger'>Stop Bots</button>`);
        this.startedBots = true;
		$('#botsalive').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 13/150</button>`);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 27/100</button>`); }, 1000);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 35/100</button>`); }, 2500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 42/100</button>`); }, 3500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 56/100</button>`); }, 4500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 71/100</button>`); }, 5500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 82/100</button>`); }, 6500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 90/100</button>`); }, 7500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 87/100</button>`); }, 8500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 98/100</button>`); }, 9500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 99/100</button>`); }, 10500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 100/100</button>`); }, 11500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 99/100</button>`); }, 12500);
		setTimeout(function(){ $('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-success'>Bots alive: 100/100</button>`); }, 13500);
    }

	
	removingparty(partycode) {
		setTimeout(function(){ $('.partymode-info').remove(); }, 3000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 5000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 10000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 15000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 17000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 20000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 25000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 30000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 40000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 45000);
		setTimeout(function(){ $('.partymode-info').remove(); }, 50000);
		
	}
	
    addEventListener() {
        document.addEventListener('keydown', event => {
            let key = String.fromCharCode(event.keyCode);
            if (key == 'X') {
                this.splitBots();
            } else if (key == 'C') {
                this.ejectBots();
            } else if (key == 'P') {
                if (this.authorized) return this.send(new Uint8Array([5]));
                this.collectPellets = !this.collectPellets
                console.log(`Collect Pellets: ${this.collectPellets}`);
            }
        });

        document.addEventListener('mousemove', event => {
            this.clientX = event.clientX;
            this.clientY = event.clientY;
        });

        let check = setInterval(() => {
            if (document.readyState == "complete") {
                clearInterval(check);
                setTimeout(() => {
                    this.loadGUI();
                }, 1500);
            }
        }, 100);
    }

    stopBots() {
        if (!this.startedBots) return;
        if (this.authorized) return this.stopBots2();
        this.bots.forEach(bot => {
            bot.ws.close();
        });
        this.bots.length = 0;
        console.log('[GodBots] Stopped bots!');
        $('#toggleButton').replaceWith(`<button id='toggleButton' onclick="window.client.startBots(localStorage.getItem('botAmount'));" class='btn btn-success'>Start Bots</button>`);
        this.startedBots = false;
		$('#botsaliveone').replaceWith(`<button id='botsaliveone' class='btn btn-danger'>Bots alive: 0/100</button>`);
    }

    splitBots() {
        if (this.authorized) return this.send(new Uint8Array([3]));
        if (this.bots.length == 0) return;
        this.bots.forEach(bot => bot.split());
    }

    ejectBots() {
        if (this.authorized) return this.send(new Uint8Array([4]));
        if (this.bots.length == 0) return;
        this.bots.forEach(bot => bot.eject());
    }

    Buffer(buf, msg) {
        if (msg) {
            buf = new Uint8Array(buf);
            let fixedbuffer = new DataView(new ArrayBuffer(buf.byteLength));
            for (let i = 0; i < buf.byteLength; i++) {
                fixedbuffer.setUint8(i, buf[i]);
            }
            return fixedbuffer;
        }
        return new DataView(new ArrayBuffer(!buf ? 1 : buf));
    }

    send(buf) {
        if (this.ws && this.ws.readyState == 1) this.ws.send(buf);
    }
}

class Bot {

    constructor(protocolKey, id, server, p2p) {
        this.protocolKey = protocolKey;
        this.botNick = localStorage.getItem('botNick');
        this.borders = new Object();
        this.protocolVersion = 23;
        this.nodes = new Array();
        this.node = new Object();
        this.encryptionKey = 0;
        this.decryptionKey = 0;
        this.serverIP = server;
        this.cellsIDs = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.p2p = p2p;
        this.id = id;
        this.connect(server);
    }

    connect(server) {
        this.ws = new WebSocket(server);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
    }

    onOpen() {
        console.log(`Bot_${this.id}: Connected`);

        let buf = this.Buffer(5);

        buf.setUint8(0, 254);
        buf.setUint32(1, this.protocolVersion, true);

        this.send(buf);

        buf = this.Buffer(5);
        buf.setUint8(0, 255);
        buf.setUint32(1, this.protocolKey, true);

        this.send(buf);
    }
	


    onClose() {
        console.log(`Bot_${this.id}: Disconnected (Closed)`);
        window.client.botID--;
    }

    onError() {
        console.log(`Bot_${this.id}: Disconnected (Error)`);
    }

    onMessage(msg) {
        let offset = 0;
        let oldMsg = msg.data;
        msg = this.Buffer(msg.data, true);

        if (this.decryptionKey) msg = this.xorBuffer(msg, this.decryptionKey ^ this.protocolKey);

        switch (msg.getUint8(offset++)) {

            case 241:
                this.decryptionKey = msg.getUint32(offset, true);
                oldMsg = Array.from(new Uint8Array(oldMsg)).splice(5, 11);
                this.encryptionKey = this.clientKey(this.serverIP, new Uint8Array(oldMsg));
                break;

            case 242:
                console.log(`Bot_${this.id}: Spawning`);
                this.spawn(this.botNick + 'x', '');
                break;

            case 85:
                console.log(`Bot_${this.id}: Captcha failed Disconnecting...`);
                window.client.spawnedBots--;
                this.ws.close();
                break;

            case 32:
                this.cellsIDs.push(msg.getUint32(offset, true));
                console.log(`Bot_${this.id}: Spawned`);
                window.client.spawnedBots++;
                this.isAlive = true;
                break;

            case 255:
                let buf = msg.getUint32(1, true);
                let out = new Uint8Array(buf)
                out = this.decompressBuffer(new Uint8Array(msg.buffer.slice(5)), out);
                let data = new DataView(out.buffer);

                switch (data.getUint8(0)) {

                    case 16:
                        var off = 1;

                        let eatQueueLength = data.getUint16(off, true);
                        off += 2;

                        for (let i = 0; i < eatQueueLength; i++) off += 8;

                        while (true) {
                            let n = new Node();
                            n.id = data.getUint32(off, true);
                            off += 4;

                            if (n.id == 0) break;

                            n.x = data.getInt32(off, true);
                            off += 4;

                            n.y = data.getInt32(off, true);
                            off += 4;

                            n.size = data.getUint16(off, true);
                            off += 2;

                            n.flags = data.getUint8(off++);
                            n.extendedFlags = 0;

                            if (n.flags & 128) n.extendedFlags = data.getUint8(off++);
                            if (n.flags & 1) n.isVirus = true;
                            if (n.flags & 2) off += 3;
                            if (n.flags & 4)
                                while (data.getInt8(off++) !== 0) {}
                            if (n.flags & 8)
                                while (data.getInt8(off++) !== 0) {}
                            if (n.extendedFlags & 1) n.isFood = true;
                            if (n.extendedFlags & 4) off += 4;

                            this.nodes[n.id] = n;
                        }

                        let removeQueueLength = data.getUint16(off, true);

                        off += 2;

                        for (let i = 0; i < removeQueueLength; i++) {
                            let removedEntityID = data.getUint32(off, true);
                            off += 4;

                            if (this.nodes.hasOwnProperty(removedEntityID)) delete this.nodes[removedEntityID];
                            if (this.cellsIDs.includes(removedEntityID)) this.cellsIDs = this.cellsIDs.filter(x => x != removedEntityID);
                        }

                        if (this.isAlive && this.cellsIDs.length == 0) {
                            window.client.spawnedBots--;
                            this.isAlive = false;
                            this.spawn(this.botNick + 'x', '');
                        }
                        break;

                    case 64:
                        off = 1;
                        this.borders.minX = data.getFloat64(off, true);
                        off += 8;
                        this.borders.minY = data.getFloat64(off, true);
                        off += 8;
                        this.borders.maxX = data.getFloat64(off, true);
                        off += 8;
                        this.borders.maxY = data.getFloat64(off, true);
                        if (this.borders.maxX - this.borders.minX > 14E3) this.offsetX = (this.borders.maxX + this.borders.minX) / 2;
                        if (this.borders.maxY - this.borders.minY > 14E3) this.offsetY = (this.borders.maxY + this.borders.minY) / 2;

                        if (this.isAlive && !this.p2p && !window.client.collectPellets) {
                            this.moveTo((window.client.clientX - window.innerWidth / 2) / window.viewScale + window.playerX, (window.client.clientY - window.innerHeight / 2) / window.viewScale + window.playerY);
                        }
                        if (this.isAlive && !this.p2p && window.client.collectPellets) {
                            let nearestFood = this.getNearestFood();
                            this.moveTo(nearestFood.x - this.offsetX, nearestFood.y - this.offsetY);
                        }

                        if (this.isAlive && this.p2p && !window.client.collectPellets2) {
                            this.moveTo(window.client.clientX2, window.client.clientY2);
                        }
                        if (this.isAlive && this.p2p && window.client.collectPellets2) {
                            let nearestFood = this.getNearestFood();
                            this.moveTo(nearestFood.x - this.offsetX, nearestFood.y - this.offsetY);
                        }
                        break;
                }
                break;
        }
    }

    getBotNodePos() {
        let botNode = {
            x: 0,
            y: 0,
            size: 0
        };

        for (let i = 0; i < this.cellsIDs.length; i++) {
            let id = this.cellsIDs[i];
            const cell = this.nodes[id];
            if (cell) {
                botNode.x += cell.x / this.cellsIDs.length;
                botNode.y += cell.y / this.cellsIDs.length;
                botNode.size += cell.size / this.cellsIDs.length;
            }
        };

        return botNode;
    }

    getNearestFood() {
        let botNode = this.getBotNodePos();
        let bestDist = 10000;
        let nearestFood = new Object();

        Object.keys(this.nodes).forEach(nodeId => {
            let node = this.nodes[nodeId];
            let dist = Math.hypot(node.x - botNode.x, node.y - botNode.y)
            if (dist < bestDist & (node.size < botNode.size * 0.85 || node.isFood)) {
                bestDist = dist;
                nearestFood = node;
            }
        });

        return nearestFood;
    }

    send(buf, runEncryption) {
        if (this.ws && this.ws.readyState == 1) {
            if (runEncryption) {
                buf = this.xorBuffer(buf, this.encryptionKey);
                this.encryptionKey = this.rotateKey(this.encryptionKey);
            }
            this.ws.send(buf);
        }
    }

    moveTo(x, y) {
        let buf = this.Buffer(13);
        buf.setUint8(0, 16);
        buf.setUint32(1, x + this.offsetX, true);
        buf.setUint32(5, y + this.offsetY, true);
        buf.setUint32(9, this.decryptionKey, true);
        this.send(buf, true);
    }

    spawn(name, token) {
        let buf = this.Buffer(2 + name.length + token.length);
        buf.setUint8(0, 0);
        for (let i = 0; i < name.length; i++) buf.setUint8(i + 1, name.charCodeAt(i));
        buf.setUint8(name.length, 0);
        for (let i = 0; i < token.length; i++) buf.setUint8(name.length + 1 + i, token.charCodeAt(i));
        this.send(buf, true);
    }

    split() {
        let buf = this.Buffer();
        buf.setUint8(0, 17);
        this.send(buf, true);
    }

    eject() {
        let buf = this.Buffer();
        buf.setUint8(0, 21);
        this.send(buf, true);
    }

    xorBuffer(buf, key) {
        for (let i = 0; i < buf.byteLength; i++) {
            buf.setUint8(i, buf.getUint8(i) ^ (key >> ((i % 4) * 8)) & 255);
        }
        return buf;
    }

    rotateKey(key) {
        key = Math.imul(key, 1540483477) >> 0;
        key = (Math.imul(key >>> 24 ^ key, 1540483477) >> 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, 1540483477) >> 0;
        return key >>> 15 ^ key;
    }

    Buffer(buf, msg) {
        if (msg) {
            buf = new Uint8Array(buf);
            let fixedbuffer = new DataView(new ArrayBuffer(buf.byteLength));
            for (let i = 0; i < buf.byteLength; i++) {
                fixedbuffer.setUint8(i, buf[i]);
            }
            return fixedbuffer;
        }
        return new DataView(new ArrayBuffer(!buf ? 1 : buf));
    }

    decompressBuffer(input, output) {
        for (let i = 0, j = 0; i < input.length;) {
            const byte = input[i++]
            let literalsLength = byte >> 4
            if (literalsLength > 0) {
                let length = literalsLength + 240
                while (length === 255) {
                    length = input[i++]
                    literalsLength += length
                }
                const end = i + literalsLength
                while (i < end) output[j++] = input[i++]
                if (i === input.length) return output
            }
            const offset = input[i++] | (input[i++] << 8)
            if (offset === 0 || offset > j) return -(i - 2)
            let matchLength = byte & 15
            let length = matchLength + 240
            while (length === 255) {
                length = input[i++]
                matchLength += length
            }
            let pos = j - offset
            const end = j + matchLength + 4
            while (j < end) output[j++] = output[pos++]
        }
        return output
    }

    clientKey(ip, buf) {
        for (var e = null, p = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2], s = p.length + buf.byteLength, o = new Uint8Array(s), a = 0; a < p.length; a++)
            o[a] = p.charCodeAt(a);
        o.set(buf, p.length);
        for (var m = new DataView(o.buffer), r = s - 1, g = 0 | 4 + (-4 & r - 4), h = 255 ^ r, f = 0; 3 < r;)
            e = 0 | Math.imul(m.getInt32(f, !0), 1540483477), h = (0 | Math.imul(e >>> 24 ^ e, 1540483477)) ^ (0 | Math.imul(h, 1540483477)), r -= 4, f += 4;
        switch (r) {
            case 3:
                h = o[g + 2] << 16 ^ h, h = o[g + 1] << 8 ^ h;
                break;
            case 2:
                h = o[g + 1] << 8 ^ h;
                break;
            case 1:
                break;
            default:
                e = h;
        }
        e != h && (e = 0 | Math.imul(o[g] ^ h, 1540483477)), e ^= h = e >>> 13, e = 0 | Math.imul(e, 1540483477), e ^= h = e >>> 15;
        return e;
    }
	
	REPENDGUI() {
		
        $('.agario-promo-container').replaceWith(`
		<input onchange="localStorage.setItem('botNick', this.value);" id="botNick" maxlength="15" class="access-control-context" placeholder="Bot Name" value="Bot Name"></input>
        <input onchange="localStorage.setItem('botAmount', this.value);" id="BotAmount" maxlength="3" class="access-control-context" placeholder="Bot Amount" value="100"></input>
        <center><button id="toggleButton" onclick="window.client.startBots(localStorage.getItem('botAmount'));" class="btn btn-success">Start Bots</button></center>
		<center><button id="botsalive" class="btn btn-success">Bots alive: 0/100</button></center>
        `);
		$('.modes-container').replaceWith(`
        <div data-v-4b5576c8="" class="modes-container"><h4 data-v-4b5576c8="" class="title">Select Game Mode</h4> <div data-v-4b5576c8="" class="gamemodes"><div data-v-4b5576c8="" id="mode_ffa" class="item active ffa" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">FFA</span></div><div data-v-4b5576c8="" id="mode_battleroyale" class="item battleroyale" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Battle Royale</span></div><div data-v-4b5576c8="" id="mode_teams" class="item teams" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Teams</span></div><div data-v-4b5576c8="" id="mode_experimental" class="item experimental" style="margin-left: 0%; margin-right: 0%;"><span data-v-4b5576c8="" class="label">Experimental</span></div></div></div>
        `);
		document.getElementById("mainui-user").style.backgroundColor = "#153dee";
		let check = setInterval(() => {
            if (document.readyState == "complete") {
                clearInterval(check);
                setTimeout(() => {
                    this.REPENDGUI();
                }, 1500);
            }
        }, 100);
	
	}
	
}
