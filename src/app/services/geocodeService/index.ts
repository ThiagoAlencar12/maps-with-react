// src/services/viaCepService.ts
export const fetchAddressByCep = async (cep: string) => {
    const formattedCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (formattedCep.length !== 8) {
      throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }
  
    const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
    if (!response.ok) {
      throw new Error('Erro ao buscar o CEP. Tente novamente.');
    }
  
    const data = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado.');
    }
    return data; // Retorna os dados do endereço
  };

  export const fetchAddressesByParams = async (uf: string, cidade: string, logradouro: string) => {
    const formattedUf = uf.trim().toLowerCase();
    const formattedCidade = cidade.trim().toLowerCase();
    const formattedLogradouro = logradouro.trim().toLowerCase();
  
    if (!formattedUf || !formattedCidade || !formattedLogradouro) {
      throw new Error('UF, cidade e logradouro são obrigatórios.');
    }
  
    const response = await fetch(
      `https://viacep.com.br/ws/${formattedUf}/${formattedCidade}/${formattedLogradouro}/json/`
    );
  
    if (!response.ok) {
      throw new Error('Erro ao buscar os endereços. Tente novamente.');
    }
  
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Nenhum endereço encontrado.');
    }
  
    return data; // Retorna uma lista de endereços
  };
  

  export const fetchGeocode = async (address: string) => {
    
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Substitua pela sua chave da Geocoding API
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return location
      } else {
        throw Error('Erro ao buscar latitude e longitude.');
      }
    } catch {
      throw Error('Erro na Geocoding API.');
    }
  };