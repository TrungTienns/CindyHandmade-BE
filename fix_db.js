const mysql = require('mysql2/promise');

async function fix() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'knitworkshop_db'
  });

  console.log('Connected to MySQL');
  const [rows] = await connection.execute("SHOW INDEXES FROM Users WHERE Column_name = 'email' AND Key_name != 'PRIMARY'");
  
  console.log(`Found ${rows.length} indexes for email`);
  
  for (let i = 1; i < rows.length; i++) {
    const keyName = rows[i].Key_name;
    console.log(`Dropping index ${keyName}`);
    await connection.execute(`ALTER TABLE Users DROP INDEX \`${keyName}\``);
  }
  
  console.log('Cleanup finished!');
  await connection.end();
}

fix().catch(console.error);
