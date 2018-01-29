import { createAsyncAction } from 'redux-async-action-reducer'
import {
  getEmotion as getEmotionApi,
  getStory as getStoryApi
} from '../apis/watsonApi'
import { LOAD_EMOTION, LOAD_STORY } from '../constants/actionConstants'

export const loadStory = createAsyncAction(LOAD_STORY, getStoryApi)
export const loadEmotion = createAsyncAction(LOAD_EMOTION, getEmotionApi)
