import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetStreetsQuery, useGetStreetByIdQuery } from "../../../../redux/api/streetsApi";

interface StreetOption {
    value: string;
    label: string;
}

interface Street {
    Street_info?: any;
    StreetID: string;
    ClientNo?: string;
    StreetName: string;
}

interface StreetSelectProps {
    value?: string; // old value
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}

const StreetSelect: React.FC<StreetSelectProps> = ({ value, setFieldValue, disabled }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [Streets, setStreets] = useState<Street[]>([]);
    const [selectedOption, setSelectedOption] = useState<StreetOption | null>(null);

    // Normal streets query
    const { data: streetsData, isFetching: isFetchingStreets } = useGetStreetsQuery({
        perPage: 8,
        page,
        search
    });

    // Fetch old value by id if exists
    const { data: streetByIdData, isFetching: isFetchingById } = useGetStreetByIdQuery(value ?? '', { skip: !value });

    // Update Streets when API response changes
    useEffect(() => {
        if (!isFetchingStreets && streetsData?.data) {
            const fetched = streetsData.data as unknown as Street[];
            setStreets(prev =>
                page === 1 || search ? fetched : [...prev, ...fetched]
            );
        }
    }, [streetsData?.data, isFetchingStreets, page, search]);

    // Set old value if exists
    useEffect(() => {
        if (value) {
            // Check if already in Streets
            const found = Streets.find(s => s.StreetID == value);
            if (found) {
                setSelectedOption({ value: found.StreetID, label: found.StreetName });
            } else if (!isFetchingById && streetByIdData?.data) {
                // fetched old value from API
                setSelectedOption({ value: streetByIdData.data.StreetID, label: streetByIdData.data.StreetName });
                // Merge fetched old street into Streets list
                setStreets(prev => [...prev, {
                    StreetID: streetByIdData.data.StreetID,
                    StreetName: streetByIdData.data.StreetName
                }]);
            }
        }
    }, [value, Streets, streetByIdData, isFetchingById]);

    // Input change handler
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // Load more when scrolling
    const loadMoreOptions = useCallback(() => {
        if (!isFetchingStreets && (streetsData?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetchingStreets, streetsData?.data]);

    // Map API data to react-select options
    const StreetOptions: StreetOption[] = useMemo(
        () => Streets.map(tp => ({ value: tp.StreetID, label: tp.StreetName })),
        [Streets]
    );

    return (
        <Select<StreetOption>
            id="StreetID"
            name="StreetID"
            options={StreetOptions}
            value={selectedOption}
            onChange={opt => {
                setSelectedOption(opt ?? null);
                setFieldValue("StreetID", opt?.value ?? '');
            }}
            onInputChange={handleInputChange}
            isLoading={isFetchingStreets || isFetchingById}
            onMenuScrollToBottom={loadMoreOptions}
            placeholder="Select"
            getOptionLabel={opt => opt.label}
            getOptionValue={opt => String(opt.value)}
            isClearable
            isDisabled={disabled ?? false}
        />
    );
};

export default StreetSelect;
