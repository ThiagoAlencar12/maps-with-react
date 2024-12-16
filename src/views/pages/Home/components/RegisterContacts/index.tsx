import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  FilledInput,
  Box,
  Tabs,
  Tab,
  Checkbox,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { fetchAddressByCep, fetchAddressesByParams, fetchGeocode } from '../../../../../app/services/geocodeService';
import { cpfValidator } from '../../../../../app/services/cpfValidator';

import { AuthContext } from '../../../../../app/context/AuthProvider';

interface RegisterActionProp {
  handleAddressChange: (newCoordinates: {
    latitude: number;
    longitude: number;
  }) => void
}

interface RegisterAddressForm {
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  latitude: number;
  longitude: number;
}

export const RegisterAddressForm = ({ handleAddressChange }: RegisterActionProp) => {
  const { loggedUser, logOut, deleteAccount } = useContext(AuthContext);

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
  });

  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<RegisterAddressForm[]>([]);
  const [searchResults, setSearchResults] = useState<RegisterAddressForm[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>()

  const [isSearchByAddress, setIsSeachByAddress] = useState(false);
  const [isSearchByCep, setSearchByCep] = useState(false);

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState(0);

  // Carregar endereços do localStorage no carregamento inicial
  useEffect(() => {
    const savedAddresses = localStorage.getItem(`${loggedUser?.login}-addressList`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);


  // Handlers para alternar os checkboxes
  const handleFetchByAdressChange = () => {
    setIsSeachByAddress((prevState) => !prevState);
    setSearchByCep(false); // Desmarca o outro
  };

  const handleCepChange = () => {
    setIsSeachByAddress(false); // Desmarca o outro
    setSearchByCep((prevState) => !prevState);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepFetch = async () => {
    try {
      const formattedCep = formData.cep.replace(/\D/g, '');
      if (formattedCep.length !== 8) {
        setError('CEP inválido. Deve conter 8 dígitos.');
        return;
      }
      // Busca na API Via CEP
      const address = await fetchAddressByCep(formattedCep);
      // Busca latitude / longitude google
      const { lat: latitude, lng: longitude } = await fetchGeocode(`${address.logradouro}, ${address.uf}`);
      handleAddressChange({
        latitude,
        longitude,
      });

      setFormData((prev) => ({
        ...prev,
        logradouro: address.logradouro,
        complemento: address.complemento,
        bairro: address.bairro,
        localidade: address.localidade,
        uf: address.uf,
        latitude,
        longitude,
      }));
      setError(null);
    } catch {
      setError('Erro ao buscar o CEP. Tente novamente.');
    }
  };

  const handleFetchByParams = async () => {
    try {
      const results = await fetchAddressesByParams(formData.uf, formData.localidade, formData.logradouro);
      setSearchResults(results); // Armazena os resultados no estado
      setOpenDialog(true)
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    }
  };

  const handleSelectAddress = (address: RegisterAddressForm) => {
    // Preenche os campos do formulário com os dados do endereço selecionado
    setFormData((prev) => ({
      ...prev,
      cep: address.cep,
      logradouro: address.logradouro,
      complemento: address.complemento || '',
      bairro: address.bairro || '',
      localidade: address.localidade,
      uf: address.uf,
    }));
    setOpenDialog(false)
    setSearchResults([]); // Limpa a lista de resultados após a seleção
  };

  const handleSaveAddress = () => {
    // Validações gerais
    if (!formData.name || !formData.cpf || !formData.phone || !formData.cep || !formData.logradouro || !formData.bairro || !formData.localidade || !formData.uf) {
      alert('Todos os campos obrigatórios devem ser preenchidos (exceto complemento).');
      return;
    }

    // Validação de CPF
    if (!cpfValidator(formData.cpf)) {
      alert('CPF inválido. Por favor, insira um CPF válido.');
      return;
    }

    // Verifica se o CPF já existe na base
    const cpfExists = addresses.some((address) => address.cpf === formData.cpf && editingIndex === null);
    if (cpfExists) {
      alert('CPF já cadastrado. Por favor, insira um CPF diferente.');
      return;
    }

    let updatedAddresses;
    if (editingIndex !== null) {
      // Atualiza o contato em edição
      updatedAddresses = addresses.map((address, index) =>
        index === editingIndex ? formData : address
      );
      setEditingIndex(null); // Reseta o índice de edição
    } else {
      // Adiciona um novo contato
      updatedAddresses = [...addresses, formData];
    }

    setAddresses(updatedAddresses);

    // Salva o contato editado/novo com o usuário logado
    localStorage.setItem(`${loggedUser?.login}-addressList`, JSON.stringify(updatedAddresses));

    // Reseta o formulário
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
    });

    alert(editingIndex !== null ? 'Contato atualizado com sucesso!' : 'Contato salvo com sucesso!');
  };

  const handleEditAddress = (index: number) => {
    setEditingIndex(index); // Armazena o índice do contato sendo editado
    setFormData(addresses[index]); // Preenche o formulário com os dados do contato
    setActiveTab(0); // Alterna para a aba de Cadastro
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    localStorage.setItem(`${loggedUser?.login}-addressList`, JSON.stringify(updatedAddresses));
    alert('Contato excluído com sucesso!');
  };

  const handleShowOnMap = (address: RegisterAddressForm) => {
    const { latitude, longitude } = address;
    handleAddressChange({
      latitude,
      longitude,
    });
  };

  const filteredAddresses = addresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtra por nome
      address.cpf.includes(searchTerm) // Filtra por CPF
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Atualiza o termo de busca
  };

  const handleDeleteAccount = () => {
    deleteAccount()
  };

  const handleLogout = () => {
    logOut(); 
  };

  return (
    <Box sx={{ width: '100%' }}>

      {/* Abas para alternar entre Cadastro ,Lista e Configurações */}
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

      {/* Conteúdo de Cadastro */}
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
            <Stack flexDirection='row' alignItems='center'>
              <Checkbox
                checked={isSearchByAddress}
                onChange={handleFetchByAdressChange}
              />
              <Typography>Buscar por logradouro</Typography>
            </Stack>

            <Stack flexDirection='row' alignItems='center'>
              <Checkbox
                checked={isSearchByCep}
                onChange={handleCepChange}
              />
              <Typography>Buscar por CEP</Typography>
            </Stack>

            <Button variant="contained" onClick={isSearchByCep ? handleCepFetch : handleFetchByParams}>
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
            <FilledInput fullWidth value={formData.latitude} placeholder="Latitude" />
          </Grid>

          <Grid item xs={6}>
            <FilledInput placeholder="Longitude" readOnly fullWidth value={formData.longitude} />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSaveAddress}>
              {editingIndex !== null ? 'Atualizar contato' : 'Salvar contato'}
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Conteúdo de Listagem */}
      {activeTab === 1 && (
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Endereços Salvos</Typography>
          </Grid>

          {/* Input de busca */}
          <Grid item xs={12}>
            <TextField
              label="Buscar por Nome ou CPF"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>

          {/* Lista Filtrada */}
          {filteredAddresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Box marginY={2}>
                <Typography>
                  {address.name} - {address.cpf} - {address.cep} - {address.logradouro},{' '}
                  {address.localidade}/{address.uf}
                </Typography>
                <Box>
                  <Button onClick={() => handleShowOnMap(address)} variant="outlined">
                    Ver no mapa
                  </Button>
                  <Button onClick={() => handleEditAddress(index)} color="primary">
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteAddress(index)} color="error">
                    Excluir
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Conteúdo de Actions */}
      {activeTab === 2 && (
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Configurações</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="error" onClick={handleDeleteAccount}>
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

      <Dialog
        open={openDialog}
      >
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
  );
};
