import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetTblPropUseIdsQuery } from "../../../../redux/api/tblPropUseIdApi";

interface PropUseOption {
    value: number;
    label: string;
}

interface PropUse {
    PropUse_info: any;
    PropUseID: number;
    ClientNo: string;
    PropertyUse: string;
}

interface PropUseSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const PropUseSelect: React.FC<PropUseSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [PropUses, setPropUses] = useState<PropUse[]>([]);

    const { data, isFetching } = useGetTblPropUseIdsQuery({
        perPage: 3,
        page,
        search
    });

    // Update PropUses when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as PropUse[];
            setPropUses(prev =>
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
    const PropUseOptions: PropUseOption[] = useMemo(
        () =>
            PropUses.map(tp => ({
                value: tp.PropUseID,
                label: `${tp.PropertyUse}`,
            })),
        [PropUses]
    );

    return (
        <Select<PropUseOption>
            id="PropUseID"
            name="PropUseID"
            options={PropUseOptions}
            onChange={opt => setFieldValue("PropUseID", opt?.value ?? '')}
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

export default PropUseSelect;
