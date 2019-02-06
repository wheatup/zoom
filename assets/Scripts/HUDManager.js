cc.Class({
	extends: cc.Component,

	properties: {
		scoreLabel: cc.Label,
		comboLabel: cc.Label,
		speedLabel: cc.Label,
		bonusContainer: cc.Node,
		bonusLabel: cc.Prefab,
		scorePanel: cc.Node,
		finalScoreLabel: cc.Label,
		levelUpLabel: cc.Label
	},

	onLoad() {
		this.bindEvents();

		this.comboAnimation = cc.sequence(
			cc.spawn(cc.scaleTo(0, 1, 1), cc.fadeOut(0)),
			cc.spawn(cc.scaleTo(0.05, 1.2, 1.2), cc.fadeIn(0.05)).easing(cc.easeCubicActionOut()),
			cc.scaleTo(0.2, 0.9, 0.9).easing(cc.easeCubicActionIn()),
			cc.scaleTo(0.2, 1, 1).easing(cc.easeCubicActionOut()),
			cc.fadeOut(0.5)
		);

		this.speedAnimation = cc.sequence(
			cc.spawn(cc.scaleTo(0, 1, 1), cc.fadeOut(0)),
			cc.spawn(cc.scaleTo(0.05, 1.2, 1.2), cc.fadeIn(0.05)).easing(cc.easeCubicActionOut()),
			cc.scaleTo(0.2, 0.9, 0.9).easing(cc.easeCubicActionIn()),
			cc.scaleTo(0.2, 1, 1).easing(cc.easeCubicActionOut()),
			cc.fadeOut(0.5)
		);

		this.levelUpAnimation = cc.sequence(
			cc.spawn(cc.moveTo(0, -400, 0), cc.fadeOut(0)),
			cc.spawn(cc.moveTo(0.25, 0, 0).easing(cc.easeCubicActionOut()), cc.fadeIn(0.25)),
			cc.delayTime(0.75),
			cc.spawn(cc.moveTo(0.25, 400, 0).easing(cc.easeCubicActionIn()), cc.fadeOut(0.25))
		);

		this.comboLabel.node.orgColor = this.comboLabel.node.color;
		this.comboLabel.node.orgOutlineColor = this.comboLabel.node.getComponent(cc.LabelOutline).color;
		this.onGameStart();
	},

	bindEvents() {
		whevent.on('GAME_START', this.onGameStart, this);
		whevent.on('SCORE', this.onScore, this);
		whevent.on('COMBO', this.onCombo, this);
		whevent.on('COMBO_BREAK', this.onComboBreak, this);
		whevent.on('LEVELUP', this.onLevelUp, this);
		whevent.on('SPEED', this.onSpeedStreak, this);
		whevent.on('GAMEOVER', this.onGameOver, this);
	},

	onGameStart() {
		this.comboLabel.node.opacity = 0;
		this.speedLabel.node.opacity = 0;
		this.levelUpLabel.node.opacity = 0;
		this.scorePanel.active = false;
	},

	onScore(score) {
		this.scoreLabel.string = `Score: ${score}`;
	},

	onCombo(data) {
		if (data.combo > 1) {
			this.comboLabel.node.color = this.comboLabel.node.orgColor;
			this.comboLabel.node.getComponent(cc.LabelOutline).color = this.comboLabel.node.orgOutlineColor;
			this.comboLabel.string = `${data.combo} Combo`;
			this.comboLabel.node.stopAllActions();
			this.comboLabel.node.runAction(this.comboAnimation);

			if (data.bonus > 0) {
				this.addBonus(data.bonus, this.comboLabel.node.color, this.comboLabel.node.getComponent(cc.LabelOutline).color);
			}
		}
	},

	onLevelUp(level){
		this.levelUpLabel.node.stopAllActions();
		this.levelUpLabel.node.runAction(this.levelUpAnimation);
	},

	onComboBreak() {
		this.comboLabel.node.color = new cc.Color(150, 150, 150, 255);
		this.comboLabel.node.getComponent(cc.LabelOutline).color = new cc.Color(50, 50, 50, 255);
		this.comboLabel.string = 'Combo Broken';
		this.comboLabel.node.stopAllActions();
		this.comboLabel.node.runAction(this.comboAnimation);
	},

	onSpeedStreak(data) {
		this.speedLabel.string = `${data.combo} Speedy`;
		this.speedLabel.node.stopAllActions();
		this.speedLabel.node.runAction(this.speedAnimation);

		if (data.bonus > 0) {
			this.addBonus(data.bonus, this.speedLabel.node.color, this.speedLabel.node.getComponent(cc.LabelOutline).color);
		}
	},

	onGameOver(score) {
		console.log(score);
		this.finalScoreLabel.string = score;
		this.scorePanel.active = true;
		this.scorePanel.opacity = 0;
		this.scorePanel.runAction(cc.spawn(cc.fadeIn(0.2), cc.sequence(
			cc.scaleTo(0, 0.2, 0.2),
			cc.scaleTo(0.2, 1.1, 1.1).easing(cc.easeCubicActionOut()),
			cc.scaleTo(0.1, 1, 1).easing(cc.easeCubicActionIn())
		)));
	},

	addBonus(amount, color, outlineColor) {
		let bonus = cc.instantiate(this.bonusLabel);
		bonus.parent = this.bonusContainer;
		bonus.setPosition(0, 0);
		bonus.color = color;
		bonus.getComponent(cc.LabelOutline).color = outlineColor;
		bonus.getComponent(cc.Label).string = '+' + amount;
	}
});
