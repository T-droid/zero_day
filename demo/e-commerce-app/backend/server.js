import app from "./app.js";
import 'dotenv/config';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server connected listening on port ${PORT}`);
});