import app from "./app.js";
import  sequelize  from "./config/database.js";

let port = process.env.PORT || 3000;

async function main(){
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida exitosamente.");
        app.listen(port, () => {
            console.log(`El servidor está corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
}

main();
