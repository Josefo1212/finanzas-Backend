import Sequelize from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../model/usuarios.js";
import RefreshToken from "../model/refresh_tokens.js";

dotenv.config();

// Elimina todos los refresh tokens expirados
const cleanExpiredRefreshTokens = async () => {
    await RefreshToken.destroy({
        where: {
            expires_at: { [Sequelize.Op.lt]: new Date() }
        }
    });
};

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validaciones de longitud
        if (username.length < 3 || username.length > 32) {
            return res.status(400).json({
                message: "El nombre de usuario debe tener entre 3 y 32 caracteres."
            });
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).json({
                message: "La contraseña debe tener entre 8 y 15 caracteres."
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { username } });
        if (usuarioExistente) {
            return res.status(409).json({
                message: "El nombre de usuario ya está en uso."
            });
        }

        // Crear usuario con contraseña hasheada
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({username,password: hashedPassword});

        return res.status(201).json({
            message: "Usuario registrado exitosamente.",
            user: newUser
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({
            message: "Error al registrar usuario."
        });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Limpiar tokens expirados antes de crear uno nuevo
        await cleanExpiredRefreshTokens();

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Contraseña incorrecta."
            });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Generar refresh token (puedes usar una cadena aleatoria o JWT)
        const refreshTokenValue = jwt.sign(
            { id: usuario.id_usuario },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Guardar refresh token en la base de datos
        await RefreshToken.create({
            usuario_id: usuario.id_usuario,
            refresh_token: refreshTokenValue,
            expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 día desde ahora
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            token,
            refreshToken: refreshTokenValue
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({
            message: "Error al iniciar sesión."
        });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        // Eliminar el refresh token de la base de datos
        await RefreshToken.destroy({ where: { refresh_token: refreshToken } });
        return res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return res.status(500).json({ message: "Error al cerrar sesión." });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        // Buscar el refresh token en la base de datos
        const tokenRecord = await RefreshToken.findOne({ where: { refresh_token: refreshToken } });

        if (!tokenRecord) {
            return res.status(401).json({ message: "Refresh token inválido." });
        }

        // Verificar expiración
        if (tokenRecord.expires_at < new Date()) {
            // Eliminar el token expirado
            await RefreshToken.destroy({ where: { refresh_token: refreshToken } });
            return res.status(401).json({ message: "Refresh token expirado." });
        }

        // Verificar el refresh token (firma)
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Refresh token inválido." });
        }

        // Generar nuevo JWT
        const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        return res.status(200).json({
            message: "Token renovado exitosamente.",
            token: newToken
        });
    } catch (error) {
        console.error("Error al renovar token:", error);
        return res.status(500).json({ message: "Error al renovar token." });
    }
};