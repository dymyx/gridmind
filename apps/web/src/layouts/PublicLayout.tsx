import type { ReactNode } from 'react'

function PublicLayout({ children }: { children?: ReactNode }) {
	return (
		<div>
			<header>ist header</header>
			<div>{children}</div>
		</div>
	)
}

export default PublicLayout
