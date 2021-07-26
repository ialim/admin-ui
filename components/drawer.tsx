interface DrawerProps {
    children: React.ReactNode;
}

export const Drawer = ({children}: DrawerProps) => {
  return (
    <div className="absolute w-80 h-screen bg-white transition duration-1000 py-3">
      <ul className="flex flex-col space-y-3">
        {children}
      </ul>
    </div>
  );
};
