const spicedPg = require("spiced-pg");

const database = "socialnetwork";

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUserName, dbPassword } = require("./secrets");
    db = spicedPg(
        `postgres:${dbUserName}:${dbPassword}@localhost:5432/${database}`
    );
}

console.log(`[db] Connecting to: ${database}`);

// ==================== FUNCTIONS ======================

module.exports.regCheck = (email) => {
    return db.query(
        `SELECT users.password, users.id FROM users WHERE email = $1`,
        [email]
    );
}; // same

module.exports.addUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

module.exports.addResetCode = (email, code) => {
    return db.query(`INSERT INTO reset_codes (email, code) VALUES ($1, $2)`, [
        email,
        code,
    ]);
};

module.exports.getResetCode = (email) => {
    return db.query(
        ` 
    SELECT * FROM reset_codes
    WHERE email = ($1) ORDER BY created_at DESC LIMIT 1
    `,
        [email]
    );
};

module.exports.updatePassword = (password, email) => {
    return db.query(`UPDATE users SET password = ($1) WHERE email = ($2)`, [
        password,
        email,
    ]);
};

module.exports.getUser = (id) => {
    return db.query(
        "SELECT id, first, last, bio, pic_url FROM users WHERE id = ($1)",
        [id]
    );
};
