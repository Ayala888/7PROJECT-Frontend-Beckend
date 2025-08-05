
const pool = require('../config/db')

class profileController {
    async getUsers(req, res) {
        const { sort = 'asc' } = req.query
        
            try {
                const result = await pool.query(`select * from users order by username ${sort}`)
                res.status(200).json(result.rows)
            } catch (e) {
                return res.status(500).json({ error: e.message })
            } 
    }

    async getProfileById(req, res) {
        const { id } = req.params
        
            if (!id) {
                return res.status(400).json('ID берілмеді')
            }
        
            try {
                const result = await pool.query(
                    'select id, username from users where id=$1', [id]
                )
        
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Пайдаланушы табылмады' })
                }
        
                res.status(200).json({ user: result.rows[0] })
            } catch {
                return res.status(500).json({ error: e.message })
            }
    }

    async getProfile(req, res) {
        const userId = req.user.id

        try {
            const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId])
            const user = result.rows[0]

            if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' })
            }

            res.json(user)
        } catch (error) {
            console.error('Ошибка при получении профиля:', error)
            res.status(500).json({ message: 'Внутренняя ошибка сервера' })
        }
    }

    async getUserHomes (req, res) {
      const userId = req.user.id;
    
      try {
        const result = await pool.query('SELECT * FROM homes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
      } catch (error) {
        console.error('Пайдаланушы үйлерін алу қатесі:', error);
        res.status(500).json({ message: 'Қате орын алды' });
      }
    };
    


    async updateProfile(req, res) {
        const userId = req.user.id;
        const { username, email, password } = req.body;
    
        if (!username && !email && !password) {
          return res.status(400).json({ message: 'Ештеңе өзгертілмеген' });
        }
    
        try {
          const fields = [];
          const values = [];
          let paramIndex = 1;
    
          if (username) {
            fields.push(`username = $${paramIndex++}`);
            values.push(username);
          }
    
          if (email) {
            fields.push(`email = $${paramIndex++}`);
            values.push(email);
          }
    
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push(`password = $${paramIndex++}`);
            values.push(hashedPassword);
          }
    
          values.push(userId);
    
          const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, email`;
          const result = await pool.query(query, values);
    
          res.status(200).json({ message: 'Профиль сәтті жаңартылды', user: result.rows[0] });
        } catch (error) {
          console.error('Профильді жаңарту қатесі:', error);
          res.status(500).json({ message: 'Сервер қатесі' });
        }
      }


}

module.exports = new profileController()