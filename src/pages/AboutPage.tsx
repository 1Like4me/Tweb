import { Card } from '../components/common/Card';

export const AboutPage = () => {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          About Our Venue
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Welcome to the premier event venue for weddings, corporate gatherings, birthdays, 
          and celebrations of all kinds. Our elegant space combines modern amenities with 
          timeless charm to create unforgettable experiences.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Our Story" subtitle="Since 2020">
          <p className="text-sm text-slate-300">
            Founded with a passion for creating memorable experiences, our venue has hosted 
            over 500 successful events. From intimate gatherings to grand celebrations, we 
            pride ourselves on attention to detail and exceptional service.
          </p>
        </Card>

        <Card title="Capacity" subtitle="Flexible arrangements">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Maximum capacity: 200 guests</li>
            <li>• Standing reception: up to 250 guests</li>
            <li>• Intimate events: 20-50 guests</li>
            <li>• Theater-style seating: 150 guests</li>
          </ul>
        </Card>

        <Card title="Amenities" subtitle="Everything you need">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Professional sound system</li>
            <li>• Stage lighting and effects</li>
            <li>• High-speed WiFi throughout</li>
            <li>• Catering kitchen facilities</li>
            <li>• Outdoor terrace area</li>
            <li>• Complimentary parking</li>
          </ul>
        </Card>

        <Card title="Location" subtitle="Easy to reach">
          <p className="text-sm text-slate-300">
            Conveniently located in the heart of the city with easy access to public 
            transportation. Our venue features ample parking and is wheelchair accessible 
            throughout all areas.
          </p>
          <div className="mt-4 space-y-1 text-xs text-slate-400">
            <p>123 Event Boulevard</p>
            <p>Downtown District</p>
            <p>Available 7 days a week, 9 AM - 11 PM</p>
          </div>
        </Card>
      </div>

      <Card 
        title="Gallery" 
        subtitle="See our space in action"
        className="border-brand-500/40"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-xs text-slate-500">Main Hall</span>
          </div>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-xs text-slate-500">Terrace View</span>
          </div>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-xs text-slate-500">Reception Area</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Images are placeholders for this demo. In production, these would showcase actual venue photography.
        </p>
      </Card>
    </div>
  );
};
