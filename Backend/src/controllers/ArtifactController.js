/** @module ArtifactController - Контроллер для управления артефактами */
import ArtifactService from '../services/ArtifactService.js'

class ArtifactController {
	/** Получение конкретного артефакта */
	async get(req, res) {
		try {
			const userId = global?.currentUser?._id
			const artifact = await ArtifactService.artifacts.get(req.params.id, userId)

			if (!artifact) {
				return res.status(404).json({ message: 'Артефакт не найден' })
			}

			res.status(200).json(artifact)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении артефакта' })
		}
	}

	/** Список всех артефактов текущего пользователя */
	async list(req, res) {
		try {
			const userId = global?.currentUser?._id
			const artifacts = await ArtifactService.artifacts.list(userId)

			res.status(200).json(artifacts)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка артефактов' })
		}
	}

	/** Кристаллизация артефакта из размышления */
	async create(req, res) {
		try {
			const userId = global?.currentUser?._id
			const artifact = await ArtifactService.artifacts.create(userId, req.body)

			res.status(201).json(artifact)
		} catch (e) {
			res.status(500).json({
				message: 'Ошибка при кристаллизации артефакта',
				error: e.message,
			})
		}
	}

	/** Обновление артефакта */
	async update(req, res) {
		try {
			const userId = global?.currentUser?._id
			const artifactId = req.params.id

			const artifact = await ArtifactService.artifacts.update(artifactId, userId, req.body)

			if (!artifact) {
				return res.status(404).json({ message: 'Артефакт не найден или нет доступа' })
			}

			res.status(200).json(artifact)
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при обновлении', error: e.message })
		}
	}

	/** Удаление артефакта (де-кристаллизация) */
	async remove(req, res) {
		try {
			const userId = global?.currentUser?._id
			const artifactId = req.params.id

			const result = await ArtifactService.artifacts.remove(artifactId, userId)

			if (!result) {
				return res.status(404).json({ message: 'Артефакт не найден' })
			}

			res.status(200).json({
				success: true,
				message: 'Артефакт удален, источник разблокирован',
				id: artifactId,
			})
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при удалении', error: e.message })
		}
	}
}

export default new ArtifactController()
