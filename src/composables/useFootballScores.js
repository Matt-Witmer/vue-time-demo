import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export function useFootballScores() {
  const isGameDay = ref(false)
  const games = ref([])
  const loading = ref(false)
  const error = ref(null)
  const rankings = ref({})

  const fetchRankings = async () => {
    try {
      // Fetch College Football rankings
      const collegeRankingsResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FootballScoresApp/1.0)'
        }
      })

      const rankingsMap = {}

      if (collegeRankingsResponse.data.rankings?.[0]?.ranks) {
        collegeRankingsResponse.data.rankings[0].ranks.forEach(rank => {
          if (rank.team?.displayName && rank.current <= 25) {
            rankingsMap[rank.team.displayName.toLowerCase()] = rank.current
          }
        })
      }

      rankings.value = rankingsMap
    } catch (err) {
      console.error('Error fetching rankings:', err)
      rankings.value = {}
    }
  }

  const fetchScores = async () => {
    try {
      loading.value = true
      error.value = null

      // Fetch rankings first if not already fetched
      if (Object.keys(rankings.value).length === 0) {
        await fetchRankings()
      }

      // Fetch College Football scores from ESPN API
      const collegeResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard', {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FootballScoresApp/1.0)'
        }
      })
      const collegeGames = collegeResponse.data.events || []

      // Fetch NFL scores from ESPN API
      const nflResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FootballScoresApp/1.0)'
        }
      })
      const nflGames = nflResponse.data.events || []

      // Combine and process games
      const allGames = [...collegeGames, ...nflGames]

      const processedGames = allGames
        .filter(event => event.status?.type?.state === 'in') // Only live games
        .map(event => {
          const competition = event.competitions?.[0]
          if (!competition) return null

          const homeTeam = competition.competitors?.find(t => t.homeAway === 'home')
          const awayTeam = competition.competitors?.find(t => t.homeAway === 'away')

          if (!homeTeam || !awayTeam) return null

          const homeTeamName = homeTeam.team?.displayName || 'Unknown'
          const awayTeamName = awayTeam.team?.displayName || 'Unknown'

          return {
            id: event.id,
            awayTeam: {
              name: awayTeamName,
              score: parseInt(awayTeam.score) || 0,
              logo: homeTeam.team?.logo || '🏈',
              ranking: rankings.value[awayTeamName.toLowerCase()] || null
            },
            homeTeam: {
              name: homeTeamName,
              score: parseInt(homeTeam.score) || 0,
              logo: awayTeam.team?.logo || '🏈',
              ranking: rankings.value[homeTeamName.toLowerCase()] || null
            },
            timeLeft: event.status?.displayClock || '0:00',
            quarter: event.status?.period || 1,
            status: 'in_progress'
          }
        })
        .filter(Boolean) // Remove null entries

      isGameDay.value = processedGames.length > 0
      games.value = processedGames

    } catch (err) {
      error.value = err.message
      console.error('Error fetching football scores:', err)
      // Fallback to no games on error
      isGameDay.value = false
      games.value = []
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
    // Update every 60 seconds to avoid rate limiting
    interval = setInterval(updateScores, 60000)
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