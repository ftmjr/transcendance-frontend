import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import { UserSearchResult } from 'Auth'
import { AxiosError } from 'axios'

export interface Suggestion {
  icon: string
  title: string
  url: { name: string; params?: object }
}

interface SuggestionGroupContent extends Suggestion {
  category: string
}

export interface SuggestionGroup {
  title: string
  content: Suggestion[]
}

export type SearchItem = {
  id: number | string
  url: { name: string; params?: object }
  icon: string
  title: string
  category: string
}

export type SearchHeader = {
  header: string
  title: string
}

interface SearchBarState {
  suggestions: SuggestionGroupContent[]
  noDataSuggestions: Suggestion[]
  searchResults: Array<SearchItem | SearchHeader>
  loading: boolean
}

const useSearchBarStore = defineStore({
  id: 'searchBar',
  state: (): SearchBarState => ({
    suggestions: [
      {
        icon: 'tabler-chart-donut',
        title: "Tableau de bord d'analyse",
        url: { name: 'dashboard' },
        category: 'Recherches populaires'
      },
      {
        icon: 'tabler-users',
        title: "Liste d'utilisateur",
        url: { name: 'dashboard' },
        category: 'Recherches populaires'
      },
      { icon: 'noto-v1:game-die', title: 'Jeu rapide', url: { name: 'game' }, category: 'Jeu' },
      {
        icon: 'grommet-icons:group',
        title: 'Compétitions',
        url: { name: 'game' },
        category: 'Jeu'
      },
      {
        icon: 'solar:ranking-linear',
        title: 'Leader Board',
        url: { name: 'dashboard' },
        category: 'Jeu'
      },
      {
        icon: 'tabler-settings',
        title: 'Paramètres du compte',
        url: { name: 'settings' },
        category: 'Profile'
      },
      {
        icon: 'tabler-calendar',
        title: 'Historique',
        url: { name: 'history' },
        category: 'Profile'
      },
      { icon: 'bxs:contact', title: 'Mes Contacts', url: { name: 'friends' }, category: 'Profile' },
      {
        icon: 'tabler-lock',
        title: 'Sécurité',
        url: { name: 'settings', params: { tab: 'security' } },
        category: 'Profile'
      }
    ],
    noDataSuggestions: [
      {
        title: 'Tableau de bord',
        icon: 'tabler-chart-donut',
        url: { name: 'dashboard' }
      },
      {
        title: 'Paramètres du compte',
        icon: 'tabler-user',
        url: { name: 'settings' }
      }
    ],
    searchResults: [],
    loading: false
  }),
  getters: {
    getSuggestionGroups(): SuggestionGroup[] {
      return this.suggestions.reduce(
        (acc: SuggestionGroup[], suggestion: SuggestionGroupContent) => {
          const group = acc.find((group) => group.title === suggestion.category)
          if (group) {
            group.content.push(suggestion)
          } else {
            acc.push({
              title: suggestion.category,
              content: [suggestion]
            })
          }
          return acc
        },
        []
      )
    },
    getNoDataSuggestions(): Suggestion[] {
      return this.noDataSuggestions
    },
    getSearchResults(): Array<SearchItem | SearchHeader> {
      return this.searchResults
    },
    isLoading(): boolean {
      return this.loading
    }
  },
  actions: {
    async search(query: string) {
      this.loading = true
      if (query.length > 0) {
        const results = await Promise.all([
          this.searchForUser(query),
          this.searchForCompetition(query),
          this.searchInPagesSuggestions(query)
        ])
        this.searchResults = results.flat()
      } else {
        this.searchResults = []
      }
      this.loading = false
    },
    async searchForUser(searchTerm: string): Promise<Array<SearchItem | SearchHeader>> {
      try {
        const { data } = await axios.post('users/search', searchTerm, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const header = { header: 'users', title: 'Utilisateurs' }
        const users = data as Array<UserSearchResult>
        return [
          header,
          ...users.map((user) => ({
            id: user.id,
            url: { name: 'profile', params: { id: user.id } },
            icon: user.avatar,
            title: `${user.name} ${user.lastname}`,
            category: header.title
          }))
        ]
      } catch (error: AxiosError | any) {
        return []
      }
    },
    async searchForCompetition(searchTerm: string): Promise<Array<SearchItem | SearchHeader>> {
      try {
        const { data } = await axios.post('competition/search', searchTerm, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const header = { header: 'competition', title: 'Compétitions' }
        const competitions = data as Array<{
          id: number
          name: string
        }>
        return [
          header,
          ...competitions.map((competition) => ({
            id: competition.id,
            url: { name: 'competition', params: { id: competition.id } },
            icon: 'tabler:trophy',
            title: competition.name,
            category: header.title
          }))
        ]
      } catch (e) {
        return []
      }
    },
    async searchInPagesSuggestions(searchTerm: string): Promise<Array<SearchItem | SearchHeader>> {
      const suggestionsMatched = this.suggestions.filter((suggestion: SuggestionGroupContent) =>
        suggestion.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return suggestionsMatched.reduce(
        (acc: Array<SearchItem | SearchHeader>, suggestion: SuggestionGroupContent) => {
          const header = acc.find((item) => item?.header === suggestion.category)
          if (!header) {
            acc.push({
              header: suggestion.category,
              title: suggestion.category
            })
          }
          acc.push({
            id: suggestion.title,
            url: suggestion.url,
            icon: suggestion.icon,
            title: suggestion.title,
            category: suggestion.category
          })
          return acc
        },
        []
      )
    }
  }
})

export default useSearchBarStore
