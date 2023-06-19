<template>
  <div ref="gameContainer"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, PropType } from 'vue';
import PongGameScene from "@/Game/pong-scenes/PongGame";
import PreloadScene from "@/Game/pong-scenes/Preload";
import { GameNetwork, GameUserType } from "@/Game/network/GameNetwork";
import { GameMonitor } from "@/Game/network/GameMonitor";

let game: Phaser.Game | undefined;
let gameNetwork: GameNetwork | undefined;

const gameContainer = ref(null);

const props = defineProps({
  competition: Object as PropType<{
    isOnline: boolean,
    room: string,
    theme?: string
  }>,
  user: Object as PropType<{
    userId: number,
    username: string,
    avatar: string,
  }>,
})

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'Game-container',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 }
      }
    },
  };

  // Instantiate GameNetwork
  gameNetwork = new GameNetwork(
      props.competition?.room ?? 'fake-room',
      {
        userId: props.user?.userId ?? 0,
        username: props.user?.username ?? 'fake-user',
        avatar: props.user?.avatar ?? '/pong/player.png',
      },
      GameUserType.Player, // or Viewer depending on the case
      (worked) => { console.log('Connected:', worked) }
  );
  const gameData = {
    room: props.competition?.room ?? 'fake-room',
    isOnline: props.competition?.isOnline ?? false, // by default, offline
    gameNetwork,
    gameMonitor: undefined as unknown as GameMonitor,
    user: {
      userId: props.user?.userId ?? 0,
      username: props.user?.username ?? 'fake-user',
      avatar: props.user?.avatar ?? '/pong/player.png',
    },
    userType: GameUserType.Player, // or Viewer depending on the case
    theme: props.competition?.theme ?? 'default'
  };

  // Instantiate PongGameScene with GameNetwork
  const pongGameScene = new PongGameScene();
  gameData.gameMonitor = new GameMonitor(gameNetwork, pongGameScene);

  config.scene = {
    create: () => {
      game?.scene.add('PreloadScene', PreloadScene, true, gameData);
      game?.scene.add('PongGame', pongGameScene, false, gameData);
    }
  };
  game = new Phaser.Game(config);
})

onBeforeUnmount(() => {
  game?.destroy(true);
  // gameMonitor?.stopListening();
  gameNetwork?.disconnect();
})

</script>

<style scoped>

</style>
