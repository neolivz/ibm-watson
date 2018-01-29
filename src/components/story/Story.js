import styled from 'styled-components'
import React from 'react'

const StoryRoot = styled.div`
    width: 100%;
    border: 1px solid black;
`

export const Story = props => {
  return (
    <StoryRoot>
      <table>
        <tbody>
          {props.story && props.story.story &&
            props.story.story.map((story, index) => {
              return (
                <tr key={index}>
                  {story.speaker && [
                    <td key='speaker'>{story.speaker}</td>,
                    <td key='text'>{story.text}</td>,
                    <td key='emotion'>
                      {!story.emotion && <button onClick={() => props.loadEmotion(index)}>Load emotion</button>}
                      {story.emotion === 'Loading' && <span>One Second</span>}
                      {story.emotion === 'Failed' && <span>Oops something went wrong</span>}
                      {story.emotion && story.emotion.resp && story.emotion.resp.emotion && <div>
                        <div>Sadness: {story.emotion.resp.emotion.document.emotion['sadness']}</div>
                        <div>Joy: {story.emotion.resp.emotion.document.emotion['joy']}</div>
                        <div>Disgust: {story.emotion.resp.emotion.document.emotion['disgust']}</div>
                        <div>Anger: {story.emotion.resp.emotion.document.emotion['anger']}</div>
                      </div>}
                    </td>
                  ]}
                  {!story.speaker && <td colSpan={2}>{story.text_entry}</td>}
                </tr>
              )
            })}
        </tbody>
      </table>
    </StoryRoot>
  )
}

export default Story
