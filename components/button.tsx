interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button = ({ children, href }: ButtonProps) => {
  return (
    <div className="mt-4 mx-5">
      <a
        className=" flex flex-row px-5 py-3 rounded-lg shadow-lg text-white uppercase tracking-wider font-semibold bg-gray-400 text-sm items-center"
        href={href}
      >
        {children}
      </a>
    </div>
  );
};
