export function cpfMask(value: string): string {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export function parseMaskedCPFToRaw(maskedCPF: string) {
  return maskedCPF.replaceAll('.', '').replaceAll('-', '');
}

export const moneyMask = (value: string) => {
  value = value.replaceAll('.', '').replace(',', '').replace(/\D/g, '');

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(
    isNaN(parseFloat(value)) ? 0 : parseFloat(value) / 100
  );

  return result;
};

export function parseCurrencyStrToNumber(currencyStr: string) {
  return Number(currencyStr.replaceAll('.', '').replace(',', '.'));
}
