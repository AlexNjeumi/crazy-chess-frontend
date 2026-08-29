import Image from 'next/image';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

interface PieceIconProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}

export const Icon = ({ name, size = 24, className = ""}: IconProps) => {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={`${name} icon`} 
      width={size}
      height={size}
      className={className}
    />
  );
};


