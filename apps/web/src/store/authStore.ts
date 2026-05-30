import type { User } from '@gridmind/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	user: User | null
	token: string | null
	login: (user: User, token: string) => void
	logout: () => void
}

export const authStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			token: null,
			login: (user, token) => set({ user, token }),
			logout: () => set({ user: null, token: null })
		}),
		{ name: 'auth' }
	)
)
