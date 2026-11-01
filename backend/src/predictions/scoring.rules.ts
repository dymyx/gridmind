export type PredictionResultLike = {
	id: string;
	driver_id: string;
	predicted_position: number;
}

export type ScoredResult = {
	id: string;
	actual_position: number | null;
	points: number;
}


const POINTS_BY_DIFF: Record<number, number> = {0: 10, 1: 5};

export function scorePredictionResult(
	predicted: PredictionResultLike,
	actualByDriver: Map<string, number>
): ScoredResult {
	const actual = actualByDriver.get(predicted.driver_id) ?? null

	if (actual === null) {
		return { id: predicted.id, actual_position: null, points: 0 };
	}

	const diff = Math.abs(actual - predicted.predicted_position);
	return {
    id: predicted.id,
    actual_position: actual,
    points: POINTS_BY_DIFF[diff] ?? 0,
  };
}
