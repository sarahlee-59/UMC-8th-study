import { useState } from "react";
import type { MovieFilters } from "../types/movie";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState<string>("");
    const [include, setIncludeAdult] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("ko-KR");
    
    return <div>MovieFilter</div>;
}

export default MovieFilter;