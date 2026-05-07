import multer from 'multer'

// Используем стандартное хранилище в памяти
const storage = multer.memoryStorage()

export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})
