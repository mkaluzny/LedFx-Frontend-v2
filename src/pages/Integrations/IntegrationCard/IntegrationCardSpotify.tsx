import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import Collapse from '@mui/material/Collapse'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import { CardActions, Chip, CardContent, CardHeader, Switch, Avatar, useTheme } from '@mui/material'
import Popover from '../../../components/Popover/Popover'
import useStore from '../../../store/useStore'
import useIntegrationCardStyles from './IntegrationCard.styles'
import SpotifyAuthButton from '../../../components/Integrations/Spotify/SpotifyAuthButton'
import SpotifyScreen from '../Spotify/SpotifyScreen/SpotifyScreen'
import BladeIcon from '../../../components/Icons/BladeIcon/BladeIcon'
import { spotifyMe } from '../../../utils/spotifyProxies'

const IntegrationCardSpotify = ({ integration }: { integration: string }) => {
  const classes = useIntegrationCardStyles()
  const theme = useTheme()
  const getIntegrations = useStore((state) => state.getIntegrations)
  const integrations = useStore((state) => state.integrations)
  const deleteIntegration = useStore((state) => state.deleteIntegration)
  const toggleIntegration = useStore((state) => state.toggleIntegration)
  const setMe = useStore((state) => state.setMe)
  const me = useStore((state) => state.spotify.me)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const setDialogOpenAddIntegration = useStore((state) => state.setDialogOpenAddIntegration)
  const player = useStore((state) => state.spotify.player)

  const [expanded, setExpanded] = useState(false)
  const variant = 'outlined'
  const color = 'inherit'

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDeleteDevice = (integ: string) => {
    deleteIntegration(integrations[integ].id).then(() => {
      getIntegrations()
    })
  }

  const handleEditIntegration = (integ: any) => {
    setDialogOpenAddIntegration(true, integ)
  }
  const handleActivateIntegration = (integ: any) => {
    toggleIntegration({
      id: integ.id
    }).then(() => getIntegrations())
  }

  useEffect(() => {
    const getMe = async () => {
      // console.log('IntegrationCardSpotify: Attempting spotifyMe call...')
      const meData = await spotifyMe() // Call the modified spotifyMe
      if (meData && typeof meData !== 'string') {
        // console.log(
        //   'IntegrationCardSpotify: spotifyMe successful, received data:',
        //   meData
        // )
        setMe(meData)
      } else {
        console.error('IntegrationCardSpotify: spotifyMe failed or returned error:', meData)
        // Optionally handle error: show message, trigger logout state?
        // Example: if (meData === 'Error: Missing Access Token' || meData === 'Error: Unauthorized (Token might be invalid/expired)') { ... }
      }
    }
    // Check Zustand state and integration status
    if (spAuthenticated && integrations[integration]?.active) {
      // Use .active? Assuming status===1 means active
      getMe()
    } else {
      // console.log(
      //   'IntegrationCardSpotify: Skipping spotifyMe call (Not authenticated or integration inactive). Auth State:',
      //   spAuthenticated,
      //   'Integration Active:',
      //   integrations[integration]?.active
      // )
    }
    // Dependencies: Watch zustand auth state and integration status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    spAuthenticated,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    integrations[integration]?.active,
    setMe,
    integration,
    getIntegrations
  ])

  // Ensure integrations[integration] exists before accessing config
  if (!integrations || !integrations[integration]?.config) {
    // Optional: Render a loading state or null while integrations load
    console.log('IntegrationCardSpotify: Waiting for integration data for ID:', integration)
    return null // Or <CircularProgress />
  }

  return (
    <Card className={classes.integrationCardPortrait}>
      <CardHeader
        title={integrations[integration].config.name}
        subheader={integrations[integration].config.description}
        avatar={
          <Avatar aria-label="recipe" sx={{ width: 56, height: 56, color: '#fff' }}>
            <BladeIcon name="mdi:spotify" style={{ fontSize: 46 }} />
          </Avatar>
        }
        action={
          <Switch
            aria-label="status"
            checked={integrations[integration].active}
            onClick={async () => {
              if ((window as any).Spotify && player && spAuthenticated) {
                if (!integrations[integration].active) {
                  await player.connect()
                } else {
                  await player.disconnect()
                }
              }
              return handleActivateIntegration(integrations[integration])
            }}
          />
        }
      />

      {me?.display_name && integrations[integration].status === 1 && spAuthenticated && (
        <CardContent>
          <Chip
            avatar={<Avatar src={me.images[0]?.url}>{me.display_name[0]}</Avatar>}
            label={me.display_name}
            variant="outlined"
          />
        </CardContent>
      )}
      <CardActions style={{ alignSelf: 'flex-end' }}>
        <div className={classes.integrationCardContainer}>
          <IconButton
            sx={[
              {
                display: 'none',
                marginLeft: 'auto',

                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest
                }),

                '@media (max-width: 580px)': {
                  display: 'block'
                }
              },
              expanded
                ? {
                    transform: 'rotate(180deg)'
                  }
                : {
                    transform: 'rotate(0deg)'
                  }
            ]}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <div className={classes.buttonBar}>
            <SpotifyAuthButton disabled={!integrations[integration].active} />
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />

            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButton}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
            <SpotifyScreen
              icon={<BladeIcon name="mdi:spotify" />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={integrations[integration].status !== 1 || !spAuthenticated}
            />
          </div>
        </div>

        <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
          <div className={classes.buttonBarMobileWrapper}>
            {integrations[integration].active && <SpotifyAuthButton />}
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />
            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButtonMobile}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
            <SpotifyScreen
              icon={<AddIcon />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={integrations[integration].status !== 1 || !spAuthenticated}
            />
          </div>
        </Collapse>
      </CardActions>
    </Card>
  )
}

export default IntegrationCardSpotify
