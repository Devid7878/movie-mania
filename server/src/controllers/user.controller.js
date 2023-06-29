import userModel from '../models/user.model.js';
import jsonwebtoken from 'jsonwebtoken';
import responseHandler from '../handlers/response.handler.js';
import 'dotenv/config';

const signup = async (req, res) => {
	try {
		const { username, password, displayName } = req.body;

		const checkUser = await userModel.findOne({ username });

		if (checkUser)
			return responseHandler.badrequest(res, 'username already used');

		const user = new userModel();

		user.displayName = displayName;
		user.username = username;
		user.setPassword(password);

		await user.save();

		const token = jsonwebtoken.sign(
			{ data: user.id },
			process.env.TOKEN_SECRET_KEY,
			{ expiresIn: '24h' },
		);

		responseHandler.created(res, {
			token,
			...user._doc,
			id: user.id,
		});
	} catch {
		responseHandler.error(res);
	}
};

const signin = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await userModel
			.findOne({ username })
			.select('username password salt id displayName');
		// console.log(user);
		if (!user) return responseHandler.badrequest(res, 'User not exist');

		if (!user.validPassword(password))
			return responseHandler.badrequest(res, 'Wrong password');

		const token = jsonwebtoken.sign(
			{ data: user.id },
			process.env.TOKEN_SECRET_KEY,
			{
				expiresIn: '24h',
			},
		);

		// console.log(token);
		user.password = undefined;
		user.salt = undefined;

		responseHandler.created(res, {
			token,
			...user._doc,
			id: user.id,
		});
	} catch {
		responseHandler.error(res);
	}
};

const updatePassword = async (req, res) => {
	try {
		const { password, newPassword } = req.body;
		console.log(password, newPassword);
		const user = await userModel
			.findById(req.user.id)
			.select('password id salt');

		console.log(user, 'From update password');
		if (!user) return responseHandler.unauthorize(res);

		if (!user.validPassword(password))
			return responseHandler.badrequest(res, 'Wrong password');

		user.setPassword(newPassword);

		await user.save();

		responseHandler.ok(res);
	} catch {
		responseHandler.error(res);
	}
};

const getInfo = async (req, res) => {
	try {
		const user = await userModel.findById(req.user.id);

		if (!user) return responseHandler.notfound(res);

		responseHandler.ok(res, user);
	} catch {
		responseHandler.error(res);
	}
};

export default {
	signup,
	signin,
	getInfo,
	updatePassword,
};