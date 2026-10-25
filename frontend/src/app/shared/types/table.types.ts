export interface IDriverRow {
  number: number;
  driver: string;
  team: string | undefined;
  points: number;
  wins: number;
}

export interface ITeamRow {
  number: number;
  principal: string | undefined;
  team: string | undefined;
  points: number;
  wins: number;
}
