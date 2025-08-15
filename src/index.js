import app from "./app.js";
import  sequelize  from "./config/database.js";
import Usuario from './model/usuarios.js';
import Categoria from "./model/categorias.js";
import Presupuesto from "./model/presupuestos.js";
import Transaccion from "./model/transacciones.js";
import RefreshToken from "./model/refresh_tokens.js";

let port = process.env.PORT || 3000;

Usuario.hasMany(Categoria, { foreignKey: 'usuario_id' });
Categoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Presupuesto, { foreignKey: 'usuario_id' });
Presupuesto.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Categoria.hasMany(Presupuesto, { foreignKey: 'categoria_id' });
Presupuesto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Usuario.hasMany(Transaccion, { foreignKey: 'usuario_id' });
Transaccion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Categoria.hasMany(Transaccion, { foreignKey: 'categoria_id' });
Transaccion.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Usuario.hasMany(RefreshToken, { foreignKey: 'usuario_id' });
RefreshToken.belongsTo(Usuario, { foreignKey: 'usuario_id' });

async function main(){
    try {
        await sequelize.sync({force:false});
        console.log("Conexión a la base de datos establecida exitosamente.");
        app.listen(port, () => {
            console.log(`El servidor está corriendo en el puerto.${port}`);
        });
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
}

main();
