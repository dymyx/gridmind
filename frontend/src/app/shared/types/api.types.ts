export interface ILoginDto {
  username: string;
  password: string;
}

export interface IRegisterDto {
  username: string;
  password: string;
  favoriteDriverId: string | null;
  favoriteTeamId: string | null;
}

export interface IAuthResponse {
  accessToken: string;
}

export interface IDriver {
  id: string;
  first_name: string;
  last_name: string;
  number: number;
  country: string;
  birth_date: Date;
  image_url: string;

  standing?: IDriverStanding;
}

export interface ITeam {
  id: string;
  name: string;
  principal: string;
  color: string;

  standing?: ITeamStanding;
}

export interface IDriverStanding {
  season_id: string;
  driver_id: string;
  team_id: string;
  points: number;
  wins: number;
  position: number;
  driver: IDriver;
  team: ITeam;
}

export interface ITeamStanding {
  season_id: string;
  team_id: string;
  points: number;
  wins: number;
  position: number;
  team: ITeam;
}

export interface IRace {
  id: string;
  season_id: string;
  round: number;
  circuit_id: string;
  raceName: string;
  raceDate: string;
  status: string;
  circuit: ICircuit;

  winnerId: string | null;
  winner?: IDriver;

  poleID: string;
  pole_winner?: IDriver;
  pole_time?: string;

  qualifyings: IQualifying[];
}

export interface ICircuit {
  id: string;
  name: string;
  country: string;
  city: string;
}

export interface IQualifying {
  id: string;
  race_id: string;
  driver_id: string;
  position: number;
  time: string;
  driver: IDriver;
}

export interface IUser {
  id: string;
  username: string;
  createdAt: Date;
  favoriteDriver: IDriver;
  favoriteTeam: ITeam;
  userStats: any;
}
