import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useI18n } from '../i18n/i18n';

export const HomePage = () => {
  const { t } = useI18n();
  return (
    <div className="space-y-10">
      <section className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            {t('Boutique Event Venue')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl lg:text-5xl">
            {t('Ready for your next event?')}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300">
            {t(
              'Manage weddings, corporate events, anniversaries, and more in a single, intuitive dashboard.'
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/booking">
              <Button size="lg" variant="primary">
                {t('Book an Event')}
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="ghost">
                {t('Explore Services')}
              </Button>
            </Link>
          </div>
          <dl className="mt-8 grid gap-6 text-xs text-slate-300 sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-100">{t('Event Types')}</dt>
              <dd>{t('Weddings, birthdays, corporate, holidays, and more.')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-100">{t('Smart Booking')}</dt>
              <dd>{t('Calendar, time slots, pricing, and availability.')}</dd>
            </div>
          </dl>
        </div>
        <Card
          title={t('Upcoming Highlights')}
          subtitle={t('A glimpse of what your guests will experience.')}
          className="border-brand-500/40"
        >
          <div className="space-y-4 text-xs text-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-brand-200">{t('Golden Hour Wedding')}</p>
                <p className="text-slate-400">
                  {t(
                    'Terrace ceremony with live string quartet and champagne reception.'
                  )}
                </p>
              </div>
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] text-emerald-200">
                {t('Confirmed')}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-brand-200">{t('Corporate Gala Night')}</p>
                <p className="text-slate-400">
                  {t('Black-tie event with stage lighting and premium catering.')}
                </p>
              </div>
              <span className="rounded-full bg-yellow-900/60 px-2 py-0.5 text-[10px] text-yellow-200">
                {t('Pending')}
              </span>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              {t(
                'This is a frontend-only academic demo. All data is simulated and stored locally in your browser.'
              )}
            </p>
          </div>
        </Card>
      </section>

      <section>
        <Card
          title={t('Your event is just a few clicks away')}
          subtitle={t('Simple booking flow, elegant results.')}
          className="border-brand-500/40"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              {t('Plan your celebration in minutes with a smooth and guided booking experience.')}
            </p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3 text-slate-200">
                <p className="font-semibold text-brand-300">{t('1. Pick an event')}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {t('Choose the event type that matches your celebration.')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3 text-slate-200">
                <p className="font-semibold text-brand-300">{t('2. Select the date and time')}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {t('Pick the perfect slot for your guests and schedule.')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3 text-slate-200 sm:col-span-2">
                <p className="font-semibold text-brand-300">{t('3. Tell us the number of guests')}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {t('Share your estimated guest count and any special requests.')}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-200">
              {t('And you are all set. We will do the rest for you!')}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

