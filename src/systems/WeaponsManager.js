import Weapon from '../objects/Weapon';

class WeaponsManager {
    constructor(client) {
      this.client = client;
      this.list = this.client.game.cache.getJSON('items').items;
    }

    create(id, actor) {
      let w, type, damage, range, reloadTime, effect, weapon;

      w = this.list.find(function(el) {
        if (el[0] == id || el.id == id) {
          return true;
        }
        return false;
      })

      if (w) {
        type = 'range' // w[] || w.type;
        damage = w[18] || w.damage;
        range = (w[39] || w.range || 1) * 100;
        reloadTime = w[37] || w.reloadTime;
        effect = type == 'melee' ? this.client.effectsManager.strike : this.client.effectsManager.scratch;
        weapon = new Weapon(this.client, id, type, damage, range, reloadTime, effect, actor);
        this.client.weaponsList.push(weapon)
      }

      return weapon;
    }
}

export default WeaponsManager;