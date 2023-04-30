import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';

export const register = async (req, res, next) => {
	if (!req.body.name || !req.body.email || !req.body.password) {
		return next(
			createError({ status: 401, message: 'Name, email, password is required' })
		);
	}

	try {
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(req.body.password, salt);

		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});
		await newUser.save();

		return res.status(201).json({
			error: false,
			message: 'New user created successfully',
		});
	} catch (e) {
		return next(createError({ status: 400, message: 'Error creating user' }));
	}
};
export const login = async (req, res, next) => {
	if (!req.body.email || !req.body.password) {
		return next(
			createError({ status: 400, message: 'Email, password is required' })
		);
	}

	try {
		const user = await User.findOne({ email: req.body.email }).select(
			'name email password'
		);
		if (!user) {
			return next(createError({ status: 404, message: 'User not found' }));
		}

		const isPasswordCorrect = await bcryptjs.compare(
			req.body.password,
			user.password
		);
		if (!isPasswordCorrect) {
			return next(createError({ status: 400, message: 'Incorrect Password' }));
		}
		// Create cookie for the FE
		const payload = {
			id: user._id,
			name: user.name,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		return res
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.status(200)
			.json({
				message: 'Login successfully',
				error: false,
			});
	} catch (e) {
		return next(createError({ status: 400, message: 'Login Failed' }));
	}
};

export const logout = async (req, res) => {
	res.clearCookie('access_token');
	return res.status(200).json({ message: 'logout success' });
};

export const isLoggedIn = async (req, res) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.json(false);
	}

	return jwt.verify(token, process.env.JWT_SECRET, err => {
		if (err) {
			return res.json(false);
		} else {
			return res.json(true);
		}
	});
};
