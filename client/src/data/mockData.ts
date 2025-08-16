export const mockMenuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic tomato sauce with fresh mozzarella and basil",
    price: 14.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: true,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Mushrooms", "Olives"]
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni with melted cheese and tomato sauce",
    price: 16.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: false,
    is_spicy: true,
    is_featured: true,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Extra Pepperoni", "Jalapeños"]
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    description: "BBQ sauce with grilled chicken, red onions, and cilantro",
    price: 18.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: false,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Chicken", "Bacon", "Pineapple"]
  },
  {
    id: 4,
    name: "Veggie Supreme",
    description: "Loaded with fresh vegetables and premium cheese",
    price: 17.99,
    image_url: "/placeholder-pizza.svg",
    category: "pizza",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Medium", "Large"],
    available_crusts: ["Classic", "Thin", "Stuffed"],
    available_toppings: ["Extra Cheese", "Artichokes", "Sun-dried Tomatoes"]
  },
  {
    id: 5,
    name: "Buffalo Wings",
    description: "Crispy wings tossed in spicy buffalo sauce",
    price: 12.99,
    image_url: "/placeholder-pizza.svg",
    category: "appetizers",
    is_vegetarian: false,
    is_spicy: true,
    is_featured: false,
    available_sizes: ["6 pieces", "12 pieces", "24 pieces"],
    available_crusts: [],
    available_toppings: ["Ranch", "Blue Cheese", "Extra Hot"]
  },
  {
    id: 6,
    name: "Garlic Bread",
    description: "Fresh baked bread with garlic butter and herbs",
    price: 4.99,
    image_url: "/placeholder-pizza.svg",
    category: "appetizers",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Regular", "Large"],
    available_crusts: [],
    available_toppings: ["Extra Cheese", "Parmesan"]
  },
  {
    id: 7,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 8.99,
    image_url: "/placeholder-pizza.svg",
    category: "salads",
    is_vegetarian: false,
    is_spicy: false,
    is_featured: false,
    available_sizes: ["Small", "Large"],
    available_crusts: [],
    available_toppings: ["Extra Dressing", "Parmesan", "Anchovies"]
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center",
    price: 6.99,
    image_url: "/placeholder-pizza.svg",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    is_featured: true,
    available_sizes: ["Regular"],
    available_crusts: [],
    available_toppings: ["Vanilla Ice Cream", "Strawberries", "Whipped Cream"]
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Pizza",
    description: "Our signature pizzas made with fresh ingredients"
  },
  {
    id: 2,
    name: "Appetizers",
    description: "Perfect starters to share with friends and family"
  },
  {
    id: 3,
    name: "Salads",
    description: "Fresh and healthy options for a lighter meal"
  },
  {
    id: 4,
    name: "Desserts",
    description: "Sweet treats to end your meal perfectly"
  }
];
