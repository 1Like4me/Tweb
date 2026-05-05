export type MenuSection = {
  title: string;
  items: string[];
};

export type MenuPackage = {
  id: string;
  name: string;
  emoji: string;
  startingFrom: number;
  blurb: string;
  sections: MenuSection[];
};

export const menuPackages: MenuPackage[] = [
  {
    id: 'wedding',
    emoji: '🤍',
    name: 'Wedding',
    startingFrom: 3000,
    blurb: 'Elegant wedding reception menu with cocktail hour, mains, desserts, and full bar.',
    sections: [
      {
        title: 'Cocktail Hour Appetizers',
        items: [
          'Caprese skewers with balsamic glaze',
          'Crab cakes with lemon dill sauce',
          'Bruschetta with fresh tomatoes & basil',
          'Charcuterie & artisan cheese grazing board',
        ],
      },
      {
        title: 'Main Course (choice of two)',
        items: [
          'Herb-crusted beef tenderloin with red wine reduction',
          'Pan-seared salmon with lemon butter sauce',
          'Stuffed chicken breast with spinach & sun-dried tomato',
        ],
      },
      {
        title: 'Sides',
        items: [
          'Garlic butter mashed potatoes',
          'Roasted seasonal vegetables',
          'Caesar salad or house mixed greens',
        ],
      },
      {
        title: 'Desserts',
        items: ['Tiered wedding cake', 'Assorted petit fours & macarons'],
      },
      {
        title: 'Drinks',
        items: ['Champagne toast', 'Open bar', 'Coffee & tea service'],
      },
    ],
  },
  {
    id: 'birthday',
    emoji: '🎂',
    name: 'Birthday Party',
    startingFrom: 500,
    blurb: 'Playful, crowd-pleasing menu ideal for casual birthday celebrations.',
    sections: [
      {
        title: 'Appetizers / Finger Foods',
        items: [
          'Mini sliders (beef & chicken)',
          'Pigs in blankets',
          'Loaded nachos with guacamole & salsa',
          'Fruit skewers with honey yogurt dip',
          'Cheese & crackers tray',
        ],
      },
      {
        title: 'Main Course (buffet style)',
        items: [
          'Flatbread pizzas (cheese, pepperoni, veggie)',
          'BBQ pulled pork sandwiches',
          'Mac & cheese bar with toppings',
        ],
      },
      {
        title: 'Sides',
        items: ['Pasta salad', 'Coleslaw', 'Veggie sticks with ranch dip'],
      },
      {
        title: 'Desserts',
        items: ['Custom birthday cake', 'Cupcake tower', 'Birthday cake freezer pops'],
      },
      {
        title: 'Drinks',
        items: ['Juice boxes', 'Sodas', 'Lemonade', 'Water'],
      },
    ],
  },
  {
    id: 'corporate',
    emoji: '💼',
    name: 'Corporate Event',
    startingFrom: 2000,
    blurb: 'Professional, flexible menu for conferences, galas, and corporate gatherings.',
    sections: [
      {
        title: 'Appetizers',
        items: [
          'Gourmet boxed individual starters (caprese, bruschetta)',
          'Smoked salmon blinis',
          'Stuffed mushrooms',
          'Vegetable spring rolls with dipping sauce',
        ],
      },
      {
        title: 'Main Course (buffet or plated)',
        items: [
          'Grilled chicken breast with herb sauce',
          'Beef medallions with mushroom jus',
          'Pasta primavera (vegetarian)',
          'Build-your-own taco bar or Buddha bowl station',
        ],
      },
      {
        title: 'Sides',
        items: ['Roasted potatoes', 'Seasonal green salad', 'Dinner rolls & butter'],
      },
      {
        title: 'Desserts',
        items: [
          'Assorted mini desserts (brownies, tarts, mousse cups)',
          'Fresh fruit platter',
        ],
      },
      {
        title: 'Drinks',
        items: ['Coffee', 'Tea', 'Sparkling water', 'Soft drinks', 'Juice'],
      },
    ],
  },
  {
    id: 'anniversary',
    emoji: '💞',
    name: 'Anniversary',
    startingFrom: 1500,
    blurb: 'Romantic, restaurant-style courses perfect for milestone celebrations.',
    sections: [
      {
        title: 'Starters',
        items: [
          'French onion soup',
          'Salad Niçoise with fresh greens, olives & tuna',
          'Shrimp cocktail with horseradish aioli',
        ],
      },
      {
        title: 'Main Course (choice of two)',
        items: [
          'Black pepper crusted filet mignon with goat cheese & red pepper salsa',
          'Coq au Vin (chicken braised in red wine)',
          'Creamy scallops Alfredo over linguine',
        ],
      },
      {
        title: 'Sides',
        items: [
          'Garlic butter mashed potatoes',
          'Herbed roasted vegetables',
          'Fresh sourdough bread with salted butter',
        ],
      },
      {
        title: 'Desserts',
        items: [
          'Chocolate lava cake with vanilla bean ice cream',
          'Tiramisu',
          'Assorted macarons',
        ],
      },
      {
        title: 'Drinks',
        items: [
          'Curated wine pairing (red & white)',
          'Sparkling water',
          'Champagne toast',
        ],
      },
    ],
  },
  {
    id: 'holiday',
    emoji: '🎄',
    name: 'Holiday Party',
    startingFrom: 1000,
    blurb: 'Festive menu with classic holiday flavors and cozy winter drinks.',
    sections: [
      {
        title: 'Appetizers',
        items: [
          'Cranberry walnut cheese log with crackers',
          'Pesto stuffed mushrooms',
          'Caramelized onion & goat cheese bites',
          'Roasted shrimp cocktail',
          'Baked Brie with pomegranate & honey',
        ],
      },
      {
        title: 'Main Course (buffet style)',
        items: [
          'Beef tenderloin sandwiches',
          'Grilled salmon with lemon dill sauce',
          'Turkey with cranberry-orange sauce',
          'Pasta alla vodka',
        ],
      },
      {
        title: 'Sides',
        items: [
          'Whipped sweet potatoes',
          'Seasonal green salad with vinaigrette',
          'Dinner rolls & butter',
        ],
      },
      {
        title: 'Desserts',
        items: [
          'Frosted holiday sugar cookies',
          'Chocolate caramel brownies',
          'Coconut cupcakes with festive toppers',
          'Peanut butter fudge',
        ],
      },
      {
        title: 'Drinks',
        items: [
          'Mulled wine',
          'Eggnog',
          'Hot cocoa',
          'Soft drinks',
          'Sparkling cider',
        ],
      },
    ],
  },
  {
    id: 'graduation',
    emoji: '🎓',
    name: 'Graduation',
    startingFrom: 800,
    blurb: 'Casual, fun menu perfect for celebrating academic milestones.',
    sections: [
      {
        title: 'Appetizers',
        items: [
          'Italian pinwheel sandwiches',
          'Spinach artichoke dip with pita chips',
          'Ham & cheese roll-ups',
          'Jalapeño popper bites',
        ],
      },
      {
        title: 'Main Course (buffet style)',
        items: [
          'Juicy shredded beef tacos',
          'Grilled seasoned chicken',
          'Baked potato bar with toppings',
        ],
      },
      {
        title: 'Sides',
        items: [
          'Creamy mac & cheese',
          'Refreshing pasta salad',
          'Bean salad with cucumber, tomato & red onion',
        ],
      },
      {
        title: 'Desserts',
        items: [
          'Custom graduation cake',
          'Funfetti cupcakes',
          'Fudgy brownies',
          'Strawberry shortcake',
        ],
      },
      {
        title: 'Drinks',
        items: ['Lemonade', 'Iced tea', 'Sodas', 'Sparkling water'],
      },
    ],
  },
];

export const allDishes = Array.from(
  new Set(
    menuPackages.flatMap((pkg) =>
      pkg.sections.flatMap((section) => section.items)
    )
  )
).sort();
