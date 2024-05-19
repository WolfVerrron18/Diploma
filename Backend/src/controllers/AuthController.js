import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'

import UserService from '../services/UserService.js'

class AuthController {
	async login(req, res) {
		try {
			const user = await UserService.users.findByParameter('login', req.body.login)

			if (!user) throw new Error('User not found')

			const auth = await bcrypt.compare(req.body.password, user.password)

			if (!auth) throw new Error('Password invalid')

			global.currentUser = user

			const token = jwt.sign({ id: user._id }, process.env.SECRET, {
				expiresIn: '1h',
			})

			res.status(200).json({ AccessToken: token })
		} catch (e) {
			return res.status(404).json(e.message)
		}
	}

	async logout(req, res) {
		global.currentUser = {}

		res.status(200).json('LOGOUT')
	}

	async registration(req, res) {
		try {
			const foundUser = await UserService.users.findByParameter('login', req.body.login)

			if (foundUser) throw new Error('USER EXISTS')

			const user = await UserService.users.create(req.body)

			const token = jwt.sign({ id: user._id }, process.env.SECRET, {
				expiresIn: '1h',
			})

			res.status(200).json({ AccessToken: token, user })
		} catch (e) {
			return res.status(404).json({ error: e.message })
		}
	}
}

export default new AuthController()
