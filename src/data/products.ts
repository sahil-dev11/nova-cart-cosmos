import headphonesImg from "@/assets/product-headphones.jpg";
import smartwatchImg from "@/assets/product-smartwatch.jpg";
import laptopImg from "@/assets/product-laptop.jpg";
import earbudsImg from "@/assets/product-earbuds.jpg";
import cameraImg from "@/assets/product-camera.jpg";
import keyboardImg from "@/assets/product-keyboard.jpg";
import smartphoneImg from "@/assets/product-smartphone.jpg";
import tabletImg from "@/assets/product-tablet.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    category: "Audio",
    image: headphonesImg,
    rating: 4.8,
    stock: 45,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    price: 399.99,
    description: "Advanced smartwatch with health tracking, notifications, and long battery life. Stay connected on the go.",
    category: "Wearables",
    image: smartwatchImg,
    rating: 4.6,
    stock: 32,
  },
  {
    id: "3",
    name: "Ultra Performance Laptop",
    price: 1299.99,
    description: "Powerful laptop with the latest processor, stunning display, and all-day battery. Perfect for work and creativity.",
    category: "Computers",
    image: laptopImg,
    rating: 4.9,
    stock: 18,
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    price: 149.99,
    description: "Compact wireless earbuds with crystal clear sound and comfortable fit. Includes charging case.",
    category: "Audio",
    image: earbudsImg,
    rating: 4.5,
    stock: 67,
  },
  {
    id: "5",
    name: "Professional Camera",
    price: 1899.99,
    description: "Professional-grade camera with high resolution sensor and advanced features for photographers.",
    category: "Photography",
    image: cameraImg,
    rating: 4.9,
    stock: 12,
  },
  {
    id: "6",
    name: "RGB Gaming Keyboard",
    price: 179.99,
    description: "Mechanical gaming keyboard with customizable RGB lighting and responsive keys. Perfect for gamers.",
    category: "Gaming",
    image: keyboardImg,
    rating: 4.7,
    stock: 41,
  },
  {
    id: "7",
    name: "Premium Smartphone",
    price: 999.99,
    description: "Latest smartphone with advanced camera system, powerful processor, and elegant design.",
    category: "Mobile",
    image: smartphoneImg,
    rating: 4.8,
    stock: 28,
  },
  {
    id: "8",
    name: "Professional Tablet",
    price: 799.99,
    description: "High-performance tablet with stylus support, perfect for creativity and productivity on the go.",
    category: "Tablets",
    image: tabletImg,
    rating: 4.7,
    stock: 35,
  },
];
