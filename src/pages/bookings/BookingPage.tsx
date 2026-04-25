import { useEffect, useMemo, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { eventTypeService } from '../../services/eventTypeService';
import { EventType } from '../../types/models';

export const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    startTime: '',
    duration: '',
    guestCount: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  useEffect(() => {
    eventTypeService
      .getEventTypes()
      .then(setEventTypes)
      .catch(() => setEventTypes([]));
  }, []);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '8', label: 'Full day (8 hours)' }
  ];

  const selectedEventType = useMemo(
    () => eventTypes.find((e) => e.id === formData.eventType),
    [eventTypes, formData.eventType]
  );

  const calculatePrice = () => {
    if (!selectedEventType || !formData.duration) return 0;
    const durationMultiplier = parseInt(formData.duration) / 4; // base price is for 4 hours
    return Math.round(selectedEventType.basePrice * Math.max(durationMultiplier, 0.5));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.eventType) newErrors.eventType = 'Please select an event type';
    if (!formData.eventDate) newErrors.eventDate = 'Please select a date';
    if (!formData.startTime) newErrors.startTime = 'Please select a start time';
    if (!formData.duration) newErrors.duration = 'Please select duration';
    if (!formData.guestCount) {
      newErrors.guestCount = 'Please enter guest count';
    } else if (parseInt(formData.guestCount) < 1) {
      newErrors.guestCount = 'Guest count must be at least 1';
    } else if (selectedEventType && parseInt(formData.guestCount) > selectedEventType.maxCapacity) {
      newErrors.guestCount = `Maximum capacity for ${selectedEventType.name} is ${selectedEventType.maxCapacity}`;
    }

    // Check if date is not in the past
    if (formData.eventDate) {
      const selectedDateTime = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDateTime < today) {
        newErrors.eventDate = 'Cannot book events in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newBooking = {
        userId: user?.id ?? '',
        eventType: selectedEventType?.id || formData.eventType,
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        duration: parseInt(formData.duration),
        guestCount: parseInt(formData.guestCount),
        specialRequests: formData.specialRequests
      };
      if (!newBooking.userId) {
        setLoading(false);
        setErrors({ form: 'You must be logged in to create a booking.' });
        return;
      }
      bookingService
        .createBooking(newBooking)
        .then(() => {
          navigate('/my-bookings', {
            state: { message: 'Booking created successfully! Waiting for admin approval.' }
          });
        })
        .catch((err: any) => {
          setErrors({
            form:
              err?.message ??
              'Could not create booking right now. Please try again.'
          });
          setLoading(false);
        });
    }, 500);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Book Your Event
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Fill out the form below to request a booking. Our team will review your request 
          and confirm availability within 24 hours.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="Event Details" subtitle="Tell us about your event">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <p className="rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-xs text-red-300">
                {errors.form}
              </p>
            )}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-slate-200 mb-1.5">
                Event Type *
              </label>
              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="input w-full"
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} - Starting at ${type.basePrice.toLocaleString()}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="mt-1 text-xs text-red-400">{errors.eventType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Event Date *
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => {
                    setFormData({ ...formData, eventDate: e.target.value });
                  }}
                  className="input w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.eventDate && (
                  <p className="mt-1 text-xs text-red-400">{errors.eventDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Start Time *
                </label>
                <select
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="mt-1 text-xs text-red-400">{errors.startTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Duration *
                </label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Select duration</option>
                  {durations.map((dur) => (
                    <option key={dur.value} value={dur.value}>{dur.label}</option>
                  ))}
                </select>
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-400">{errors.duration}</p>
                )}
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-slate-200 mb-1.5">
                  Guest Count *
                </label>
                <input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="input w-full"
                  placeholder="50"
                  min="1"
                  max={selectedEventType?.maxCapacity || 200}
                />
                {errors.guestCount && (
                  <p className="mt-1 text-xs text-red-400">{errors.guestCount}</p>
                )}
                {selectedEventType && (
                  <p className="mt-1 text-xs text-slate-400">
                    Max capacity: {selectedEventType.maxCapacity} guests
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-slate-200 mb-1.5">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="input w-full"
                rows={4}
                placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                loading={loading}
              >
                Submit Booking Request
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/services')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Booking Summary" className="border-brand-500/40">
            {selectedEventType ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Event Type:</span>
                  <span className="text-slate-100 font-medium">{selectedEventType.name}</span>
                </div>
                {formData.eventDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-slate-100">{new Date(formData.eventDate).toLocaleDateString()}</span>
                  </div>
                )}
                {formData.startTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Time:</span>
                    <span className="text-slate-100">{formData.startTime}</span>
                  </div>
                )}
                {formData.duration && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-slate-100">
                      {durations.find(d => d.value === formData.duration)?.label}
                    </span>
                  </div>
                )}
                {formData.guestCount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guests:</span>
                    <span className="text-slate-100">{formData.guestCount} people</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-base">
                    <span className="text-slate-200 font-semibold">Estimated Total:</span>
                    <span className="text-brand-400 font-bold text-lg">
                      ${calculatePrice().toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Final price may vary based on additional services and requirements.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Select an event type to see pricing details
              </p>
            )}
          </Card>

          <Card title="Need Help?" className="border-slate-700/50">
            <p className="text-sm text-slate-300 mb-3">
              Have questions about your booking? We're here to help!
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p>📧 Email: bookings@venue.com</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>🕒 Hours: Mon-Fri, 9 AM - 6 PM</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
