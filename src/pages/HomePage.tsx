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
              'Manage weddings, corporate events, anniversaries, and more in a single, intuitive dashboard. This demo frontend showcases a complete booking experience built with React and TypeScript.'
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
            <div>
              <dt className="font-semibold text-slate-100">{t('Admin Control')}</dt>
              <dd>{t('Manage users, bookings, and venue settings.')}</dd>
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

      <section className="grid gap-6 md:grid-cols-3">
        <Card
          title={t('For Guests')}
          subtitle={t('A seamless experience for your clients.')}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li>{t('• Browse venue details and curated event packages.')}</li>
            <li>{t('• Book events with live availability and pricing.')}</li>
            <li>{t('• Manage bookings directly from a personal dashboard.')}</li>
          </ul>
        </Card>
        <Card
          title={t('For Administrators')}
          subtitle={t('Full control over bookings and configuration.')}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li>{t('• Review, approve, or cancel bookings.')}</li>
            <li>{t('• Manage users and their access roles.')}</li>
            <li>{t('• Adjust capacity, time slots, and pricing.')}</li>
          </ul>
        </Card>
        <Card
          title={t('For Academics')}
          subtitle={t('Designed to match React + TS lab criteria.')}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li>{t('• Strict TypeScript models and services.')}</li>
            <li>{t('• Mock authentication and protected routes.')}</li>
            <li>{t('• CRUD, validation, search, filter, and error pages.')}</li>
          </ul>
        </Card>
      </section>
    </div>
  );
};

