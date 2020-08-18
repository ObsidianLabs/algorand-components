import React, { PureComponent } from 'react'
import {
  Button,
  ListGroup,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'

import instance from '@obsidians/algorand-instances'
import compilerManager from '@obsidians/algorand-compiler'

import ListItemDocker from './ListItemDocker'
import DockerImageItem from './DockerImageItem'
import checkDependencies from './checkDependencies'

export default class Welcome extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ready: false
    }
    this.listItemDocker = React.createRef()
    this.listItemNode = React.createRef()
    this.listItemCompiler = React.createRef()
  }

  componentDidMount () {
    this.mounted = true
    this.refresh()
    fileOps.current.onFocus(this.refresh)
  }

  componentWillUnmount () {
    this.mounted = false
    fileOps.current.offFocus(this.refresh)
  }

  refresh = async () => {
    if (this.mounted) {
      this.listItemDocker.current.refresh()
      this.listItemNode.current.refresh()
      this.listItemCompiler.current.refresh()
      const ready = await checkDependencies()
      this.setState({ ready })
    }
  }

  render () {
    return (
      <div className='d-flex h-100 overflow-auto'>
        <div className='jumbotron jumbotron-fluid'>
          <div className='container'>
            <h4 className='display-4'>Welcome to Algorand Studio</h4>

            <p className='lead'>Algorand Studio is a graphic IDE for developing Algorand Smart Contracts (ASC1).
            To get started, please install the prerequisite tools for Algorand.</p>

            <div className='my-3' />

            <ListGroup>
              <ListItemDocker
                ref={this.listItemDocker}
                onStartedDocker={this.refresh}
              />
              <DockerImageItem
                ref={this.listItemNode}
                channel={instance.node}
                title='Algorand Node'
                subtitle='The main software that runs Algorand node and compiles Teal scripts.'
                link='https://hub.docker.com/r/algorand/stable'
                onInstalled={this.refresh}
                downloadingTitle='Downloading Algorand'
              />
              <DockerImageItem
                ref={this.listItemCompiler}
                channel={compilerManager.channel}
                title='PyTeal Compiler'
                subtitle='PyTeal compiler is required to compile PyTeal to Teal.'
                link='https://hub.docker.com/r/obsidians/pyteal'
                onInstalled={this.refresh}
                downloadingTitle='Downloading PyTeal'
              />
            </ListGroup>
            <Button
              block
              color={this.state.ready ? 'primary' : 'secondary'}
              size='lg'
              className='my-5 mx-auto'
              style={{ width: 'fit-content' }}
              onClick={this.props.onGetStarted}
            >
              {this.state.ready ? 'Get Started' : 'Skip'}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
