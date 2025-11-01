import { Client } from 'pg';

const categorySQL = `
CREATE TABLE IF NOT EXISTS categories(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(255),
  added_date TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description)
VALUES
  ('Cars', 'The most beautiful cars are here...'),
  ('Mangas', 'You are at the right place if you love mangas!');
`;

const itemSQL = `
CREATE TABLE IF NOT EXISTS items(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255),
  description TEXT,
  stock INTEGER,
  price DECIMAL(10, 2),
  image_link TEXT,
  added_date TIMESTAMP DEFAULT NOW()
);

INSERT INTO items (category_id, name, description, stock, price, image_link)
VALUES
  (1, 'Lamborghini Revuelto', 'The most recent car of Lamborghini.', 5, 300000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2023_Lamborghini_Revuelto.jpg/1280px-2023_Lamborghini_Revuelto.jpg'),
  (1, 'Rolls-Royce Dawn', 'You will feel like a bird in this car.', 2, 500000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Rolls_Royce_Dawn_2016_%2831214258855%29.jpg/1280px-Rolls_Royce_Dawn_2016_%2831214258855%29.jpg'),
  (2, 'One Piece VOL 110', 'The Ebb and Flow of the Ages', 8, 10.90, 'https://m.media-amazon.com/images/I/91P2zUmb4dL._SY522_.jpg'),
  (2, 'Dragon Ball Z VOL 4', 'The final fight against Majin Boo', 1, 7.90, 'https://media.hachette.fr/fit-in/780x1280/imgArticle/GLENAT/2019/9782344033654-001-X.jpeg?source=web');
`;

async function main() {
  const connectionString = process.argv[2];
  console.log('Connection str: ', connectionString);
  const client = new Client({
    connectionString,
  });

  try {
    console.log('🚀 Sending...');
    await client.connect();
    await client.query(categorySQL);
    await client.query(itemSQL);
    console.log('✅ Done!');
  } catch (error) {
    console.log('❌ Error!');
    throw error;
  } finally {
    await client.end();
  }
}
main();
