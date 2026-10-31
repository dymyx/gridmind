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

export interface ICreatedPredictionDto {
  race_id: string;
  predicts: {
    driverId: string;
    pos: number;
  }[];
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

export interface IUsersGlobalStanding {
  user_id: string;
  points: number;
  predictions: number;
  correct: number;
  number: number;
  username: string;
}

export interface IUserSeasonStanding extends IUsersGlobalStanding {
  season_id: string;
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

export interface IPredictionResult {
  id: string;
  prediction_id: string;
  driver_id: string;
  predicted_position: number;
  actual_position: number | null;
  points: number;
  driver: IDriver;
}

export interface IUserPrediction {
  id: string;
  user_id: string;
  race_id: string;
  createdAt: Date;
  scoredAt: Date;
  results: IPredictionResult[] | null;
}

export interface ITopPredictions {
  id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
  };
  race_id: string;
  createdAt: Date;
  scoredAt: Date;
  total_points: number;
}
