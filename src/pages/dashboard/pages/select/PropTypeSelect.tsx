import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetTblPropTypesQuery } from "../../../../redux/api/tblPropTypeApi";

interface PropTypeOption {
    value: number;
    label: string;
}

interface PropType {
    PropType_info: any;
    PropTypeID: number;
    ClientNo: string;
    PropertyType: string;
}

interface PropTypeSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const PropTypeSelect: React.FC<PropTypeSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [PropTypes, setPropTypes] = useState<PropType[]>([]);

    const { data, isFetching } = useGetTblPropTypesQuery({
        perPage: 4,
        page,
        search
    });

    // Update PropTypes when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as PropType[];
            setPropTypes(prev =>
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
    const PropTypeOptions: PropTypeOption[] = useMemo(
        () =>
            PropTypes.map(tp => ({
                value: tp.PropTypeID,
                label: `${tp.PropertyType}`,
            })),
        [PropTypes]
    );

    return (
        <Select<PropTypeOption>
            id="PropTypeID"
            name="PropTypeID"
            options={PropTypeOptions}
            onChange={opt => setFieldValue("PropTypeID", opt?.value ?? '')}
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

export default PropTypeSelect;
