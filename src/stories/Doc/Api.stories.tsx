// eslint-disable-next-line
const IFrame = (args:any) => <iframe {...args} />

export default {
  title: 'API/LedFx API',
  component: IFrame,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    options: {
      bottomPanelHeight: 0,
      actions: false,
      showPanel: false
    },
    previewTabs: {
      eject: { hidden: true },
      copy: { hidden: true },
      fullscreen: { hidden: true },
      'storybook/background': { hidden: true },
      'storybook/viewport': { hidden: true },
      'storybook/docs/panel': { hidden: true }
    }
  },
  argTypes: {
    showPanel: false,
    tooltip: {
      table: {
        disable: true
      },
      control: false,
      actions: false,
      showPanel: false
    }
  }
}

export function AllRoutes() {
  return (
    <IFrame
      width="100%"
      height="100%"
      frameborder="0"
      src="https://stoplight-elements-dev-portal-storybook.netlify.app/iframe.html?id=public-stoplightproject--playground&args=router:hash;projectId:cHJqOjEwNTYzMw;hideTryIt:true&globals=theme:dark&viewMode=story#/YXBpOjMzOTIxMTA4-led-fx-api"
    />
  )
}
AllRoutes.parameters = {
  controls: { hideNoControlsWarning: true, disable: true, showPanel: false }
}

export function Typedoc() {
  return (
    <IFrame width="100%" height="100%" frameborder="0" src="https://typedoc.ledfx.stream/modules" />
  )
}
Typedoc.parameters = {
  controls: { hideNoControlsWarning: true, disable: true, showPanel: false }
}
