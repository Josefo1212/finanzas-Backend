import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuarios.js';

const RefreshToken = sequelize.define('refresh_tokens', {
  id_refresh_token: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },

},
{
  tableName: 'refresh_tokens',
  timestamps: false,
}
);

export default RefreshToken;
