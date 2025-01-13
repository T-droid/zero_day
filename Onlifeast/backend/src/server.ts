import app from "./app";
import "dotenv/config.js";

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server connected running on port ${PORT}`);
})