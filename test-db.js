// Simple database connection test
const mysql = require('mysql2');
const dbDetails = require('./models/db-details');

console.log('Testing database connection with:');
console.log('Host:', dbDetails.host);
console.log('Port:', dbDetails.port);
console.log('User:', dbDetails.user);
console.log('Password:', dbDetails.password ? '***' : '(empty)');
console.log('Database:', dbDetails.database);
console.log('\nAttempting connection...\n');

const connection = mysql.createConnection({
  host: dbDetails.host,
  port: dbDetails.port,
  user: dbDetails.user,
  password: dbDetails.password,
  database: dbDetails.database,
  connectTimeout: 10000
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection FAILED:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if MySQL is running in XAMPP');
    console.error('2. Verify the password is correct');
    console.error('3. Try using port 3306 instead of 3307');
    console.error('4. Check if the database "charityeventsdb" exists');
    process.exit(1);
  }
  
  console.log('✅ Connection successful!');
  
  connection.query('SELECT DATABASE() as db', (err, results) => {
    if (err) {
      console.error('Query error:', err);
    } else {
      console.log('Connected to database:', results[0].db);
    }
    
    connection.end();
    console.log('\n✅ Database connection test completed successfully!');
  });
});
