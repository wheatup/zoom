cc.Class({
	extends: cc.Component,

	properties: {
		color: cc.Color,
		exitColor: cc.Color,
		criticalColor: cc.Color,
		pointerColor: cc.Color
	},

	init(manager, layer, id, angle, speed, exitWidth, moveType) {
		this.manager = manager;
		this.baseThickness = 14;
		this.angle = angle;
		this.speed = speed;
		this.id = id;
		this.layer = layer;
		this.actualLayer = layer;
		this.exitWidth = exitWidth;
		this.isCurrent = layer === 4;
		this.moveType = moveType;
		if (this.moveType === 'swing') {
			this.angle = 0;
		}

		this.firstAttempt = true;
		this.critical = false;

		this._touchedTarget = false;
		this._life = 0;
	},

	onLoad() {
		this.ctx = this.node.getComponent(cc.Graphics);
		this.node.angle = -90;
	},

	touch() {
		if (this.isInTarget()) {
			this.manager.escalate(this.firstAttempt, this.critical);
		} else {
			this.manager.gameOver();
		}
	},

	isInTarget() {
		let distance = Math.abs(this.angle);
		if (distance > Math.PI) {
			distance = Math.abs(distance - Math.PI * 2);
		}
		return distance < this.exitWidth * 0.5;
	},

	escalate() {
		this.escalating = true;
		this.actualLayer = this.actualLayer + 1;
		this.isCurrent = this.actualLayer === 4;
		this.deltaLayer = 0;
	},

	update(dt) {
		if (this.manager.alive) {
			this.calcSpin(dt);
			this.calcProperties();
		}
		this.calcEscalating(dt);
		this.renderCircle();
	},

	calcSpin(dt) {
		if (this.moveType === 'linear') {
			this.angle += this.speed * dt;
		} else if (this.moveType === 'swing') {
			this._life += dt * this.speed * 0.5;
			this.angle = Math.sin(this._life) * 2;
		}

		if (this.angle < 0) {
			this.angle += Math.PI * 2;
		} else if (this.angle > Math.PI * 2) {
			this.angle -= Math.PI * 2;
		}
	},

	calcEscalating(dt) {
		if (this.escalating) {
			let amount = dt * 4;
			this.layer += amount;
			if (this.layer >= this.actualLayer) {
				this.escalating = false;
				this.layer = this.actualLayer;
			}
		}
	},

	calcProperties() {
		if (!this.isCurrent) return;

		if (this.firstAttempt) {
			if (!this._touchedTarget && this.isInTarget()) {
				this._touchedTarget = true;
			} else if (this._touchedTarget && !this.isInTarget()) {
				this.firstAttempt = false;
				if (this.manager.streak > 1) {
					whevent.emit('COMBO_BREAK');
				}
			}
		}
	},

	renderCircle() {
		this.thickness = this.baseThickness * (this.layer + 1);
		this.radius = (this.baseThickness + 2) * 0.5 * Math.pow(this.layer + 1, 2);

		this.ctx.clear();
		this.ctx.lineWidth = this.thickness;
		this.ctx.strokeColor = this.color;
		this.ctx.circle(0, 0, this.radius);
		this.ctx.stroke();

		// target
		this.ctx.strokeColor = this.exitColor;
		this.ctx.arc(0, 0, this.radius, this.angle - this.exitWidth * 0.5, this.angle + this.exitWidth * 0.5, true);
		this.ctx.stroke();

		// critical target
		// this.ctx.strokeColor = this.criticalColor;
		// this.ctx.arc(0, 0, this.radius, this.angle - 0.167, this.angle + 0.167, true);
		// this.ctx.stroke();

		if (this.isCurrent) {
			this.ctx.strokeColor = this.pointerColor;
			this.ctx.arc(0, 0, this.radius, -0.02, 0.02, true);
			this.ctx.stroke();
		}
	}
});
