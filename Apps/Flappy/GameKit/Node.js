import { THREE } from 'expo-three';

import "expo-asset-utils";
import "three"
import "react-native-console-time-polyfill";
import "text-encoding";
import "xmldom-qsa";

export default class Node extends THREE.Group {
  get size() {
    const selectedSprite = this.getSelectedSprite();
    if (selectedSprite) {
      return selectedSprite.size;
    }
    return { width: null, height: null };
  }

  // getter & setter de la position Z du joueur
  get angle() {
    return this.rotation.z;
  }
  set angle(angle) {
    this.rotation.z = angle;
  }

// getter & setter de la position X du joueur
  get x() {
    return this.position.x;
  }
  set x(value) {
    this.position.x = value;
  }

  // getter & setter de la postion Y du joueur
  get y() {
    return this.position.y;
  }
  set y(value) {
    this.position.y = value;
  }

  // initialisation des variables de la partie 
  alive = true; 
  exists = true; 
  renderable = true; 
  fresh = true;

  // function de fin de partie
  kill = () => {
    this.alive = this.exists = this.visible = false;
    return this;
  };

  // redémarrage d'une partie
  revive = health => {
    this.alive = this.exists = this.visible = true;
    this.health = health;
    return this;
  };

  // repositionnement du joueur
  reset = (x, y, health) => {
    this.fresh = this.exists = this.visible = this.renderable = true;
    this.position.x = x;
    this.position.y = y;
    this.health = health;
  };

  constructor({ sprites, sprite, selectedSpriteKey, ...props }) {
    super(props);

    // initiale une clé pour le premier sprite background pour créer le circuit
    if (!sprites) {
      if (sprite) {
        selectedSpriteKey = '0';
        sprites = { [selectedSpriteKey]: sprite };
      } else {
        return;
      }
    }

    // création des sprites affiché dans un outil 3D
    Object.keys(sprites).map(val => {
      let _sprite = sprites[val];
      if (_sprite instanceof THREE.Object3D) {
        this.add(_sprite);
      }
      sprites[val].visible = false;
    });
    this.sprites = sprites;

    this.setSelectedSpriteKey(selectedSpriteKey || Object.keys(sprites)[0]);
  }

// Affichage et désaffichage des sprites suivant et précédent
  setSelectedSpriteKey = key => {
    if (this.selectedSpriteKey != key) {
      for (let _key of Object.keys(this.sprites)) {
        let _sprite = this.sprites[_key];
        if (_key == key) {
          _sprite.visible = true;
        } else {
          _sprite.visible = false;
        }
      }

      this.isAnimating = key;
      const lastSprite = this.sprites[this.selectedSpriteKey];
      if (lastSprite) {
        lastSprite.visible = !this.isAnimating;
      }
      this.selectedSpriteKey = key;
    }
  };

  // Récupération d'un élément par sa clé
  getSelectedSprite = () => {
    if (this.selectedSpriteKey) {
      if (this.sprites.hasOwnProperty(this.selectedSpriteKey)) {
        return this.sprites[this.selectedSpriteKey];
      }
    }
  };
// Apparition des sprites à la suite
  update(dt) {
    let sprite = this.getSelectedSprite();
    if (sprite) {
      sprite.animation.update(1000 * dt);
    }
  }
}