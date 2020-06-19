import React, { PureComponent } from 'react'

import {
  Button,
  Badge,
} from '@obsidians/ui-components'

import AlgorandVersionModal from './AlgorandVersionModal'

export default class AlgorandVersionManager extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      nInstalled: ''
    }
    this.modal = React.createRef()
  }

  componentDidMount () {
    this.modal.current.refreshVersions()
  }

  onVersionRefreshed = versions => {
    this.setState({ nInstalled: versions.length })
  }

  onClickButton = () => {
    this.modal.current.openModal()
  }

  render () {
    const nInstalled = this.state.nInstalled

    return (
      <React.Fragment>
        <Button onClick={this.onClickButton}>
          <i className='fas fa-server mr-1' />
          Algorand Versions
          {
            nInstalled
              ? <Badge pill color='info' className='ml-1'>{nInstalled}</Badge>
              : null
          }
        </Button>
        <AlgorandVersionModal
          ref={this.modal}
          onVersionRefreshed={this.onVersionRefreshed}
        />
      </React.Fragment>
    )
  }
}
