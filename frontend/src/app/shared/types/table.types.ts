interface IRow {
  number: number;
  team: string | undefined;
  points: number;
  wins: number;
}

export interface IDriverRow extends IRow {
  driver: string;
}

export interface ITeamRow extends IRow {
  principal: string | undefined;
}

export interface IUserRow {
  number: number;
  username: string;
  points: number;
  predictions: number;
  correct: number;
}

export interface IResultRow {
  number: number;
  driver: string;
  team: string;
  status: string;
  points: number;
  team_color: string;
}
