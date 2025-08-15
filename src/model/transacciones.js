import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuarios.js';
import Categoria from './categorias.js';

const Transaccion = sequelize.define('transacciones', {
  id_transaccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id_categoria',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },

},
{
  tableName: 'transacciones',
  timestamps: false,
}
);

export default Transaccion;
