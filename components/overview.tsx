interface OverviewProps {
  children: React.ReactNode;
}

export const Overview = ({ children }: OverviewProps) => {
  return <ul className="mx-5 flex flex-col space-y-2 my-5">{children}</ul>;
};
