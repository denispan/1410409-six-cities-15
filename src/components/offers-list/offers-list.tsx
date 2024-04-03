import type {OfferShortInfo} from '../../types/offer.ts';
import OfferCard from '../offer-card/offer-card.tsx';
import {useActionCreators, useAppSelector} from '../../hooks/store.ts';
import {offersActions, offersSelectors} from '../../store/slices/offers.ts';
import {sortOffers} from '../../utils/sort.ts';
import {SORT_OPTION_DEFAULT, SortOption} from '../sort/const.ts';
import Sort from '../sort/sort.tsx';
import {useState} from 'react';
import {CITIES, RequestStatus} from '../../const.ts';
import OffersListLoader from '../offers-list-loader/offers-list-loader.tsx';

interface OffersListProps {
  offersByCity: OfferShortInfo[];
  city: typeof CITIES[number];
}

function OffersList ({offersByCity, city}: OffersListProps) {
  const [activeSortOption, setActiveSortOption] = useState<SortOption>(SORT_OPTION_DEFAULT);

  const {setActiveOffer} = useActionCreators(offersActions);
  const status = useAppSelector(offersSelectors.status);

  const offersSorted = sortOffers(activeSortOption, offersByCity);

  if (status === RequestStatus.Loading) {
    return (
      <OffersListLoader />
    );
  }

  return (
    <section className="cities__places places">
      <h2 className="visually-hidden">Places</h2>
      <b className="places__found">
        {offersByCity.length} place{offersByCity.length > 1 && 's'} to stay in {city?.name}
      </b>
      <Sort
        activeSortOption={activeSortOption}
        setActiveSortOption={setActiveSortOption}
      />
      <div className="cities__places-list places__list tabs__content">
        {offersSorted.map((offer: OfferShortInfo) =>
          (
            <OfferCard
              key={offer.id}
              componentType={'cities'}
              offer={offer}
              hoverHandler={() => setActiveOffer(offer)}
            />
          ))}
      </div>
    </section>

  );
}

export default OffersList;