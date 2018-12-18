import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Files from './Files';
import { Group, Node, Sprite, SpriteView } from './GameKit';
import "react-native-console-time-polyfill";
import "text-encoding";
import "xmldom-qsa";
/* global Settings!
*/
const SPEED = 5.6;
const GRAVITY = 1100;
const FLAP = 320;
const SPAWN_RATE = 1600;
const OPENING = 120;
const GROUND_HEIGHT = 64;

export default class Game extends React.Component {
  scale = 1;
  pipes = new Group();
  deadPipeTops = [];
  deadPipeBottoms = [];

  gameStarted = false;
  gameOver = false;
  velocity = 0;

  state = {
    score: 0,
  };

  componentWillMount() {
    THREE.suppressExpoWarnings(true);

  }

  setupAudio = async () => {
    Expo.Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

 
    this.audio = {};
    Object.keys(Files.audio).map(async key => {
      const res = Files.audio[key];
      const { sound } = await Expo.Audio.Sound.create(res);
      await sound.setStatusAsync({
        volume: 1,
      });
      this.audio[key] = async () => {
        try {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        } catch (error) {
          console.warn('sound error', { error });
          // An error occurred!
        }
      };
    });
  };

  /// Sprites
  setupPlayer = async () => {
    const size = {
      width: 36 * this.scale,
      height: 26 * this.scale,
    };

    /*108/3 = 36
    */
    const sprite = new Sprite();
    await sprite.setup({
      image: Files.sprites.bird,
      tilesHoriz: 3,
      tilesVert: 1,
      numTiles: 3,
      tileDispDuration: 75,
      size,
    });

    this.player = new Node({
      sprite,
    });
    this.scene.add(this.player);
  };

  setupGround = async () => {
    const { scene } = this;
    const size = {
      width: scene.size.width,
      height: scene.size.width * 0.333333333,
    };
    this.groundNode = new Group();


    const node = await this.setupStaticNode({
      image: Files.sprites.ground,
      size,
      name: 'ground',
    });

    const nodeB = await this.setupStaticNode({
      image: Files.sprites.ground,
      size,
      name: 'ground',
    });
    nodeB.x = size.width;

    this.groundNode.add(node);
    this.groundNode.add(nodeB);

    this.groundNode.position.y =
      (scene.size.height + (size.height - GROUND_HEIGHT)) * -0.5;

    this.groundNode.top = this.groundNode.position.y + size.height / 2;

    this.groundNode.position.z = 0.01;
    scene.add(this.groundNode);
  };

  setupBackground = async () => {
    const { scene } = this;
    const { size } = scene;
    const bg = await this.setupStaticNode({
      image: Files.sprites.bg,
      size,
      name: 'bg',
    });

    scene.add(bg);
  };

  setupPipe = async ({ key, y }) => {
    const size = { width: 52, height: 320 };

    const tbs = {
      top: Files.sprites.pipe_top,
      bottom: Files.sprites.pipe_bottom,
    };
    const pipe = await this.setupStaticNode({
      image: tbs[key],
      size,
      name: key,
    });
    pipe.y = y;

    return pipe;
  };

  setupStaticNode = async ({ image, size, name, scale }) => {
    scale = scale || this.scale;

    const sprite = new Sprite();


    await sprite.setup({
      image,
      size: {
        width: size.width * scale,
        height: size.height * scale,
      },
    });


    const node = new Node({
      sprite,
    });
    node.name = name;
    return node;
  };

  spawnPipe = async (openPos, flipped) => {
    let pipeY;
    if (flipped) {
      pipeY = Math.floor(openPos - OPENING / 2 - 320);
    } else {
      pipeY = Math.floor(openPos + OPENING / 2);
    }
    let pipeKey = flipped ? 'bottom' : 'top';
    let pipe;

    const end = this.scene.bounds.right + 26;
    if (this.deadPipeTops.length > 0 && pipeKey === 'top') {
      pipe = this.deadPipeTops.pop().revive();
      pipe.reset(end, pipeY);
    } else if (this.deadPipeBottoms.length > 0 && pipeKey === 'bottom') {
      pipe = this.deadPipeBottoms.pop().revive();
      pipe.reset(end, pipeY);
    } else {
      pipe = await this.setupPipe({
        scene: this.scene,
        y: pipeY,
        key: pipeKey,
      });
      pipe.x = end;

      this.pipes.add(pipe);
    }
    pipe.velocity = -SPEED;
    return pipe;
  };

