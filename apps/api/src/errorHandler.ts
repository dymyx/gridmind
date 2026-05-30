import { NextFunction, Request, Response } from 'express'

export interface AppError extends Error {
	statusCode?: number
}

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.log(`[error] ${err.message}`, err.stack)

	const statusCode = err.statusCode || 500

	res.status(statusCode).json({
		success: false,
		status: statusCode,
		message: err.message || 'Внутреняя ошибка сервера'
	})
}
