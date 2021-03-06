import React from 'react'
import {
  Layout,
  Float,
  Register,
  Container,
  ROW,
  COLUMN,
  RENDER,
  cuid
} from 'react-dynamic-layout/lib'

import 'react-dynamic-layout/lib/style/base/index.styl'
import 'react-dynamic-layout/lib/style/dark/index.styl'

import ContentCanvas from './components/ContentCanvas'
import './components/Preview'
import './components/Palette'

import './components/Layers'
import './components/Frames'
import Sprites from './components/Sprites'
import Tools from './components/Tools'
import Menus from '../../components/Menus'
import ColorPicker from './components/ColorPicker'
import NewSprite from '../../components/NewSprite'

const elementColorPickerId = cuid()
const modalColorPickerId = cuid()
const modalNewSpriteId = cuid()

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

export default () => <Layout name='Main' type={ROW} hiddenType={RENDER} resize={false}>
  <Float width='200px' height='200px' x='calc(50% - 100px)' y='100px' id={modalNewSpriteId} open={false}>
    <Layout name='NewSprite' type={ROW}>
      <Container size={100} tabs={false}>
        <Register type={NewSprite} props={{modalNewSpriteId}} />
      </Container>
    </Layout>
  </Float>
  <Float width='65px' height='170px' x='250px' y='100px'>
    <Layout name='Float' type={ROW}>
      <Container size={100} tabs={false}>
        <Register type={Tools} props={{modalColorPickerId, elementColorPickerId}} />
      </Container>
    </Layout>
  </Float>
  <Float width='400px' height='320px' x='300px' y='100px' id={modalColorPickerId} open={false}>
    <Layout name='Float' type={ROW}>
      <Container size={100} tabs={false}>
        <Register type={ColorPicker} id={elementColorPickerId} props={{modalColorPickerId}} />
      </Container>
    </Layout>
  </Float>
  <Container size='25px' tabs={false}>
    <Register type={Menus} props={{ modalNewSpriteId }} />
  </Container>
  <Container size='calc(100% - 25px)' tabs={false}>
    <Layout type={COLUMN} name='Left'>
      <Container size={15}>
        <Register name='Frames' type={{}} props={{ text: 'Left top' }} />
        <Register name='Layers' type={{}} props={{ text: 'Left bottom' }} />
      </Container>
      <Container size={70} tabs={false}>
        <Layout type={ROW} name='Center' resize={false}>
          <Container size='16px' tabs={false}>
            <Register type={Sprites} props={{ text: 'Center top' }} />
          </Container>
          <Container size='calc(100% - 16px)' tabs={false}>
            <Register name='Canvas' type={ContentCanvas} props={windowSize} />
          </Container>
        </Layout>
      </Container>
      <Container size={15} tabs={false}>
        <Layout type={ROW} name='Right'>
          <Container size={50}>
            <Register name='Preview' type={{}} props={{ text: 'Right top' }} />
          </Container>
          <Container size={50}>
            <Register name='Palette' type={{}} props={{ text: 'Right bottom' }} />
          </Container>
        </Layout>
      </Container>
    </Layout>
  </Container>
</Layout>