  spawnPipes = () => {
    this.pipes.forEachAlive(pipe => {
      //Si des tuyaux sortent de l'écran ceux si sont taggés morts afin qu'ils puissent réapparaître
      if (pipe.size && pipe.x + pipe.size.width < this.scene.bounds.left) {
        if (pipe.name === 'top') {
          this.deadPipeTops.push(pipe.kill());
        }
        if (pipe.name === 'bottom') {
          this.deadPipeBottoms.push(pipe.kill());
        }
      }
    });

    //Random espace entre les Tuyeaux.
    const pipeY =
      this.scene.size.height / 2 +
      (Math.random() - 0.5) * this.scene.size.height * 0.2;
    this.spawnPipe(pipeY);
    this.spawnPipe(pipeY, true);
  };

  tap = () => {
    // Démarrage du jeux au premier tap !
    if (!this.gameStarted) {
      this.gameStarted = true;

      this.pillarInterval = setInterval(this.spawnPipes, SPAWN_RATE);
    }

    if (!this.gameOver) {
      // si je suis toujour vivant ! si je tap = l'oiseaux saute !
      this.velocity = FLAP;

    } else {
      // @si je suis mort je respawn
      this.reset();
    }
  };

  //@parti ajout des point
  addScore = () => {
    this.setState({ score: this.state.score + 1 });
    // this.audio.point();
  };


  setGameOver = () => {
    this.gameOver = true;

    clearInterval(this.pillarInterval);


  };

  //@on remet tous a 0 !
  reset = () => {
    this.gameStarted = false;
    this.gameOver = false;
    this.setState({ score: 0 });

    this.player.reset(this.scene.size.width * -0.3, 0);
    this.player.angle = 0;
    this.pipes.removeAll();
  };

  onSetup = async ({ scene }) => {
    this.scene = scene;
    this.scene.add(this.pipes);
    await this.setupBackground();
    await this.setupGround();
    await this.setupPlayer();

    this.reset();
  };

  updateGame = delta => {
    if (this.gameStarted) {
      this.velocity -= GRAVITY * delta;
      const target = this.groundNode.top;

      if (!this.gameOver) {
        const playerBox = new THREE.Box3().setFromObject(this.player);


        this.pipes.forEachAlive(pipe => {
          pipe.x += pipe.velocity;
          const pipeBox = new THREE.Box3().setFromObject(pipe);

          //condition pour avoir le game over "si je touche le tuyau"
          if (pipeBox.intersectsBox(playerBox)) {
            this.setGameOver();
          }

          //Si il passe un tuyau, +1 au score
          if (
            pipe.name === 'bottom' &&
            !pipe.passed &&
            pipe.x < this.player.x
          ) {
            pipe.passed = true;
            this.addScore();
          }
        });


        this.player.angle = Math.min(
          Math.PI / 4,
          Math.max(-Math.PI / 2, (FLAP + this.velocity) / FLAP)
        );

        //si il touche le sol game over " on evalue par rapport a la position de l'oiseaux et celle du sol
        if (this.player.y <= target) {
          this.setGameOver();
        }

        this.player.update(delta);
      }

      //si game over ? l'oiseaux continura a tomber jusqu'au sol
      if (this.player.y <= target) {
        this.player.angle = -Math.PI / 2;
        this.player.y = target;
        this.velocity = 0;
      } else {
        this.player.y += this.velocity * delta;
      }
    } else {

      // l'oiseau continue a voler

      this.player.update(delta);
      this.player.y = 8 * Math.cos(Date.now() / 200);
      this.player.angle = 0;
    }

    if (!this.gameOver) {
      //boucle animation du sol
      this.groundNode.children.map((node, index) => {
        node.x -= SPEED;

        if (node.x < this.scene.size.width * -1) {
          let nextIndex = index + 1;
          if (nextIndex === this.groundNode.children.length) {
            nextIndex = 0;
          }
          const nextNode = this.groundNode.children[nextIndex];
          node.x = nextNode.x + this.scene.size.width - 1.55;
        }
      });
    }
  };

  renderScore = () => (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 64,
        position: 'absolute',
        left: 0,
        right: 0,
        color: 'white',
        top: 64,
        backgroundColor: 'transparent',
      }}>
      {this.state.score}
    </Text>
  );

  render() {

    return (
      <View style={StyleSheet.absoluteFill}>
        <SpriteView
          touchDown={() => this.tap()}
          touchMoved={() => {}}
          touchUp={() => {}}
          update={this.updateGame}
          onSetup={this.onSetup}
        />
        {this.renderScore()}
      </View>
    );
  }
}