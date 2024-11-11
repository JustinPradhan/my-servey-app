import CardOne from "../components/CardOne";
import CardThree from "../components/CardThree";
import CardTwo from "../components/CardTwo";
import ChartThree from "../components/ChartThree";
import { Link } from 'react-router-dom';


const Dashboard: React.FC = () => {

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree />
        <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
          <Link to="/survey" className="mt-2">
            <CardOne />
          </Link>
          <Link to="/type" className="mt-2">
            <CardTwo />
          </Link>
          <Link to="/question" className="mt-2">
            <CardThree />
          </Link>

        </div>

      </div>
    </>
  );
};

export default Dashboard;
