export function cpfValidator(cpf: string) {
    // Remove caracteres não numéricos
  const cleanedCPF = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos ou se todos os dígitos são iguais
  if (!/^\d{11}$/.test(cleanedCPF) || /^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  // Validação dos dígitos verificadores
  const digits = cleanedCPF.split('').map(Number);
  const verifier1 = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const calcVerifier1 = (verifier1 * 10) % 11 % 10;

  const verifier2 = digits
    .slice(0, 10)
    .reduce((sum, digit, index) => sum + digit * (11 - index), 0);
  const calcVerifier2 = (verifier2 * 10) % 11 % 10;

  return calcVerifier1 === digits[9] && calcVerifier2 === digits[10];
}