const app = require("./src/app")
const connectDB  = require("./src/db/db")

const PORT = 1800
connectDB()


app.listen(PORT,()=>{
    console.log(`server  chal gya ${PORT}`)
})