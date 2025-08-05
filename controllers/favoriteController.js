const pool = require('../config/db');

const getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'SELECT homes.* FROM favorites JOIN homes ON favorites.home_id = homes.id WHERE favorites.user_id = $1',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Қате орын алды (getFavorites)' });
  }
};

const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const homeId = req.params.homeId;

  try {
    const exists = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND home_id = $2',
      [userId, homeId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Бұрыннан таңдаулыларда бар' });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, home_id) VALUES ($1, $2)',
      [userId, homeId]
    );
    res.json({ message: 'Таңдаулыларға қосылды' });
  } catch (err) {
    res.status(500).json({ message: 'Қате орын алды (addFavorite)' });
  }
};

const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const homeId = req.params.homeId;

  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND home_id = $2',
      [userId, homeId]
    );
    res.json({ message: 'Таңдаулылардан өшірілді' });
  } catch (err) {
    res.status(500).json({ message: 'Қате орын алды (removeFavorite)' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
