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
    ring: cc.Prefab
  },

  onLoad() {
    this.rings = [];
    for (let i = 0; i < 6; i++) {
      let ring = cc.instantiate(this.ring);
      ring.parent = this.node;
      ring.setPosition(0, 0);
      ring.getComponent('Ring').init(i, Math.random() * Math.PI * 2, Math.PI * 0.25);
      this.rings.push(ring);
    }
  },

  start() {}

  // update (dt) {},
});
