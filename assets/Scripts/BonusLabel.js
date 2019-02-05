cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		this.gravity = 1000;
		this.speedX = Math.random() * 400 - 200;
		this.speedY = Math.random() * 200 + 500;
	},

	start() {},

	update(dt) {
		this.node.x += this.speedX * dt;
		this.node.y += this.speedY * dt;
		this.speedY -= this.gravity * dt;

		if (this.node.y < -500) {
			this.node.destroy();
		}
	}
});
