import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { authStore } from './store/authStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const token = authStore(s => s.token)
	return token ? (
		<>{children}</>
	) : (
		<Navigate
			to="/"
			replace
		/>
	)
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<PublicLayout />}>
						<Route
							path="/"
							element={<LandingPage />}
						/>
					</Route>
					<Route
						element={
							<PrivateRoute>
								<AppLayout />
							</PrivateRoute>
						}
					>
						<Route
							path="/home"
							element={<HomePage />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	)
}

export default App
