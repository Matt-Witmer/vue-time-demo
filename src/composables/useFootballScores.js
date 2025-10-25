import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export function useFootballScores() {
  const isGameDay = ref(false)
  const games = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchScores = async () => {
    try {
      loading.value = true
      error.value = null

      // For demo purposes, we'll simulate some live games
      // In a real implementation, you'd use an actual API like ESPN API or sportsdata.io
      const mockGames = [
        {
          id: 1,
          awayTeam: { name: 'Alabama', score: 24, logo: '🏈' },
          homeTeam: { name: 'Georgia', score: 21, logo: '🏈' },
          timeLeft: '12:34',
          quarter: 3,
          status: 'in_progress'
        },
        {
          id: 2,
          awayTeam: { name: 'Ohio State', score: 17, logo: '🏈' },
          homeTeam: { name: 'Michigan', score: 14, logo: '🏈' },
          timeLeft: '7:45',
          quarter: 2,
          status: 'in_progress'
        },
        {
          id: 3,
          awayTeam: { name: 'Kansas City Chiefs', score: 20, logo: '🏈' },
          homeTeam: { name: 'Buffalo Bills', score: 17, logo: '🏈' },
          timeLeft: '3:21',
          quarter: 4,
          status: 'in_progress'
        }
      ]

      // Check if there are any games in progress
      const gamesInProgress = mockGames.filter(game => game.status === 'in_progress')
      isGameDay.value = gamesInProgress.length > 0
      games.value = gamesInProgress

    } catch (err) {
      error.value = err.message
      console.error('Error fetching football scores:', err)
    } finally {
      loading.value = false
    }
  }

  const updateScores = () => {
    fetchScores()
  }

  let interval

  onMounted(() => {
    fetchScores()
    // Update every 30 seconds
    interval = setInterval(updateScores, 30000)
  })

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval)
    }
  })

  return {
    isGameDay,
    games,
    loading,
    error,
    updateScores
  }
}