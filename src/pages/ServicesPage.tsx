import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const ServicesPage = () => {
  const eventTypes = [
    {
      name: 'Wedding',
      basePrice: 3000,
      maxCapacity: 200,
      description: 'Elegant wedding ceremonies and receptions with full customization options.',
      features: ['Ceremony setup', 'Reception area', 'Bridal suite', 'Dance floor']
    },
    {
      name: 'Birthday Party',
      basePrice: 500,
      maxCapacity: 50,
      description: 'Fun and festive birthday celebrations for all ages.',
      features: ['Decoration setup', 'Entertainment area', 'Cake table', 'Party favors']
    },
    {
      name: 'Corporate Event',
      basePrice: 2000,
      maxCapacity: 100,
      description: 'Professional corporate gatherings, conferences, and team building events.',
      features: ['Presentation equipment', 'Breakout rooms', 'Catering service', 'WiFi access']
    },
    {
      name: 'Anniversary',
      basePrice: 1500,
      maxCapacity: 80,
      description: 'Celebrate milestones with an elegant anniversary party.',
      features: ['Romantic lighting', 'Photo display area', 'Toast setup', 'Memory board']
    },
    {
      name: 'Holiday Party',
      basePrice: 1000,
      maxCapacity: 60,
      description: 'Festive holiday celebrations for any occasion.',
      features: ['Seasonal decorations', 'Buffet area', 'Entertainment space', 'Coat check']
    },
    {
      name: 'Graduation',
      basePrice: 800,
      maxCapacity: 70,
      description: 'Commemorate academic achievements with friends and family.',
      features: ['Photo backdrop', 'Gift table', 'Award presentation area', 'Reception setup']
    }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Event Services & Packages
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          We offer comprehensive event packages tailored to your needs. Each package includes 
          venue rental, basic setup, and access to our amenities. Additional services can be 
          added to create your perfect event.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((event) => (
          <Card
            key={event.name}
            title={event.name}
            subtitle={`Starting at $${event.basePrice.toLocaleString()}`}
            className="border-slate-700/50 hover:border-brand-500/50 transition-colors"
          >
            <p className="text-sm text-slate-300 mb-4">{event.description}</p>
            
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Max Capacity:</span>{' '}
                {event.maxCapacity} guests
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-200 mb-2">Includes:</p>
                <ul className="space-y-1 text-xs text-slate-400">
                  {event.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <Link to="/booking">
                <Button size="sm" variant="primary" className="w-full">
                  Book This Event
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Card 
        title="Additional Services" 
        subtitle="Enhance your event"
        className="border-brand-500/40"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-300">
          <div>
            <p className="font-semibold text-slate-100">Catering</p>
            <p className="text-xs text-slate-400 mt-1">Professional catering services with customizable menus</p>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Photography</p>
            <p className="text-xs text-slate-400 mt-1">Professional photography and videography packages</p>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Entertainment</p>
            <p className="text-xs text-slate-400 mt-1">Live music, DJ services, and entertainment options</p>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Decoration</p>
            <p className="text-xs text-slate-400 mt-1">Full decoration services matching your theme</p>
          </div>
        </div>
      </Card>

      <div className="text-center py-6">
        <p className="text-sm text-slate-300 mb-4">
          Ready to book your event?
        </p>
        <Link to="/booking">
          <Button size="lg" variant="primary">
            Start Booking Process
          </Button>
        </Link>
      </div>
    </div>
  );
};
