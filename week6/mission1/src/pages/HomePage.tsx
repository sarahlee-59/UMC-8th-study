import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LpCard from "../components/LpCard";
import { Lp } from "../types/lp";

const fetchLps = async (): Promise<Lp[]> => {
    const response = await axios.get("http://localhost:8000/v1/lps");
    return response.data.data.data;
};

const HomePage = () => {
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

    const { data, isPending, isError } = useQuery({
        queryKey: ["lpList"],
        queryFn: fetchLps,
    });

    if (isPending) {
        return <div className="text-red-500">Loading...</div>;
    }
    if (isError) {
        return <div className="text-red-500">Error Occurred</div>;
    }

    const sortedData = [...(data ?? [])].sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
    });

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-4 flex gap-2 justify-end">
                <button onClick={() => setSortOrder("oldest")} className={`cursor-pointer px-4 py-2 rounded border font-bold ${sortOrder === "oldest" ? "bg-white text-black" : "bg-black text-white"}`}>오래된순</button>
                <button onClick={() => setSortOrder("latest")} className={`cursor-pointer px-4 py-2 rounded border font-bold ${sortOrder === "latest" ? "bg-white text-black" : "bg-black text-white"}`}>최신순</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 cursor-pointer">
                {sortedData.map((lp) => (
                    <LpCard key={lp.id} lp={lp} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;