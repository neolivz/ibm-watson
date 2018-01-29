import { combineReducers } from 'redux'

import {
  initialState,
  createReducer,
  asyncReducer,
  asyncReducerGenerator
} from 'redux-async-action-reducer'

import { LOAD_EMOTION, LOAD_STORY } from '../constants/actionConstants'

const loadEmotionStarted = (state, request) => {
  let story = state.store.story
  story = [...story.slice(0, request), {...story[request], emotion: 'Loading'}, ...story.slice(request+1)]
  return {...state, store: {...state.store, story}}
}

const loadEmotionSuccess = (state, request, response) => {
  let story = state.store.story
  story = [...story.slice(0, request), {...story[request], emotion: response}, ...story.slice(request+1)]
  return {...state, store: {...state.store, story}} 
}

const loadEmotionFailed = (state, request, response, error) => {
  let story = state.store.story
  story = [...story.slice(0, request), {...story[request], emotion: 'Failed'}, ...story.slice(request+1)]
  return {...state, store: {...state.store, story}}
}

const emotionReducer = asyncReducerGenerator(
  LOAD_EMOTION,
  loadEmotionStarted,
  loadEmotionSuccess,
  loadEmotionFailed
)

const story = createReducer(
  initialState,
  [
  ],
  [asyncReducer(LOAD_STORY), emotionReducer]
)


const history = (state = [], action) => {
  return [...state, action]
}
export default combineReducers({
  story,
  history
})
