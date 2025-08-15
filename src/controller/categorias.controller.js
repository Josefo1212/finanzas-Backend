import sequelize from 'sequelize';
import Categoria from '../model/categorias.js';
import Usuario from '../model/usuarios.js';

export const getCategorias = async (req, res) => {
    try {
        const usuarioId = req.user?.id_usuario; // Asume que el id del usuario está en req.user

        // 1. Categorías propias del usuario
        const categoriasUsuario = await Categoria.findAll({
            where: {
                usuario_id: usuarioId,
                eliminada: false
            }
        });

        // 2. Categorías predefinidas NO personalizadas/eliminadas por el usuario
        // Buscar ids de categorías predefinidas que el usuario haya personalizado o eliminado
        const categoriasPersonalizadas = await Categoria.findAll({
            where: {
                usuario_id: usuarioId
            },
            attributes: ['nombre_categoria']
        });
        const nombresPersonalizados = categoriasPersonalizadas.map(cat => cat.nombre_categoria);

        const categoriasPredefinidas = await Categoria.findAll({
            where: {
                usuario_id: null,
                eliminada: false,
                nombre_categoria: {
                    [sequelize.Op.notIn]: nombresPersonalizados
                }
            }
        });

        // Unir ambas listas
        const categorias = [...categoriasUsuario, ...categoriasPredefinidas];

        return res.status(200).json(categorias);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return res.status(500).json({ message: "Error al obtener categorías." });
    }
};