cc.Class({
	extends: cc.Component,

	properties: {
		ring: cc.Prefab
	},

	onLoad() {
		this.levelUps = [5, 10, 25, 50, 75, 100, 200, 500, 1000];
		this.difficulties = [
			{ width: 2, speed: [1.5, 2] },
			{ width: 1.5, speed: [1.75, 2.25] },
			{ width: 1, speed: [2, 2.5] },
			{ width: 0.75, speed: [2, 2.5] },
			{ width: 0.5, speed: [2.25, 2.75] },
			{ width: 0.4, speed: [2.5, 3] },
			{ width: 0.35, speed: [3.25, 3.75] },
			{ width: 0.3, speed: [3.5, 4] },
			{ width: 0.25, speed: [4, 5.5] },
			{ width: 0.2, speed: [4, 7] }
		];
		this.speedStreaks = [5, 10, 20, 30, 40, 50, 100];
		this.moveTypes = [
			['linear'],
			['linear'],
			['linear'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing'],
			['linear', 'swing']
		];
		this.bindEvents();
		this.init();
	},

	bindEvents() {
		this.node.on('touchstart', this.onTouch, this);
	},

	init() {
		this.difficulty = 0;
		this.rawScore = 0;
		this.score = 0;
		this.streak = 0;
		this.criticalStreak = 0;
		this.totalRings = 0;
		this.rings = [];
		this.lastEscalate = 0;
		this.alive = true;
		this.readyToRestart = false;
		for (let i = 0; i < 5; i++) {
			this.generateARing(i);
		}

		this._time = 0;
		whevent.emit('GAME_START');
	},

	onTouch() {
		if (!this.alive && this.readyToRestart) {
			this.restart();
		} else if(this.alive) {
			let currentRing = this.rings.find(ring => ring.getComponent('Ring').isCurrent);
			currentRing.getComponent('Ring').touch();
		}
	},

	gameOver() {
		this.alive = false;
		let shake = cc.sequence(
			cc.moveTo(0.05, -10, 0),
			cc.moveTo(0.05, 10, 0),
			cc.moveTo(0.05, -10, 0),
			cc.moveTo(0.05, 10, 0),
			cc.moveTo(0.05, -10, 0),
			cc.moveTo(0.05, 10, 0),
			cc.moveTo(0.05, 0, 0),
			cc.callFunc(() => {
				this.readyToRestart = true;
				whevent.emit('GAMEOVER', this.score);
			}, this)
		);

		this.node.stopAllActions();
		this.node.runAction(shake);
	},

	restart() {
		whevent.emit('SCORE', 0);
		this.rings.forEach(ring => {
			ring.destroy();
		});
		this.init();
	},

	generateARing(layer) {
		let ring = cc.instantiate(this.ring);
		let difficulty = this.difficulties[this.difficulty];
		let moveTypes = this.moveTypes[this.difficulty];
		ring.parent = this.node;
		ring.setPosition(0, 0);
		ring.getComponent('Ring').init(
			this,
			layer,
			this.totalRings,
			Math.random() * Math.PI * 2,
			(Math.random() > 0.5 ? 1 : -1) * (difficulty.speed[0] + Math.random() * (difficulty.speed[1] - difficulty.speed[0])),
			difficulty.width,
			moveTypes[Math.floor(moveTypes.length * Math.random())]
		);
		this.rings.push(ring);
		this.totalRings++;
	},

	escalate(firstAttempt, critical) {
		this.rawScore++;
		let basicScore = 1;
		let comboBonus = 0;
		let speedBonus = 0;
		if (firstAttempt) {
			this.streak++;
			comboBonus = Math.floor(this.streak / 5);
			whevent.emit('COMBO', { combo: this.streak, bonus: comboBonus });
		} else {
			this.streak = 0;
		}

		if (this.lastEscalate && this._time - this.lastEscalate <= 1) {
			this.speedStreak++;
			if(this.speedStreak > this.speedStreaks.length - 1){
				speedBonus = this.speedStreaks[this.speedStreaks.length - 1];
			}else{
				speedBonus = this.speedStreaks[this.speedStreak - 1];
			}
			whevent.emit('SPEED', { combo: this.speedStreak, bonus: speedBonus });
		} else {
			this.speedStreak = 0;
		}

		this.lastEscalate = this._time;

		this.score += comboBonus + speedBonus + basicScore;

		whevent.emit('SCORE', this.score);
		if (this.levelUps.indexOf(this.rawScore) >= 0) {
			this.difficulty++;
			whevent.emit('LEVELUP', this.difficulty);
		}
		this.generateARing(-1);
		for (let i = 0; i < this.rings.length; i++) {
			let ring = this.rings[i];
			if (ring.getComponent('Ring').layer >= 16) {
				ring.destroy();
				continue;
			}
			ring.getComponent('Ring').escalate();
		}
		this.rings = this.rings.filter(r => r.active);
	},

	update(dt) {
		this._time += dt;
	}
});
