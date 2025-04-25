import { FaInfoCircle } from 'react-icons/fa';

interface EmptyContentProp {
  text?: string;
}

export function EmptyContent({
  text = 'Não há ítens a serem exibidos.',
}: EmptyContentProp) {
  return (
    <div className='flex h-full items-center justify-center gap-x-3'>
      <FaInfoCircle />
      <p>{text}</p>
    </div>
  );
}
