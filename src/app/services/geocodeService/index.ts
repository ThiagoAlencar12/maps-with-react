export const fetchAddressByCep = async (cep: string) => {
  const formattedCep = cep.replace(/\D/g, '')
  if (formattedCep.length !== 8) {
    throw new Error('CEP inválido. Deve conter 8 dígitos.')
  }

  const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`)
  if (!response.ok) {
    throw new Error('Erro ao buscar o CEP. Tente novamente.')
  }

  const data = await response.json()
  if (data.erro) {
    throw new Error('CEP não encontrado.')
  }
  return data
}

export const fetchAddressesByParams = async (
  uf: string,
  city: string,
  address: string,
) => {
  const formattedUf = uf.trim().toLowerCase()
  const formattedCity = city.trim().toLowerCase()
  const formattedAddress = address.trim().toLowerCase()

  if (!formattedUf || !formattedCity || !formattedAddress) {
    throw new Error('UF, City and address are required.')
  }

  const response = await fetch(
    `https://viacep.com.br/ws/${formattedUf}/${formattedCity}/${formattedAddress}/json/`,
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar os endereços. Tente novamente.')
  }

  const data = await response.json()
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Nenhum endereço encontrado.')
  }

  return data
}

export const fetchGeocode = async (address: string) => {
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${GOOGLE_API_KEY}`,
    )

    const data = await response.json()
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location
      return location
    }
    throw Error('Erro ao buscar latitude e longitude.')
  } catch {
    throw Error('Erro na Geocoding API.')
  }
}
