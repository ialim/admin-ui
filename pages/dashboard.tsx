import { Overview } from "../components/overview";
import { OverviewItem } from "../components/overview-item";
import { SVG } from "../svg";

const Dashboard = () => {
  const { barChart, database, shoppingCart } = SVG;
  const value = 800;
  return (
    <>
      <div className="mx-5 my-3 text-left font-sans font-semibold text-2xl">
        Hello Admin
      </div>
      <Overview>
        <OverviewItem icon={barChart} name="Purchases" value={value} />
        <OverviewItem icon={database} name="Product" value={value} />
        <OverviewItem icon={shoppingCart} name="Sale" value={value} />
      </Overview>
    </>
  );
};

export default Dashboard;