import {createAPI} from '../../services/api.ts';
import MockAdapter from 'axios-mock-adapter';
import {withExtraArgument} from '../../../node_modules/@reduxjs/toolkit/node_modules/redux-thunk';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {RootState} from '../../types/store.ts';
import {Action} from 'redux';
import {AppThunkDispatch, extractActionsTypes} from '../../mocks/store.ts';
import {APIRoute} from '../../const.ts';
import {fetchCommentsAction} from './comments.ts';
import {checkAuthAction, loginAction, logoutAction} from './user.ts';
import {getMockUserAuthData, getMockUserInfo} from '../../mocks/user.ts';

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

  describe('loginAction', () => {
    it('should dispatch "loginAction.pending" and "loginAction.fulfilled" with thunk "loginAction"', async () => {
      const mockUserAuthData = getMockUserAuthData();
      const mockUserInfo = getMockUserInfo(mockUserAuthData.email);
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, mockUserInfo);

      await store.dispatch(loginAction(mockUserAuthData));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const loginActionFulfilled = emittedActions.at(1) as ReturnType<typeof loginAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        loginAction.pending.type,
        loginAction.fulfilled.type,
      ]);

      expect(loginActionFulfilled.payload)
        .toEqual(mockUserInfo);
    });

    it('should dispatch "loginAction.pending" and "loginAction.rejected" when server response 400', async () => {
      const mockUserAuthData = getMockUserAuthData();
      mockAxiosAdapter.onPost(APIRoute.Login).reply(400);

      await store.dispatch(loginAction(mockUserAuthData));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        loginAction.pending.type,
        loginAction.rejected.type,
      ]);
    });
  });

  describe('logoutAction', () => {
    //todo

    // it('should dispatch "logoutAction.pending" and "logoutAction.fulfilled" with thunk "logoutAction"', async () => {
    //   mockAxiosAdapter.onPost(APIRoute.Logout).reply(204);
    //
    //   await store.dispatch(logoutAction());
    //
    //   const emittedActions = store.getActions();
    //   const extractedActionsTypes = extractActionsTypes(emittedActions);
    //
    //   expect(extractedActionsTypes).toEqual([
    //     logoutAction.pending.type,
    //     logoutAction.fulfilled.type,
    //   ]);
    // });

    it('should dispatch "logoutAction.pending" and "logoutAction.rejected" when server response 400', async () => {
      mockAxiosAdapter.onPost(APIRoute.Logout).reply(400);

      await store.dispatch(logoutAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        logoutAction.pending.type,
        logoutAction.rejected.type,
      ]);
    });
  });
});
