import axios from 'axios'

export const getStory = async () => {
  const story = await axios('http://localhost:4000/story').then(response => response.data)
  return story
}

export const getEmotion = async id => {
  const emotion = await axios(`http://localhost:4000/emotion/${id}`).then(response => response.data)
  return emotion
}
