export interface Race {
	id: string
	round: number
	season: number
	name: string
	circuit: string
	country: string
	date: Date
	status: 'upcoming' | 'live' | 'finished'
}

export interface Score {
	id: string
	prediction_id: string
	user_id: string
	race_id: string
	league_id: string
	points: number
	calculated_at: Date
}

export interface Prediction {
	id: string
	user_id: string
	race_id: string
	p1: string
	p2: string
	p3: string
	pole: string
	fastest_lap: string
	safety_car: boolean
	dnf: boolean
	constructor_team: string
}

export interface League {
	id: string
	name: string
	invite_code: string
	owner_id: string
	is_public: boolean
	created_at: Date
}

export interface User {
	id: string
	login: string
	username: string
	created_at: Date
}

export interface UserWithPassword extends User {
	password_hash: string
}
