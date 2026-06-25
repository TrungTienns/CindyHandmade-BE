const mysql = require('mysql2/promise');

async function alter() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'knitworkshop_db'
  });

  console.log('Connected to MySQL, adding size columns...');
  
  try {
    await connection.execute("ALTER TABLE `Products` ADD COLUMN `sizes` JSON NULL DEFAULT NULL");
    console.log("Added sizes to Products");
  } catch(e) { console.log(e.message) }

  try {
    await connection.execute("ALTER TABLE `CartItems` ADD COLUMN `size` VARCHAR(255) NULL");
    console.log("Added size to CartItems");
  } catch(e) { console.log(e.message) }
  
  try {
    await connection.execute("ALTER TABLE `OrderItems` ADD COLUMN `size` VARCHAR(255) NULL");
    console.log("Added size to OrderItems");
  } catch(e) { console.log(e.message) }
  
  // also, the unique index in CartItems needs to include size. Let's drop old and add new.
  try {
    const [rows] = await connection.execute("SHOW INDEX FROM CartItems WHERE Key_name != 'PRIMARY'");
    for (let r of rows) {
      if (r.Key_name === 'cartId_productId' || r.Key_name === 'cart_item_unique') {
        await connection.execute(`ALTER TABLE CartItems DROP INDEX \`${r.Key_name}\``);
        console.log(`Dropped old unique index ${r.Key_name}`);
      }
    }
  } catch(e) { console.log(e.message) }

  try {
    await connection.execute("ALTER TABLE `CartItems` ADD UNIQUE INDEX `cart_item_unique_size` (`cartId`, `productId`, `size`)");
    console.log("Added new unique index cart_item_unique_size");
  } catch(e) { console.log(e.message) }
  
  console.log('Alter finished!');
  await connection.end();
}

alter().catch(console.error);
