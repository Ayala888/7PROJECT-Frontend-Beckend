const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv')


const authRoutes = require('./routes/authRoutes');
const requestLimit = require('./middlewares/requestLimit');
const homeRoutes = require('./routes/homeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');



dotenv.config()
const app = express()

app.use(cors({
    origin:'https://roomtap.netlify.app'
}))

app.use('/uploads', express.static('uploads'));
app.use(express.json())
app.use(helmet())
app.use(requestLimit);

const PORT = process.env.PORT || 3000



app.use('/api/', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/', profileRoutes);
app.use('/api/favorites', favoriteRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

