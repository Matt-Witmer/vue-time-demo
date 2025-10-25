<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFootballScores } from './composables/useFootballScores.js'

const { isGameDay, games, loading, error } = useFootballScores()
const currentTime = ref(new Date())

const updateTime = () => {
  currentTime.value = new Date()
}

const handleImageError = (event) => {
  // Fallback to emoji if image fails to load
  event.target.style.display = 'none'
  const emojiDiv = event.target.nextElementSibling || event.target.previousElementSibling
  if (emojiDiv && emojiDiv.classList.contains('emoji')) {
    emojiDiv.style.display = 'flex'
  }
}

let interval

onMounted(() => {
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<template>
  <div v-if="loading" class="time-container">
    <h1 class="time-display">Loading football scores...</h1>
  </div>
  <div v-else-if="error" class="time-container">
    <div class="error-message">
      <h1 class="time-display">Unable to load scores</h1>
      <p class="date-display">{{ error }}</p>
      <p class="date-display">Showing current time instead</p>
    </div>
  </div>
  <div v-else-if="isGameDay === false && games.length === 0" class="time-container">
    <h1 class="time-display">{{ currentTime.toLocaleTimeString() }}</h1>
    <p class="date-display">No live games currently</p>
  </div>
  <div v-else-if="isGameDay" class="scores-container">
    <div class="games-list">
      <div v-for="game in games" :key="game.id" class="game-card">
        <div class="game-header">
          <div class="quarter-time">
            <span class="quarter">{{ game.isHalftime ? 'HT' : `Q${game.quarter}` }}</span>
            <span class="time-left">{{ game.timeLeft }}</span>
          </div>
        </div>
        <div class="teams-container">
          <div class="team away">
            <img v-if="game.awayTeam.logo.startsWith('http')" :src="game.awayTeam.logo" :alt="game.awayTeam.name" class="team-logo" @error="handleImageError($event)" />
            <div v-else class="team-logo emoji">{{ game.awayTeam.logo }}</div>
            <div class="team-info">
              <div class="team-name">
                <span v-if="game.awayTeam.ranking" class="ranking">#{{ game.awayTeam.ranking }}</span>
                {{ game.awayTeam.name }}
                <span v-if="game.awayTeam.hasPossession" class="possession-icon">🏈</span>
              </div>
              <div class="team-score">{{ game.awayTeam.score }}</div>
            </div>
          </div>
          <div class="vs">vs</div>
          <div class="team home">
            <img v-if="game.homeTeam.logo.startsWith('http')" :src="game.homeTeam.logo" :alt="game.homeTeam.name" class="team-logo" @error="handleImageError($event)" />
            <div v-else class="team-logo emoji">{{ game.homeTeam.logo }}</div>
            <div class="team-info">
              <div class="team-name">
                <span v-if="game.homeTeam.ranking" class="ranking">#{{ game.homeTeam.ranking }}</span>
                {{ game.homeTeam.name }}
                <span v-if="game.homeTeam.hasPossession" class="possession-icon">🏈</span>
              </div>
              <div class="team-score">{{ game.homeTeam.score }}</div>
            </div>
          </div>
        </div>

        <!-- Football Field Visualization -->
        <div v-if="game.fieldData && game.fieldData.down > 0 && game.fieldData.yardsToGo > 0" class="field-container">
          <div class="field-info">
            <div class="down-distance">{{ game.fieldData.down }}{{ game.fieldData.down === 1 ? 'st' : game.fieldData.down === 2 ? 'nd' : game.fieldData.down === 3 ? 'rd' : 'th' }} & {{ game.fieldData.yardsToGo }}</div>
          </div>
          <div class="football-field">
            <!-- End Zone Left -->
            <div class="end-zone left">
              <div class="end-zone-label">{{ game.fieldData.direction === 'left' ? game.homeTeam.name.split(' ').pop() : game.awayTeam.name.split(' ').pop() }}</div>
            </div>

            <!-- Field -->
            <div class="field">
              <!-- Yard lines for both halves -->
              <div class="yard-line" v-for="yard in [10, 20, 30, 40, 50, 60, 70, 80, 90]" :key="yard" :style="{ left: `${(yard / 100) * 100}%` }">
                <div class="yard-number" v-if="yard !== 50">{{ yard > 50 ? 100 - yard : yard }}</div>
              </div>

              <!-- Ball position line (black) -->
              <div class="ball-position-line" :style="{ left: `${(game.fieldData.ballPosition / 100) * 100}%` }"></div>

              <!-- Line to gain (yellow) -->
              <div class="line-to-gain" :style="{ left: `${(game.fieldData.lineToGain / 100) * 100}%` }"></div>

              <!-- Direction arrow -->
              <div class="direction-arrow" :class="{ left: game.fieldData.direction === 'left', right: game.fieldData.direction === 'right' }">
                <div class="arrow">→</div>
              </div>
            </div>

            <!-- End Zone Right -->
            <div class="end-zone right">
              <div class="end-zone-label">{{ game.fieldData.direction === 'right' ? game.homeTeam.name.split(' ').pop() : game.awayTeam.name.split(' ').pop() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="time-container">
    <h1 class="time-display">{{ currentTime.toLocaleTimeString() }}</h1>
    <p class="date-display">{{ currentTime.toLocaleDateString() }}</p>
  </div>
</template>

<style scoped>
.time-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3e5c99 100%);
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.time-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  z-index: 1;
}

.time-display {
  font-size: 5rem;
  font-weight: 200;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.3);
  z-index: 2;
  animation: fadeIn 0.5s ease-in;
  letter-spacing: 2px;
}

.date-display {
  font-size: 1.8rem;
  opacity: 0.85;
  margin: 1.5rem 0 0 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
  animation: slideUp 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .time-display {
    font-size: 3.5rem;
  }
  .date-display {
    font-size: 1.4rem;
  }
}

/* Scores Styles */
.scores-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3e5c99 100%);
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow-y: auto;
  margin: 0;
  padding-bottom: 2rem;
}

