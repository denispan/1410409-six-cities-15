import {createAPI} from '../../services/api.ts';
import MockAdapter from 'axios-mock-adapter';
import {withExtraArgument} from '../../../node_modules/@reduxjs/toolkit/node_modules/redux-thunk';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {RootState} from '../../types/store.ts';
import {Action} from 'redux';
import {AppThunkDispatch, extractActionsTypes} from '../../mocks/store.ts';
import {APIRoute} from '../../const.ts';
import {getMockComment, getMockCommentPost} from '../../mocks/comment.ts';
import {fetchCommentsAction, postCommentAction} from './comments.ts';

describe('Async actions comments', () => {
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

  describe('fetchCommentsAction', () => {
    it('should dispatch "fetchCommentsAction.pending" and "fetchCommentsAction.fulfilled" with thunk "fetchOffers"', async () => {
      const offerId = 'test id';
      const mockComments = [getMockComment(), getMockComment()];
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, mockComments);

      await store.dispatch(fetchCommentsAction(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchCommentsActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchCommentsAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchCommentsAction.pending.type,
        fetchCommentsAction.fulfilled.type,
      ]);

      expect(fetchCommentsActionFulfilled.payload)
        .toEqual(mockComments);
    });
  });

  describe('postCommentAction', () => {
    it('should dispatch "postCommentAction.pending" and "postCommentAction.fulfilled" with thunk "postCommentAction"', async () => {
      const offerId = 'test id';
      const mockCommentPost = getMockCommentPost();
      const mockResponseComment = getMockComment();
      mockAxiosAdapter.onPost(`${APIRoute.Comments}/${offerId}`).reply(200, mockResponseComment);

      await store.dispatch(postCommentAction({offerId, body: mockCommentPost}));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const postCommentActionFulfilled = emittedActions.at(1) as ReturnType<typeof postCommentAction.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        postCommentAction.pending.type,
        postCommentAction.fulfilled.type,
      ]);

      expect(postCommentActionFulfilled.payload)
        .toEqual(mockResponseComment);
    });
  });
});
