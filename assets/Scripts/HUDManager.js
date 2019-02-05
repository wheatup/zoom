cc.Class({
	extends: cc.Component,

	properties: {
		scoreLabel: cc.Label,
		comboLabel: cc.Label,
		speedLabel: cc.Label,
		bonusContainer: cc.Node,
		bonusLabel: cc.Prefab
	},

	onLoad() {
		this.bindEvents();
		this.comboLabel.node.opacity = 0;
		this.speedLabel.node.opacity = 0;

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

		this.comboLabel.node.orgColor = this.comboLabel.node.color;
	},

	bindEvents() {
		whevent.on('SCORE', this.onScore, this);
		whevent.on('COMBO', this.onCombo, this);
		whevent.on('COMBO_BREAK', this.onComboBreak, this);
		whevent.on('SPEED', this.onSpeedStreak, this);
	},

	onScore(score) {
		this.scoreLabel.string = `Score: ${score}`;
	},

	onCombo(data) {
		if (data.combo > 1) {
			this.comboLabel.node.color = this.comboLabel.node.orgColor;
			this.comboLabel.string = `${data.combo} Combo`;
			this.comboLabel.node.stopAllActions();
			this.comboLabel.node.runAction(this.comboAnimation);

			if (data.bonus > 0) {
				this.addBonus(data.bonus, this.comboLabel.node.color);
			}
		}
	},

	onComboBreak() {
		this.comboLabel.node.color = new cc.Color(150, 150, 150, 255);
		this.comboLabel.string = 'Miss';
		this.comboLabel.node.stopAllActions();
		this.comboLabel.node.runAction(this.comboAnimation);
	},

	onSpeedStreak(data) {
		this.speedLabel.string = `${data.combo} Speedy`;
		this.speedLabel.node.stopAllActions();
		this.speedLabel.node.runAction(this.speedAnimation);

		if (data.bonus > 0) {
			this.addBonus(data.bonus, this.speedLabel.node.color);
		}
	},

	addBonus(amount, color) {
		let bonus = cc.instantiate(this.bonusLabel);
		bonus.parent = this.bonusContainer;
		bonus.setPosition(0, 0);
		bonus.color = color;
		bonus.getComponent(cc.Label).string = '+' + amount;
	}
});
