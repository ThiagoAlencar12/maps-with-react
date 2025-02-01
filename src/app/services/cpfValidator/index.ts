export function cpfValidator(cpf: string): boolean {
  if (!cpf) return false;

  const cleanedCPF = cpf.replace(/\D/g, '');

  if (!/^\d{11}$/.test(cleanedCPF) || /^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  const digits = cleanedCPF.split('').map(Number);

  const calculateVerifier = (cpfDigits: number[], length: number): number => {
    const sum = cpfDigits
      .slice(0, length)
      .reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
    return (sum * 10) % 11 % 10;
  };

  const verifier1 = calculateVerifier(digits, 9);
  const verifier2 = calculateVerifier(digits, 10);

  return verifier1 === digits[9] && verifier2 === digits[10];
}