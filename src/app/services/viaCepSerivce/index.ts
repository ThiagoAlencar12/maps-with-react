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