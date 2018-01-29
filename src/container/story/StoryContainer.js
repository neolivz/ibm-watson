import React from 'react'
import Story from '../../components/story/Story'
import { loadEmotion, loadStory } from '../../actions/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
export class StoryContainer extends React.Component {
  componentWillMount () {
    this.props.loadStory()
  }
  render () {
    return (
      <Story story={this.props.story} loadEmotion={this.props.loadEmotion} />
    )
  }
}

const mapStateToProps = state => {
  // we don't need to take anything particular
  return {
    story: state.story.store
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadEmotion,
      loadStory
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryContainer)
