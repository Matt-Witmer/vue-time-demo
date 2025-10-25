<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
  <div class="time-container">
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
</style>