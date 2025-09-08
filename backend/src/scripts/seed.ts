import bcrypt from 'bcrypt';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { prisma } from '../db/db';

// src/scripts/seed.ts

// List of predefined categories (feel free to expand this list)
const categories = [
  'electronics', 'furniture', 'clothing', 'toys', 'sports', 'books',
  'beauty', 'automotive', 'home', 'garden', 'music', 'health', 'food',
  'outdoor', 'office', 'kids', 'pet', 'games', 'accessories', 'gifts'
];

const userSeedPassword = 'strongPassword';

// Function to fetch multiple images based on a search query (e.g., "gaming laptop")
const fetchImagesForItem = async (searchQuery: string, totalImagesNeeded: number): Promise<string[]> => {
  const images: string[] = [];
  const imagesPerRequest = 30;
  const totalRequests = Math.ceil(totalImagesNeeded / imagesPerRequest);

  try {
    const apiAccessKey = process.env.UNSPLASH_API_ACCESS_KEY;
    if (!apiAccessKey) {
      throw new Error("Unsplash API access key is not defined in environment variables.");
    }

    const unsplashApiUrl = process.env.UNSPLASH_API_URL;
    if (!unsplashApiUrl) {
      throw new Error("Unsplash API URL is not defined in environment variables.");
    }
    // Loop to fetch the required number of images
    for (let page = 1; page <= totalRequests; page++) {
      const response = await axios.get(`${unsplashApiUrl}/search/photos`, {
        params: {
          query: searchQuery,
          per_page: imagesPerRequest,
          page: page,
        },
        headers: {
          Authorization: `Client-ID ${apiAccessKey}`,
        },
      });

      if (response.data.results.length > 0) {
        response.data.results.forEach((result: any) => {
          images.push(result.urls.regular);
        });
      }
    }

    return images.length > 0 ? images : ['https://via.placeholder.com/150']; // Fallback if no images are found
  } catch (error) {
    console.error(`Error fetching images for "${searchQuery}":`, error);
    return ['https://via.placeholder.com/150']; // Fallback image if there is an error
  }
};

// Generate a list of items for each user
const generateItemsForUser = async (userId: string, numItems: number) => {
  const items = [];

  // Random number of categories
  const categoryCount = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // Between 3 and 5 categories
  const chosenCategories = Array.from({ length: categoryCount }, () => categories[Math.floor(Math.random() * categories.length)]);

  for (let i = 0; i < numItems; i++) {
    const title = faker.commerce.productName();
    const category = chosenCategories[Math.floor(Math.random() * chosenCategories.length)] || 'default-category'; // Fallback to a default category

    // Fetch images for the item based on its category or title
    const imageUrls = await fetchImagesForItem(category, 5); // Fetch 5 images
    const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)] || 'https://via.placeholder.com/150'; // Fallback image URL

    items.push({
      title: title,
      description: faker.lorem.sentence(),
      price: parseFloat(faker.commerce.price()),
      category: category,
      imageUrl: imageUrl,
      userId: userId,
    });
  }

  return items;
};

// Function to batch create CartItems
const createCartItemsInBatches = async (cartId: string, items: any[], batchSize: number = 10) => {
  // Split the items array into smaller chunks
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    await Promise.all(
      chunk.map((item) =>
        prisma.cartItem.create({
          data: {
            cartId: cartId,
            itemId: item.id,
            quantity: 1,
          },
        })
      )
    );
  }
};

// Seed data
const seed = async () => {
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned successfully!');

  const createdUsers = [];

  // Step 1: Create users one by one to access user.id
  for (let i = 0; i < 100; i++) {
    const hashedPassword = await bcrypt.hash(userSeedPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
      },
    });
    createdUsers.push(user); // Store user object for future access
  }

  // Step 2: Generate items for all users in parallel
  const allItems = await Promise.all(
    createdUsers.map((user) => generateItemsForUser(user.id, 10)) // 10 items per user
  );

  const flattenedItems = allItems.flat(); // Flatten the array of items

  // Step 3: Bulk insert items into the database
  await prisma.item.createMany({
    data: flattenedItems,
  });

  // Step 4: After insertion, fetch the items from the database to get their IDs
  const insertedItems = await prisma.item.findMany({
    where: {
      userId: {
        in: createdUsers.map((user) => user.id),
      },
    },
  });

  // Step 5: Create carts for all users in parallel and add items to the carts
  await Promise.all(
    createdUsers.map(async (user) => {
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });

      const itemsInCart = insertedItems.filter((item) => item.userId === user.id);

      // Ensure there are items to add to the cart
      if (itemsInCart.length > 0) {
        await createCartItemsInBatches(cart.id, itemsInCart); // Use batch insertion for cart items
      }
    })
  );

  console.log('Seed data has been added successfully!');
};

seed()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
