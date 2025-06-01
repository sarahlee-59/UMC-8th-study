import { useState } from "react";
import type { MovieLanguage, MovieFilters } from "../types/movie";
import { Input } from "./Input";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState<string>("");
    const [includeAdult, setIncludeAdult] = useState<boolean>(false);
    const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

    const handleSubmit = () => {
        const filters: MovieFilters = {
            query,
            include_adult: includeAdult,
            language,
        };
        onChange(filters);
    };
    return (
        <div>
            <div className="transform space-y-6 rounded-2xl border-gray-300 bg-white
            p-6 shadow-xl transition-all hover:shadow-2xl">
                <div className="flex flex-wrap gap-6">
                    <div className="min-w-[450px] flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            영화 제목
                        </label>
                        <Input value={query} onChange={setQuery} />
                    </div>
                </div>
                <button onClick={handleSubmit}>영화 검색</button>
            </div>
        </div>
    );
};

export default MovieFilter;