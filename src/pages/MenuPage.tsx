import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/i18n';
import { menuPackages, MenuPackage } from '../constants/menuData';

export const MenuPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<MenuPackage | null>(null);
  const { t } = useI18n();

  return (
    <>
      <div className="space-y-8">
        <section>
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            {t('Menu Options')}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            {t(
              'Browse sample menus for each type of event. Packages are fully customizable with our catering team.'
            )}
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuPackages.map((pkg) => (
            <Card
              key={pkg.id}
              title={`${pkg.emoji} ${t(pkg.name)}`}
              subtitle={t('Starting at ${amount}', {
                amount: pkg.startingFrom.toLocaleString()
              })}
              className="border-slate-700/50 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex h-full flex-col">
                <p className="text-sm text-slate-300 mb-4">{t(pkg.blurb)}</p>

                <div className="mt-auto pt-4 border-t border-slate-700">
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {t('See menu')}
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
                {selectedPackage.emoji} {t(selectedPackage.name)} {t('Menu')}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t('Starting at ${amount}', {
                  amount: selectedPackage.startingFrom.toLocaleString()
                })}
              </p>
            </header>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-4 text-sm text-slate-200">
              {selectedPackage.sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-1 text-xs font-semibold text-slate-100">
                    {t(section.title)}:
                  </p>
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
                {t('Close')}
              </Button>
              <Link to="/booking" onClick={() => setSelectedPackage(null)}>
                <Button size="sm" variant="primary">
                  {t('Start Booking')}
                </Button>
              </Link>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};
