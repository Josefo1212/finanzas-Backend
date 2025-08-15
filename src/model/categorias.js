import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuarios.js';

const Categoria = sequelize.define('categorias', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nombre_categoria: {
    type: DataTypes.STRING,
    allowNull: false,
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
  tableName: 'categorias',
  timestamps: false,
}
);

export default Categoria;
