import jwt from 'jsonwebtoken'

class AuthService {
	login(res, id) {
		const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '1h' })

		res.cookie('jwt', token)
	}

	verify(req) {
		const token = req.cookies.jwt

		return jwt.verify(token, process.env.SECRET)
	}
}

export default new AuthService()