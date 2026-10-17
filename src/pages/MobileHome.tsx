import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Search, UserRound } from 'lucide-react';
import { KinomaLogo } from '../components/ui/KinomaLogo';
import { ModernContinueWatching } from '../components/ui/modern/ModernContinueWatching';
import { MovieApiMedia } from '../lib/api';
import { buildDetailsHref } from '../lib/mediaRoute';
import { optimizeImageUrl } from '../lib/mediaImages';
import './mobile-home.css';

type MobileHomeProps = {
  items: MovieApiMedia[];
};

function imageFor(item: MovieApiMedia) {
  const source = item.poster || item.backdrop;
  return source ? optimizeImageUrl(source, 'w500') || source : '';
}

export function MobileHome({ items }: MobileHomeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const featuredItems = items.filter((item, index, all) => item?.id && (item.poster || item.backdrop) && all.findIndex(other => other.id === item.id) === index).slice(0, 5);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && featuredItems.length > 2) viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
    setActiveIndex(Math.min(2, Math.max(0, featuredItems.length - 1)));
  }, [featuredItems.length]);

  const updateActiveCard = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    const cards = Array.from(viewport.querySelectorAll('.panda-mobile-featured__card')) as HTMLElement[];
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
    });
    setActiveIndex(current => current === closestIndex ? current : closestIndex);
  };

  return (
    <main className="panda-mobile-home">
      <header className="panda-mobile-home__header">
        <Link href="/home" aria-label="Panda.fun home" className="panda-mobile-home__brand">
          <KinomaLogo size="md" variant="full" />
        </Link>
        <Link href="/profile" className="panda-mobile-home__profile" aria-label="Profile">
          <UserRound size={20} strokeWidth={1.7} />
        </Link>
      </header>

      <section className="panda-mobile-featured" aria-label="Featured titles">
        <div className="panda-mobile-featured__head">
          <span className="panda-mobile-eyebrow">YOUR NEXT WATCH</span>
          <Link href="/search" aria-label="Search movies and shows" className="panda-mobile-featured__search"><Search size={18} /></Link>
        </div>
        {featuredItems.length > 0 ? (
          <div className="panda-mobile-featured__viewport" ref={viewportRef} onScroll={updateActiveCard}>
            <div className="panda-mobile-featured__track">
              {featuredItems.map((item, index) => {
                const image = imageFor(item);
                return (
                  <Link
                    key={item.id}
                    href={buildDetailsHref(item, item.type === 'movie' ? 'movie' : 'series')}
                    className={'panda-mobile-featured__card' + (index === activeIndex ? ' is-initial-center' : '')}
                    aria-label={'Open ' + item.title}
                    onClick={() => { /* Wouter handles navigation without reloading the app. */ }}
                  >
                    {image ? <img src={image} alt="" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" referrerPolicy="no-referrer" /> : <span className="panda-mobile-featured__no-art" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="panda-mobile-featured__loading" aria-label="Featured titles loading"><span /><span /><span /></div>
        )}
        <div className="panda-mobile-featured__hint" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      </section>

      <section className="panda-mobile-home__collection">
        <div className="panda-mobile-home__section-head">
          <h2>Continue Watching</h2>
          <Link href="/library" aria-label="Open Library"><ArrowRight size={17} /></Link>
        </div>
        <ModernContinueWatching />
      </section>

      <section className="panda-mobile-home__collection">
        <div className="panda-mobile-home__section-head">
          <h2>Trending now</h2>
          <Link href="/search" aria-label="Explore trending titles"><ArrowRight size={17} /></Link>
        </div>
        <div className="panda-mobile-home__trending">
          {items.slice(0, 6).map(item => {
            const image = imageFor(item);
            return (
              <Link key={item.id} href={buildDetailsHref(item, item.type === 'movie' ? 'movie' : 'series')} className="panda-mobile-home__trending-card" aria-label={'Open ' + item.title}>
                {image ? <img src={image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : <span className="panda-mobile-featured__no-art" />}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
