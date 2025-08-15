import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuarios.js';
import Categoria from './categorias.js';

const Presupuesto = sequelize.define('presupuestos', {
  id_presupuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monto_estimado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
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
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id_categoria',
    },
  },
},
{
  tableName: 'presupuestos',
  timestamps: false,
}
);

export default Presupuesto;
