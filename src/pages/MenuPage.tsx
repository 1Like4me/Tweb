import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

type MenuSection = {
  title: string;
  items: string[];
};

type MenuPackage = {
  id: string;
  name: string;
  emoji: string;
  startingFrom: number;
  blurb: string;
  sections: MenuSection[];
};

const menuPackages: MenuPackage[] = [
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

export const MenuPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<MenuPackage | null>(null);

  return (
    <>
      <div className="space-y-8">
        <section>
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            Menu Options
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Browse sample menus for each type of event. Packages are fully customizable with our catering team.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuPackages.map((pkg) => (
            <Card
              key={pkg.id}
              title={`${pkg.emoji} ${pkg.name}`}
              subtitle={`Starting at $${pkg.startingFrom.toLocaleString()}`}
              className="border-slate-700/50 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex h-full flex-col">
                <p className="text-sm text-slate-300 mb-4">{pkg.blurb}</p>

                <div className="mt-auto pt-4 border-t border-slate-700">
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    See menu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="neu-modal-surface w-full max-w-3xl overflow-hidden">
            <header className="border-b border-slate-800/80 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-50">
                {selectedPackage.emoji} {selectedPackage.name} Menu
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Starting at ${selectedPackage.startingFrom.toLocaleString()}
              </p>
            </header>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-4 text-sm text-slate-200">
              {selectedPackage.sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-1 text-xs font-semibold text-slate-100">{section.title}:</p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {section.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <footer className="flex justify-end space-x-2 border-t border-slate-800/80 px-5 py-3">
              <Button size="sm" variant="ghost" onClick={() => setSelectedPackage(null)}>
                Close
              </Button>
              <Link to="/booking" onClick={() => setSelectedPackage(null)}>
                <Button size="sm" variant="primary">
                  Start Booking
                </Button>
              </Link>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

