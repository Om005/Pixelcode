import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectdb from "./config/mongodb.js"
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js"
import fileRouter from "./routes/fileRoutes.js"
import chatRouter from "./routes/chatRouter.js"

const app = express();
const port = process.env.PORT || 4000
connectdb();

const allowedOrigins = ['https://pixelcode.vercel.app']
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))


app.get('/', (req, res)=>{
    res.send("API is Working")
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/file', fileRouter)
app.use('/api/chat', chatRouter)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
