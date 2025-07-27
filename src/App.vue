<template>
  <div id="app">
    <h1>スイカ割り</h1>
    <div class="game-board">
      <div v-for="y in SQUARE" :key="'row-' + y" class="row">
        <div
          v-for="x in SQUARE"
          :key="'cell-' + x"
          class="cell"
          :class="{
            'player': player.x === x && player.y === (SQUARE - y + 1),
            'watermelon': watermelon.x === x && watermelon.y === (SQUARE - y + 1) && !gameOver
          }"
        >
          <span v-if="player.x === x && player.y === (SQUARE - y + 1)">⚫︎</span>
          <span v-else-if="watermelon.x === x && watermelon.y === (SQUARE - y + 1) && !gameOver">-</span>
          <span v-else>-</span>
        </div>
      </div>
    </div>

    <p>wasdキーで操作して、スイカを割りましょう。</p>
    <p>スイカまでの距離は {{ distanceToWatermelon }} です。</p>

    <div v-if="gameOver" class="game-over">
      <p>スイカを割りました！</p>
      <button @click="resetGame">もう一度プレイ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const SQUARE = 10;
const player = reactive({ x: 0, y: 0 });
const watermelon = reactive({ x: 0, y: 0 });
const gameOver = ref(false);

// 位置をランダムに指定する関数
const getRandomPos = () => {
  const x = Math.floor(Math.random() * SQUARE) + 1;
  const y = Math.floor(Math.random() * SQUARE) + 1;
  return { x, y };
};

// スイカまでのユークリッド距離を計算
const distanceToWatermelon = computed(() => {
  return Math.abs(player.x - watermelon.x) + Math.abs(player.y - watermelon.y);
});

// プレイヤーの移動ロジック
const movePlayer = (direction) => {
  if (gameOver.value) return;

  let newX = player.x;
  let newY = player.y;

  switch (direction) {
    case 'w': // 上
      newY = Math.min(SQUARE, player.y - 1);
      break;
    case 's': // 下
      newY = Math.max(1, player.y + 1);
      break;
    case 'a': // 左
      newX = Math.max(1, player.x - 1);
      break;
    case 'd': // 右
      newX = Math.min(SQUARE, player.x + 1);
      break;
  }

  player.x = newX;
  player.y = newY;

  checkGameOver();
};

// ゲーム終了判定
const checkGameOver = () => {
  if (player.x === watermelon.x && player.y === watermelon.y) {
    gameOver.value = true;
  }
};

// ゲームのリセット
const resetGame = () => {
  Object.assign(player, getRandomPos());
  Object.assign(watermelon, getRandomPos());
  gameOver.value = false;

  // プレイヤーとスイカが同じ位置に生成された場合、スイカの位置を再生成
  while (player.x === watermelon.x && player.y === watermelon.y) {
    Object.assign(watermelon, getRandomPos());
  }
};

// キーボードイベントリスナー
const handleKeyDown = (event) => {
  const key = event.key;
  if (['w', 'a', 's', 'd'].includes(key)) {
    movePlayer(key);
  }
};

// コンポーネトがマウントされたときにイベントリスナーを追加
onMounted(() => {
  resetGame(); // 初期位置設定
  window.addEventListener('keydown', handleKeyDown);
});

// コンポーネントがアンマウントされるときにイベントリスナーを削除
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.game-board {
  display: flex;
  flex-direction: column-reverse; /* Y軸を上方向にするため */
  border: 1px solid #ccc;
  width: fit-content;
  margin: 20px auto;
}

.row {
  display: flex;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
}

.player {
  background-color: #add8e6; /* 薄い水色 */
}

/* .watermelon { */
  /*background-color: #f08080;*/ /* 薄い赤 */
/*} */

.game-over {
  margin-top: 20px;
  font-size: 1.5em;
  color: green;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;
}
</style>