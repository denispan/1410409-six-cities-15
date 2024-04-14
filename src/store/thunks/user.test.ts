import {createAPI} from '../../services/api.ts';
import MockAdapter from 'axios-mock-adapter';
import {withExtraArgument} from '../../../node_modules/@reduxjs/toolkit/node_modules/redux-thunk';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {RootState} from '../../types/store.ts';
import {Action} from 'redux';
import {AppThunkDispatch, extractActionsTypes} from '../../mocks/store.ts';
import {APIRoute} from '../../const.ts';
import {fetchCommentsAction} from './comments.ts';
import {checkAuthAction} from './user.ts';
import {getMockUserInfo} from '../../mocks/user.ts';

describe('Async actions user', () => {
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

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" with thunk "checkAuthAction"', async () => {
      const mockUserInfo = getMockUserInfo();
      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockUserInfo);

      await store.dispatch(checkAuthAction());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const checkAuthActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchCommentsAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);

      expect(checkAuthActionFulfilled.payload)
        .toEqual(mockUserInfo);
    });

    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(400);

      await store.dispatch(checkAuthAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);
    });
  });

});
