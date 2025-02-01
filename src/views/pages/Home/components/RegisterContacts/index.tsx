import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FilledInput,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import type React from 'react'
import { useContext, useEffect, useState } from 'react'
import { cpfValidator } from '../../../../../app/services/cpfValidator'
import {
  fetchAddressByCep,
  fetchAddressesByParams,
  fetchGeocode,
} from '../../../../../app/services/geocodeService'

import { AuthContext } from '../../../../../app/context/AuthProvider'

interface RegisterActionProp {
  handleAddressChange: (newCoordinates: {
    latitude: number
    longitude: number
  }) => void
}

interface RegisterAddressForm {
  name: string
  cpf: string
  phone: string
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  latitude: number
  longitude: number
}

export const RegisterAddressForm = ({
  handleAddressChange,
}: RegisterActionProp) => {
  const { loggedUser, logOut, deleteAccount } = useContext(AuthContext)

  const [formData, setFormData] = useState<RegisterAddressForm>({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: '',
    latitude: 0,
    longitude: 0,
  })

  const [error, setError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<RegisterAddressForm[]>([])
  const [searchResults, setSearchResults] = useState<RegisterAddressForm[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>()

  const [isSearchByAddress, setIsSeachByAddress] = useState(false)
  const [isSearchByCep, setSearchByCep] = useState(false)

  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const savedAddresses = localStorage.getItem(
      `${loggedUser?.login}-addressList`,
    )
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }
  }, [loggedUser])

  const handleFetchByAdressChange = () => {
    setIsSeachByAddress((prevState) => !prevState)
    setSearchByCep(false)
  }

  const handleCepChange = () => {
    setIsSeachByAddress(false)
    setSearchByCep((prevState) => !prevState)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCepFetch = async () => {
    try {
      const formattedCep = formData.cep.replace(/\D/g, '')
      if (formattedCep.length !== 8) {
        setError('CEP inválido. Deve conter 8 dígitos.')
        return
      }

      const address = await fetchAddressByCep(formattedCep)

      const { lat: latitude, lng: longitude } = await fetchGeocode(
        `${address.logradouro}, ${address.uf}`,
      )
      handleAddressChange({
        latitude,
        longitude,
      })

      setFormData((prev) => ({
        ...prev,
        logradouro: address.logradouro,
        complemento: address.complemento,
        bairro: address.bairro,
        localidade: address.localidade,
        uf: address.uf,
        latitude,
        longitude,
      }))
      setError(null)
    } catch {
      setError('Erro ao buscar o CEP. Tente novamente.')
    }
  }

  const handleFetchByParams = async () => {
    try {
      const results = await fetchAddressesByParams(
        formData.uf,
        formData.localidade,
        formData.logradouro,
      )
      setSearchResults(results)
      setOpenDialog(true)
    } catch (error) {
      console.error('Erro ao buscar endereços:', error)
    }
  }

  const handleSelectAddress = (address: RegisterAddressForm) => {
    setFormData((prev) => ({
      ...prev,
      cep: address.cep,
      logradouro: address.logradouro,
      complemento: address.complemento || '',
      bairro: address.bairro || '',
      localidade: address.localidade,
      uf: address.uf,
    }))
    setOpenDialog(false)
    setSearchResults([])
  }

  const handleSaveAddress = () => {
    if (
      !formData.name ||
      !formData.cpf ||
      !formData.phone ||
      !formData.cep ||
      !formData.logradouro ||
      !formData.bairro ||
      !formData.localidade ||
      !formData.uf
    ) {
      alert(
        'Todos os campos obrigatórios devem ser preenchidos (exceto complemento).',
      )
      return
    }

    if (!cpfValidator(formData.cpf)) {
      alert('CPF inválido. Por favor, insira um CPF válido.')
      return
    }

    const cpfExists = addresses.some(
      (address) => address.cpf === formData.cpf && editingIndex === null,
    )
    if (cpfExists) {
      alert('CPF já cadastrado. Por favor, insira um CPF diferente.')
      return
    }

    let updatedAddresses
    if (editingIndex !== null) {
      updatedAddresses = addresses.map((address, index) =>
        index === editingIndex ? formData : address,
      )
      setEditingIndex(null)
    } else {
      // Adiciona um novo contato
      updatedAddresses = [...addresses, formData]
    }

    setAddresses(updatedAddresses)

    localStorage.setItem(
      `${loggedUser?.login}-addressList`,
      JSON.stringify(updatedAddresses),
    )

    setFormData({
      name: '',
      cpf: '',
      phone: '',
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      latitude: 0,
      longitude: 0,
    })

    alert(
      editingIndex !== null
        ? 'Contato atualizado com sucesso!'
        : 'Contato salvo com sucesso!',
    )
  }

  const handleEditAddress = (index: number) => {
    setEditingIndex(index)
    setFormData(addresses[index])
    setActiveTab(0)
  }

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index)
    setAddresses(updatedAddresses)
    localStorage.setItem(
      `${loggedUser?.login}-addressList`,
      JSON.stringify(updatedAddresses),
    )
    alert('Contato excluído com sucesso!')
  }

  const handleShowOnMap = (address: RegisterAddressForm) => {
    const { latitude, longitude } = address
    handleAddressChange({
      latitude,
      longitude,
    })
  }

  const filteredAddresses = addresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.cpf.includes(searchTerm),
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDeleteAccount = () => {
    deleteAccount()
  }

  const handleLogout = () => {
    logOut()
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Cadastro" />
        <Tab label="Endereços Salvos" />
        <Tab label="Configurações" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="CPF"
              name="cpf"
              variant="outlined"
              fullWidth
              value={formData.cpf}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Telefone"
              name="phone"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required={isSearchByCep}
              label="CEP"
              name="cep"
              variant="outlined"
              fullWidth
              value={formData.cep}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />
            <Stack flexDirection="row" alignItems="center">
              <Checkbox
                checked={isSearchByAddress}
                onChange={handleFetchByAdressChange}
              />
              <Typography>Buscar por logradouro</Typography>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <Checkbox checked={isSearchByCep} onChange={handleCepChange} />
              <Typography>Buscar por CEP</Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={isSearchByCep ? handleCepFetch : handleFetchByParams}
            >
              Buscar
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required={isSearchByAddress}
              label="Logradouro"
              name="logradouro"
              variant="outlined"
              fullWidth
              value={formData.logradouro}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Complemento"
              name="complemento"
              variant="outlined"
              fullWidth
              value={formData.complemento}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bairro"
              name="bairro"
              variant="outlined"
              fullWidth
              value={formData.bairro}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              required={isSearchByAddress}
              label="Cidade"
              name="localidade"
              variant="outlined"
              fullWidth
              value={formData.localidade}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              required={isSearchByAddress}
              label="UF"
              name="uf"
              variant="outlined"
              fullWidth
              value={formData.uf}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <FilledInput
              fullWidth
              value={formData.latitude}
              placeholder="Latitude"
            />
          </Grid>

          <Grid item xs={6}>
            <FilledInput
              placeholder="Longitude"
              readOnly
              fullWidth
              value={formData.longitude}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAddress}
            >
              {editingIndex !== null ? 'Atualizar contato' : 'Salvar contato'}
            </Button>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Endereços Salvos</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Buscar por Nome ou CPF"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>

          {filteredAddresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Box marginY={2}>
                <Typography>
                  {address.name} - {address.cpf} - {address.cep} -{' '}
                  {address.logradouro}, {address.localidade}/{address.uf}
                </Typography>
                <Box>
                  <Button
                    onClick={() => handleShowOnMap(address)}
                    variant="outlined"
                  >
                    Ver no mapa
                  </Button>
                  <Button
                    onClick={() => handleEditAddress(index)}
                    color="primary"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteAddress(index)}
                    color="error"
                  >
                    Excluir
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Configurações</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Excluir Conta
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Grid>
        </Grid>
      )}

      <Dialog open={openDialog}>
        <DialogTitle>Endereços encontrados</DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <Typography variant="h6">Resultados da busca:</Typography>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
              }}
            >
              {searchResults.map((address, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleSelectAddress(address)}
                >
                  <ListItemText
                    primary={`${address.logradouro}, ${address.bairro}, ${address.localidade} - ${address.uf}`}
                    secondary={`CEP: ${address.cep}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
