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
} from '@mui/material';
import { fetchAddressByCep, fetchGeocode } from '../../../../../app/services/viaCepSerivce';
import { AuthContext } from '../../../../../app/context/AuthProvider';

interface RegisterActionProp {
  setAddressLatAndLong: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    }>
  >;
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

export const RegisterAddressForm = ({ setAddressLatAndLong }: RegisterActionProp) => {
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Armazena o índice do contato sendo editado
  const { loggedUser } = useContext(AuthContext);

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState(0);

  // Carregar endereços do localStorage no carregamento inicial
  useEffect(() => {
    const savedAddresses = localStorage.getItem(`${loggedUser?.login}-addressList`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

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

      const address = await fetchAddressByCep(formattedCep);
      const { lat: latitude, lng: longitude } = await fetchGeocode(`${address.logradouro}, ${address.uf}`);
      setAddressLatAndLong({
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

  const handleSaveAddress = () => {
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
    localStorage.setItem(`${loggedUser?.login}-addressList`, JSON.stringify(updatedAddresses));

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
    setAddressLatAndLong({
      latitude,
      longitude,
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Abas para alternar entre Cadastro e Lista */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Cadastro" />
        <Tab label="Endereços Salvos" />
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
              label="CEP"
              name="cep"
              variant="outlined"
              fullWidth
              value={formData.cep}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" onClick={handleCepFetch}>
              Buscar Endereço
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
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
          {addresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Box marginY={2}>
                <Typography>
                  {address.name} - {address.cep} - {address.logradouro}, {address.localidade}/{address.uf}
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
    </Box>
  );
};