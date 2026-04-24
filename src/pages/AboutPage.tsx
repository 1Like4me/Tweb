import { Card } from '../components/common/Card';
import { useI18n } from '../i18n/i18n';

import imgMainHall from '../images/277705435_328129996049318_6968397791204865406_n.jpg';
import imgReceptionArea from '../images/76c3c0_574109fe35ae4b3ebe2e746c9cecd767~mv2.avif';
import imgEventHall from '../images/3b3797_854e938e7423492a8b0267f82159fc50~mv2.avif';

export const AboutPage = () => {
  const { t } = useI18n();
  const galleryItems = [
    { src: imgMainHall, alt: t('Main Hall') },
    { src: imgReceptionArea, alt: t('Reception Area') },
    { src: imgEventHall, alt: t('Event Hall') },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          {t('About Our Venue')}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          {t(
            'Welcome to the premier event venue for weddings, corporate gatherings, birthdays, and celebrations of all kinds. Our elegant space combines modern amenities with timeless charm to create unforgettable experiences.'
          )}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title={t('Our Story')} subtitle={t('Since 2020')}>
          <p className="text-sm text-slate-300">
            {t(
              'Founded with a passion for creating memorable experiences, our venue has hosted over 500 successful events. From intimate gatherings to grand celebrations, we pride ourselves on attention to detail and exceptional service.'
            )}
          </p>
        </Card>

        <Card title={t('Capacity')} subtitle={t('Flexible arrangements')}>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>{t('• Maximum capacity: 200 guests')}</li>
            <li>{t('• Standing reception: up to 250 guests')}</li>
            <li>{t('• Intimate events: 20-50 guests')}</li>
            <li>{t('• Theater-style seating: 150 guests')}</li>
          </ul>
        </Card> 

        <Card title={t('Amenities')} subtitle={t('Everything you need')}>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>{t('• Professional sound system')}</li>
            <li>{t('• Stage lighting and effects')}</li>
            <li>{t('• High-speed WiFi throughout')}</li>
            <li>{t('• Catering kitchen facilities')}</li>
            <li>{t('• Outdoor terrace area')}</li>
            <li>{t('• Complimentary parking')}</li>
          </ul>
        </Card>

        <Card title={t('Location')} subtitle={t('Easy to reach')}>
          <p className="text-sm text-slate-300">
            {t(
              'Conveniently located in the heart of the city with easy access to public transportation. Our venue features ample parking and is wheelchair accessible throughout all areas.'
            )}
          </p>
          <div className="mt-4 space-y-1 text-xs text-slate-400">
            <p>123 Event Boulevard</p>
            <p>{t('Downtown District')}</p>
            <p>{t('Available 7 days a week, 9 AM - 11 PM')}</p>
          </div>
        </Card>
      </div>

      <Card 
        title={t('Gallery')} 
        subtitle={t('See our space in action')}
        className="border-brand-500/40"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item.alt}
              className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">{t('A selection of venue moments.')}</p>
      </Card>
    </div>
  );
};
