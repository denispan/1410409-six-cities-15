import {createAPI} from '../../services/api.ts';
import MockAdapter from 'axios-mock-adapter';
import { withExtraArgument } from '../../../node_modules/@reduxjs/toolkit/node_modules/redux-thunk';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {RootState} from '../../types/store.ts';
import { Action } from 'redux';
import {AppThunkDispatch, extractActionsTypes} from '../../mocks/store.ts';
import {getMockFullOffer, getMockShortOffer} from '../../mocks/offers.ts';
import {APIRoute} from '../../const.ts';
import {
  fetchFavoritesAction,
  fetchOfferFullInfoAction,
  fetchOffersAction,
  fetchOffersNearAction,
  toggleFavoriteAction
} from './offers.ts';

describe('Async actions offers', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mockStoreCreator = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator();
  });

  describe('fetchOffersAction', () => {
    it('should dispatch "fetchOffersAction.pending" and "fetchOffers.fulfilled" with thunk "fetchOffers"', async () => {
      const mockOffers = [getMockShortOffer()];
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffersAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.fulfilled.type,
      ]);

      expect(fetchOffersFulfilled.payload)
        .toEqual(mockOffers);
    });

    it('should dispatch "fetchOffersAction.pending" and "fetchOffers.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);

      await store.dispatch(fetchOffersAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type,
      ]);
    });
  });

  describe('fetchOfferFullInfoAction', () => {
    it('should dispatch "fetchOfferFullInfoAction.pending" and "fetchOfferFullInfoAction.fulfilled" with thunk "fetchOfferFullInfoAction"', async () => {
      const mockOfferFullInfo = getMockFullOffer();
      const mockOfferFullInfoId = mockOfferFullInfo.id;
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferFullInfoId}`).reply(200, mockOfferFullInfo);

      await store.dispatch(fetchOfferFullInfoAction(mockOfferFullInfoId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOfferFullInfoActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOfferFullInfoAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOfferFullInfoAction.pending.type,
        fetchOfferFullInfoAction.fulfilled.type,
      ]);

      expect(fetchOfferFullInfoActionFulfilled.payload)
        .toEqual(mockOfferFullInfo);
    });

    it('should dispatch "fetchOfferFullInfoAction.pending" and "fetchOfferFullInfoAction.rejected" when server response 400', async () => {
      const mockOfferFullInfo = getMockFullOffer();
      const mockOfferFullInfoId = mockOfferFullInfo.id;
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferFullInfoId}`).reply(400);

      await store.dispatch(fetchOfferFullInfoAction(mockOfferFullInfoId));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOfferFullInfoAction.pending.type,
        fetchOfferFullInfoAction.rejected.type,
      ]);
    });
  });

  describe('fetchOffersNearAction', () => {
    it('should dispatch "fetchOffersNearAction.pending" and "fetchOffersNearAction.fulfilled" with thunk "fetchOffersNearAction"', async () => {
      const mockNearOffers = [getMockShortOffer(), getMockShortOffer()];
      const mockOfferFullInfoId = getMockFullOffer().id;
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferFullInfoId}/nearby`).reply(200, mockNearOffers);

      await store.dispatch(fetchOffersNearAction(mockOfferFullInfoId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersNearActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersNearAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffersNearAction.pending.type,
        fetchOffersNearAction.fulfilled.type,
      ]);

      expect(fetchOffersNearActionFulfilled.payload)
        .toEqual(mockNearOffers);
    });

    it('should dispatch "fetchOffersNearAction.pending" and "fetchOffersNearAction.rejected" when server response 400', async () => {
      const mockOfferFullInfoId = getMockFullOffer().id;
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferFullInfoId}/nearby`).reply(400);

      await store.dispatch(fetchOffersNearAction(mockOfferFullInfoId));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOffersNearAction.pending.type,
        fetchOffersNearAction.rejected.type,
      ]);
    });
  });

  describe('fetchFavoritesAction', () => {
    it('should dispatch "fetchFavoritesAction.pending" and "fetchFavoritesAction.fulfilled" with thunk "fetchFavoritesAction"', async () => {
      const mockFavoritesOffers = [getMockShortOffer(true), getMockShortOffer(true)];
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, mockFavoritesOffers);

      await store.dispatch(fetchFavoritesAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchFavoritesActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchFavoritesAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchFavoritesAction.pending.type,
        fetchFavoritesAction.fulfilled.type,
      ]);

      expect(fetchFavoritesActionFulfilled.payload)
        .toEqual(mockFavoritesOffers);
    });

    it('should dispatch "fetchFavoritesAction.pending" and "fetchFavoritesAction.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);

      await store.dispatch(fetchFavoritesAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchFavoritesAction.pending.type,
        fetchFavoritesAction.rejected.type,
      ]);
    });
  });

  describe('toggleFavoriteAction', () => {
    //todo toggleFavoriteAction

    it('should dispatch "toggleFavoriteAction.pending" and "toggleFavoriteAction.fulfilled" with thunk "fetchFavoritesAction"', async () => {
      const mockOfferIsFavoriteFalse = getMockShortOffer(false);
      const mockOfferIsFavoriteTrue = Object.assign({}, mockOfferIsFavoriteFalse, {isFavorite: true});
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOfferIsFavoriteFalse.id}/1}`).reply(200, mockOfferIsFavoriteTrue);

      await store.dispatch(toggleFavoriteAction({offerId: mockOfferIsFavoriteFalse.id, status: 1}));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const toggleFavoriteActionFulfilled = emittedActions.at(1) as ReturnType<typeof toggleFavoriteAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        toggleFavoriteAction.pending.type,
        toggleFavoriteAction.fulfilled.type,
      ]);

      expect(toggleFavoriteActionFulfilled.payload)
        .toEqual(mockOfferIsFavoriteFalse);
    });

    it('should dispatch "toggleFavoriteAction.pending" and "toggleFavoriteAction.rejected" when server response 400', async () => {
      const mockOffer = getMockShortOffer();
      mockAxiosAdapter.onGet(`${APIRoute.Favorite}/${mockOffer.id}/1}`).reply(400);

      await store.dispatch(toggleFavoriteAction({offerId: mockOffer.id, status: 1}));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        toggleFavoriteAction.pending.type,
        toggleFavoriteAction.rejected.type,
      ]);
    });
  });
});
