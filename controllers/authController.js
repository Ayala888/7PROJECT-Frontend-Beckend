
const bcrypt = require('bcrypt');
const generateToken = require('../utilits/generateToken');
const { getUserByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'Барлық өрісті толтырыңыз' });

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: 'Email тіркелген' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPassword);

    res.status(201).json({ message: 'Тіркелу сәтті өтті' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user)
      return res.status(400).json({ message: 'Қате email немесе пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Қате email немесе пароль' });

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Сервер қатесі' });
  }
};

module.exports = { register, login };

