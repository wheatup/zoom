// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    color: cc.Color,
    exitColor: cc.Color
  },

  init(layer, exit, exitWidth){
    let baseThickness = 14;
    this.layer = layer;
    this.exit = exit,
    this.exitWidth = exitWidth;
    this.thickness = baseThickness * (layer + 1);
    this.radius = (baseThickness + 1) * 0.5 * Math.pow(layer + 1, 2);
  },

  onLoad () {
    this.ctx = this.node.getComponent(cc.Graphics);
    console.log(this.ctx);
  },

  start(dt) {
    this.ctx.lineWidth = this.thickness;
    this.ctx.strokeColor = this.color;
    this.ctx.circle(0, 0, this.radius);
    this.ctx.stroke();
    this.ctx.strokeColor = this.exitColor;
    this.ctx.arc(0, 0, this.radius, this.exit - this.exitWidth * 0.5, this.exit + this.exitWidth * 0.5, true);
    this.ctx.stroke();
  }

  // update (dt) {},
});
