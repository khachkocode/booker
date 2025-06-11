const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        console.log('Перевірка прав адміністратора. userId:', req.userId);
        const user = await User.findById(req.userId);
        console.log('Знайдений користувач:', user);
        
        if (!user) {
            console.log('Користувача не знайдено');
            return res.status(403).json({ message: 'Користувача не знайдено' });
        }
        
        if (user.role !== 'admin') {
            console.log('Користувач не є адміністратором. Роль:', user.role);
            return res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміністратора.' });
        }
        
        console.log('Права адміністратора підтверджено');
        next();
    } catch (error) {
        console.error('Помилка при перевірці прав адміністратора:', error);
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
}; 