import {RootState} from '../types/store.ts';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {createAPI} from '../services/api.ts';
import {Action} from 'redux';
import {AuthStatus, RequestStatus} from '../const.ts';

export type AppThunkDispatch = ThunkDispatch<RootState, ReturnType<typeof createAPI>, Action>;

export const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

export const makeMockStore = (initialState?: Partial<RootState>): RootState => ({
  comments: {
    comments: [],
    status: RequestStatus.Idle,
    statusPostRequest: RequestStatus.Idle,
  },
  favorites: {
    favorites: [],
    statusFetchFavorites: RequestStatus.Idle,
    statusToggleFavorite: RequestStatus.Idle,
  },
  offerFullInfo: {
    offerFullInfo: null,
    status: RequestStatus.Idle,
  },
  offers: {
    offers: [],
    offersFavorites: [],
    activeOffer: null,
    status: RequestStatus.Idle,
  },
  offersNear: {
    offersNear: [],
    status: RequestStatus.Idle,
  },
  user: {
    authStatus: AuthStatus.Unknown,
    requestStatus: RequestStatus.Idle,
    userInfo: null,
    userAuthData: null,
  },
  ...initialState ?? {},
});
