export type ParsedResult = {
	driverId: string;
  teamId: string;
  position: number;
  points: number;
  status: string;
}

export interface RaceResultsProvider {
  fetchResults(raceId: string): Promise<ParsedResult[]>;
}

export const RESULTS_PROVIDER = Symbol('RESULTS_PROVIDER');
