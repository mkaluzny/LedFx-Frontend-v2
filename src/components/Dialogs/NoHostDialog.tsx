import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Divider,
  Box
  // Box,
} from '@mui/material'
import { Add, Delete, Save } from '@mui/icons-material'
import isElectron from 'is-electron'
import useStore from '../../store/useStore'
// import Instances from './Instances';

export default function NoHostDialog() {
  const dialogOpen = useStore((state) => state.dialogs.nohost?.open || false)
  const [add, setAdd] = useState(false)
  const edit = useStore((state) => state.dialogs.nohost?.edit || false)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const setDisconnected = useStore((state) => state.setDisconnected)
  // const coreParams = useStore((state) => state.coreParams);
  const setHost = useStore((state) => state.setHost)
  const storedURL = window.localStorage.getItem('ledfx-host')
  const storedURLs = JSON.parse(
    window.localStorage.getItem('ledfx-hosts') ||
      JSON.stringify(['http://localhost:8888'])
  )
  const [hosts, setHosts] = useState(['http://localhost:8888'])
  const [hostvalue, setHostvalue] = useState('http://localhost:8888')

  const cc =
    isElectron() && window.process?.argv.indexOf('integratedCore') !== -1

  const handleClose = () => {
    setDialogOpen(false)
    setAdd(false)
  }

  const handleSave = (ho: string) => {
    setHost(ho)
    if (!hosts.some((h) => h === ho)) {
      window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts, ho]))
    } else {
      window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts]))
    }
    setDialogOpen(false)
    setDisconnected(false)
    window.location.reload()
  }

  const handleDelete = (e: any, title: string) => {
    e.stopPropagation()
    window.localStorage.setItem(
      'ledfx-hosts',
      JSON.stringify(hosts.filter((h) => h !== title))
    )
    setHosts(hosts.filter((h) => h !== title))
  }

  useEffect(() => {
    if (storedURL) setHostvalue(storedURL)
    if (storedURLs) setHosts(storedURLs) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedURL, setHosts, JSON.stringify(storedURLs)])

  useEffect(() => {
    if (!storedURL) {
      setHost(
        isElectron()
          ? 'http://localhost:8888'
          : window.location.href.split('/#')[0].replace(/\/+$/, '')
      )
      window.localStorage.setItem(
        'ledfx-host',
        isElectron()
          ? 'http://localhost:8888'
          : window.location.href.split('/#')[0].replace(/\/+$/, '')
      )
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div key="nohost-dialog">
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {edit
            ? 'LedFx-Core Host'
            : window.process?.argv.indexOf('integratedCore') === -1
              ? 'No LedFx-Core found'
              : 'LedFx-Core not ready'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>
            Known Hosts: (click to connect)
          </DialogContentText>
          <div>
            {hosts.map((h) => (
              <div key={h}>
                <div style={{ display: 'flex' }}>
                  <Button
                    size="medium"
                    sx={{ textTransform: 'none' }}
                    fullWidth
                    aria-label="connect"
                    onClick={() => {
                      setHostvalue(h)
                      handleSave(h)
                    }}
                  >
                    {h}
                  </Button>
                  <Button
                    aria-label="delete"
                    onClick={(e) => h && handleDelete(e, h)}
                  >
                    <Delete />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {add ? (
            <>
              {!edit ? (
                <DialogContentText>
                  You can change the host if you want:
                </DialogContentText>
              ) : (
                <DialogContentText mt={3}>Add new host:</DialogContentText>
              )}
              <div style={{ display: 'flex', marginTop: '0.5rem' }}>
                <TextField
                  label="IP:Port"
                  variant="outlined"
                  value={hostvalue}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setHosts([...hosts, hostvalue])
                  }
                  onChange={(e) => setHostvalue(e.target.value)}
                />
                <Button
                  aria-label="add"
                  onClick={() => {
                    setHosts([...hosts, hostvalue])
                    setAdd(false)
                  }}
                >
                  <Save />
                </Button>
              </div>
            </>
          ) : (
            <Box textAlign={'center'} mt={2}>
              <Button
                sx={{ mt: 2, ml: 'auto', mr: 'auto' }}
                aria-label="add"
                onClick={() => setAdd(true)}
              >
                <Add />
              </Button>
            </Box>
          )}
          {cc && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Typography variant="caption" sx={{ marginBottom: '1rem' }}>
                  Core Instances
                </Typography>
                <Divider sx={{ marginBottom: '1rem' }} />
              </div>
              {/* {instanceVariant === 'line' && <><Box display="flex">
              <Box sx={{width: '90px', marginRight: '0.5rem'}}>Port</Box>
              <Box sx={{width: '110px', marginRight: '0.5rem'}}>Status</Box>
              <Box sx={{width: '110px', marginRight: '0.5rem'}}>Instance</Box>
              <Box sx={{width: '110px', marginRight: '0.5rem'}}>Config</Box>
              <Box sx={{flexGrow: 1, marginRight: '0.5rem', textAlign: 'center'}}>Actions</Box>
            </Box>
            <Divider sx={{ marginBottom: '1rem' }} />
            </>} */}

              {/* {Object.keys(coreParams).map((h, i)=><Instances instances={Object.keys(coreParams).map((ho)=>parseInt(coreParams[ho][1], 10) || 8888)} variant={instanceVariant} i={i} instance={h} port={coreParams[h].length > 0 ? coreParams[h][1] : '8888'} key={coreParams[h].length > 0 ? coreParams[h][1] : '8888'} />)}
            <Instances 
              instances={Object.keys(coreParams).map((ho)=>parseInt(coreParams[ho][1], 10) || 8888)}
              variant={instanceVariant} instance={false} i={Object.keys(coreParams).length + 1}
              port={`${parseInt(coreParams[`instance${  Object.keys(coreParams).length }`]?.[1] || '8888', 10) + 1}`} /> */}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
