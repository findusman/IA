import { FC, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  buttonIcon?: ReactNode; // Optional icon for the button
  className?: string; // Optional additional classes
  description?: string; // Optional description below the title
}

const GenericPageHeader: FC<PageHeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  buttonIcon,
  className = "",
  description = "",
}) => {
  return (
    <header
      className={`${className} w-full h-full flex items-center justify-between mb-6`}
    >
      <div className="">
        <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
        <p className="text-slate-400">{description}</p>
      </div>
      <button
        onClick={onButtonClick}
        className="flex  items-center gap-2 bg-dark-primary p-3 rounded-lg text-sm font-medium"
      >
        {buttonIcon}
        {buttonText}
      </button>
    </header>
  );
};

export default GenericPageHeader;
