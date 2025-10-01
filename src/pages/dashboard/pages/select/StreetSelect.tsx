import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetStreetsQuery } from "../../../../redux/api/streetsApi";

interface StreetOption {
    value: number;
    label: string;
}

interface Street {
    Street_info: any;
    StreetID: number;
    ClientNo: string;
    StreetName: string;
}

interface StreetSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const StreetSelect: React.FC<StreetSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [Streets, setStreets] = useState<Street[]>([]);

    const { data, isFetching } = useGetStreetsQuery({
        perPage: 8,
        page,
        search
    });

    // Update Streets when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as Street[];
            setStreets(prev =>
                page === 1 || search ? fetched : [...prev, ...fetched]
            );
        }
    }, [data?.data, isFetching, page, search]);

    // Input change handler (debounce optional)
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // Load more when scrolling
    const loadMoreOptions = useCallback(() => {
        if (!isFetching && (data?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, data?.data]);

    // Map API data to react-select options
    const StreetOptions: StreetOption[] = useMemo(
        () =>
            Streets.map(tp => ({
                value: tp.StreetID,
                label: `${tp.StreetName}`,
            })),
        [Streets]
    );

    return (
        <Select<StreetOption>
            id="StreetID"
            name="StreetID"
            options={StreetOptions}
            onChange={opt => setFieldValue("StreetID", opt?.value ?? '')}
            onInputChange={handleInputChange}
            isLoading={isFetching}
            onMenuScrollToBottom={loadMoreOptions}
            placeholder="Select"
            getOptionLabel={opt => opt.label}
            getOptionValue={opt => String(opt.value)}
        // isClearable optional
        />
    );
};

export default StreetSelect;
