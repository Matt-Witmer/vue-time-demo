<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFootballScores } from './composables/useFootballScores.js'

const { isGameDay, games, loading, error } = useFootballScores()
const currentTime = ref(new Date())

const updateTime = () => {
  currentTime.value = new Date()
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
    <h1 class="time-display">Loading...</h1>
  </div>
  <div v-else-if="error" class="time-container">
    <h1 class="time-display">Error: {{ error }}</h1>
  </div>
  <div v-else-if="isGameDay" class="scores-container">
    <div class="games-list">
      <div v-for="game in games" :key="game.id" class="game-card">
        <div class="game-header">
          <span class="quarter">Q{{ game.quarter }}</span>
          <span class="time-left">{{ game.timeLeft }}</span>
        </div>
        <div class="teams-container">
          <div class="team away">
            <div class="team-logo">{{ game.awayTeam.logo }}</div>
            <div class="team-info">
              <div class="team-name">{{ game.awayTeam.name }}</div>
              <div class="team-score">{{ game.awayTeam.score }}</div>
            </div>
          </div>
          <div class="vs">vs</div>
          <div class="team home">
            <div class="team-logo">{{ game.homeTeam.logo }}</div>
            <div class="team-info">
              <div class="team-name">{{ game.homeTeam.name }}</div>
              <div class="team-score">{{ game.homeTeam.score }}</div>
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
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3e5c99 100%);
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
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