import  useGetLpList  from "../types/queries/useGetLpList.ts";

const HomePage = () => {
    const{ data, isPending, isError } = useGetLpList({});
    return <div> {data?.data.data.map((lp) => <h1>{lp.title}</h1>)}</div>;
};

export default HomePage;