const pool = require('../config/db');


const createPost = async (req, res) => {
  const userId = req.user.id;
  const { rooms, city, district, price, description, phone } = req.body;
  const imagePaths = req.files?.map(file => file.filename) || [];


  if (!phone) {
    return res.status(400).json({ message: 'Байланыс номеріңізді енгізіңіз' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO homes (user_id, rooms, city, district, price, description, images, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, rooms, city, district, price, description, imagePaths, phone]
    );

    res.status(201).json({ message: 'Үй сәтті қосылды', home: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};


const getPost = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.id, h.rooms, h.city, h.district, h.price, h.created_at, h.images
      FROM homes h
      ORDER BY h.created_at DESC
    `);

    const homes = result.rows.map(home => ({
      ...home,
      images: home.images.map(img => `http://localhost:3000/uploads/${img}`)
    }));

    res.status(200).json(homes);
  } catch (err) {
    console.error('Қате:', err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};


const searchPosts = async (req, res) => {
  const { search } = req.query;

  try {
    const result = await pool.query(
      `SELECT h.id, h.rooms, h.city, h.district, h.price, h.created_at, h.images
       FROM homes h
       WHERE
         LOWER(h.city) LIKE LOWER($1) OR
         LOWER(h.district) LIKE LOWER($1) OR
         CAST(h.rooms AS TEXT) LIKE $1
       ORDER BY h.created_at DESC`,
      [`%${search}%`]
    );

    const homes = result.rows.map(home => ({
      ...home,
      images: home.images
    }));

    res.status(200).json(homes);
  } catch (err) {
    console.error('Іздеу қатесі:', err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};



const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT homes.*, users.username 
       FROM homes 
       JOIN users ON homes.user_id = users.id 
       WHERE homes.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Үй табылмады' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};



const updatePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { rooms, city, district, price, description, phone } = req.body;

  try {
    const result = await pool.query(
      `UPDATE homes
       SET rooms = $1, city = $2, district = $3, price = $4, description = $5, phone = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [rooms, city, district, price, description, phone, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Жазба табылмады немесе сіздің емес' });
    }

    res.json({ message: 'Жазба жаңартылды', home: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};


const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM homes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Жазба табылмады немесе сіздің емес' });
    }

    res.json({ message: 'Жазба өшірілді' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};



module.exports = {
  createPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
};


