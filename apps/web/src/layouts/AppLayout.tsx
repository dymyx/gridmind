import type { ReactNode } from 'react'

function AppLayout({ children }: { children?: ReactNode }) {
	return (
		<div>
			<header>ist header but private</header>
			<div>{children}</div>
		</div>
	)
}

export default AppLayout
