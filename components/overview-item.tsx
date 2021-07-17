interface OverviewItemProps {
  icon: React.ReactNode;
  name: string;
  value: number;
}

export const OverviewItem = ({ icon, name, value }: OverviewItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md px-8 py-6 bg-white">
      <span>{icon}</span>
      <span>{name}</span>
      <span>{value}</span>
    </div>
  );
};
