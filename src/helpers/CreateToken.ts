import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserType } from './enums';

dotenv.config();

const secretKey: string = process.env.TOKEN_SECRET_KEY! || 'supersecretkey';

interface TokenPayload {
	first_name: string;
	last_name: string;
	id: string;
	type: UserType;
}

// {
//     "first_name": "Dennis",
//     "last_name": "Koech",
//     "id": "5552dbbd-b005-44ce-a54a-f924bbb5848f",
//     "type": 1,
//     "iat": 1685006419,
//     "exp": 1687598419
// }

export const CreateToken = async (
	tokenObject: TokenPayload
): Promise<string> => {
	try {
		const userToken: string = jwt.sign(tokenObject, secretKey, {
			expiresIn: '30d',
		});

		return userToken;
	} catch (err) {
		//console.log(err.message);
		throw err;
	}
};

export const VerifyToken = async (token: string): Promise<boolean> => {
	try {
		const isValid = await jwt.verify(token, secretKey);
		console.log(isValid);
		return !!isValid;
	} catch (err) {
		return false;
	}
};

export interface CustomRequest extends Request {
	payload: JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization
			? req.headers?.authorization!.split(' ')[1]
			: '';
		if (!token) {
			return res
				.status(401)
				.json({ message: 'Please pass authentication token' });
		}

		jwt.verify(token, secretKey, function (error, decoded: any) {
			if (error) {
				return res.status(401).json(error);
			}
			if (decoded) {
				(req as CustomRequest).payload = decoded;
			}
		});
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
