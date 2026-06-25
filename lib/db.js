import mariadb from "mariadb";

let pool;

export function hasDbConfig() {
  return Boolean(
    process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_NAME
  );
}

export function getPool() {
  if (!hasDbConfig()) {
    throw new Error("Konfigurasi database belum lengkap.");
  }

  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      connectionLimit: 5,
      timezone: "Z"
    });
  }

  return pool;
}

export async function query(sql, params = []) {
  const connection = await getPool().getConnection();

  try {
    return await connection.query(sql, params);
  } finally {
    connection.release();
  }
}

export async function withConnection(callback) {
  const connection = await getPool().getConnection();

  try {
    return await callback(connection);
  } finally {
    connection.release();
  }
}

export async function getDatabaseStatus() {
  if (!hasDbConfig()) {
    return {
      configured: false,
      connected: false,
      message: "Mode demo aktif. Isi .env untuk memakai MariaDB."
    };
  }

  try {
    await query("SELECT 1 AS ok");
    return {
      configured: true,
      connected: true,
      message: "MariaDB terhubung."
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      message: error.message
    };
  }
}
