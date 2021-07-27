interface ButtonProps {
  href: string;
  children: React.ReactNode;
  onClick?: ()=> void
}

export const Button = ({ children, href, onClick }: ButtonProps) => {
  return (
    <div className="mt-4 mx-5">
      <a
        className=" flex flex-row px-5 py-3 rounded-lg shadow-lg text-white uppercase tracking-wider font-semibold bg-gray-400 text-sm items-center"
        href={href}
        onClick={onClick} 
      >
        {children}
      </a>
    </div>
  );
};
