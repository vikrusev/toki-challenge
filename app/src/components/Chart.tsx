import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface IProps {
  title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
  const data = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 350 },
    { name: 'May', value: 250 },
    { name: 'Jun', value: 450 },
    { name: 'Jul', value: 400 },
    { name: 'Aug', value: 300 },
    { name: 'Sep', value: 500 },
    { name: 'Oct', value: 550 },
    { name: 'Nov', value: 700 },
    { name: 'Dec', value: 800 },
  ];

  return (
    <>
      <h1>{title}</h1>

      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </>
  );
};

export default Chart;