.scores-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  z-index: 1;
}

.games-list {
  position: relative;
  z-index: 2;
  width: 80%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.game-card {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.game-card:last-child {
  border-bottom: none;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #333;
}

.quarter {
  background: #1e3c72;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.time-left {
  color: #666;
  font-size: 1.1rem;
}

.possession-icon {
  margin-left: 0.5rem;
  font-size: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

/* Football Field Styles */
.field-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.field-info {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.down-distance {
  background: #1e3c72;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.football-field {
  display: flex;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.end-zone {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  color: white;
  position: relative;
}

.end-zone.left {
  background: linear-gradient(90deg, #c41e3a 0%, #8b1e3a 100%);
}

.end-zone.right {
  background: linear-gradient(90deg, #8b1e3a 0%, #c41e3a 100%);
}

.end-zone-label {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-size: 0.7rem;
}

.field {
  flex: 1;
  background: linear-gradient(to right, #4ade80 0%, #22c55e 25%, #16a34a 75%, #15803d 100%);
  position: relative;
  border-left: 2px solid white;
  border-right: 2px solid white;
}

.yard-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: white;
  opacity: 0.8;
}

.yard-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.ball-position-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 3px;
  background: #000000;
  opacity: 0.9;
  z-index: 2;
  margin: 0 auto;
}

.line-to-gain {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 3px;
  background: yellow;
  opacity: 0.9;
  z-index: 2;
  margin: 0 auto;
}

.direction-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
}

.direction-arrow.left {
  left: 10px;
}

.direction-arrow.right {
  right: 10px;
}

.arrow {
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: slide 1.5s infinite;
}

.direction-arrow.left .arrow {
  transform: scaleX(-1);
}


@keyframes slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.team {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.team-logo {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
  border: 2px solid #1e3c72;
  object-fit: contain;
  padding: 2px;
}

.team-logo.emoji {
  display: flex;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team-name {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.ranking {
  background: #1e3c72;
  color: white;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 1.8rem;
  text-align: center;
  line-height: 1;
}

.team-score {
  font-size: 2rem;
  font-weight: bold;
  color: #1e3c72;
}

.vs {
  font-weight: bold;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .games-list {
    width: 95%;
    padding: 1rem;
  }

  .game-card {
    padding: 1rem;
  }

  .teams-container {
    gap: 1rem;
  }

  .team {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .team-logo {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .team-name {
    font-size: 1rem;
  }

  .team-score {
    font-size: 1.5rem;
  }
}
</style>