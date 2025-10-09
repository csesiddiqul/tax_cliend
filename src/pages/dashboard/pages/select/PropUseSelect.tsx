import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetTblPropUseIdsQuery, useGetTblPropUseIdByIdQuery } from "../../../../redux/api/tblPropUseIdApi";

interface PropUseOption {
    value: any;
    label: string;
}

interface PropUse {
    PropUse_info?: any;
    PropUseID: number;
    ClientNo?: string;
    PropertyUse: string;
}

interface PropUseSelectProps {
    value?: any; // old value
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}

const PropUseSelect: React.FC<PropUseSelectProps> = ({ value, setFieldValue, disabled }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [PropUses, setPropUses] = useState<PropUse[]>([]);
    const [selectedOption, setSelectedOption] = useState<PropUseOption | null>(null);

    // Fetch all property uses (paginated)
    const { data, isFetching } = useGetTblPropUseIdsQuery({
        perPage: 8,
        page,
        search
    });

    // Fetch single PropUse by ID (for edit/old value)
    const { data: propUseByIdData, isFetching: isFetchingById } = useGetTblPropUseIdByIdQuery(value ?? 0, { skip: !value });

    // Update PropUses list when API data changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as PropUse[];
            setPropUses(prev =>
                page === 1 || search ? fetched : [...prev, ...fetched]
            );
        }
    }, [data?.data, isFetching, page, search]);

    // Set old value if exists
    useEffect(() => {
        if (value) {
            const found = PropUses.find(p => p.PropUseID === value);
            if (found) {
                setSelectedOption({ value: found.PropUseID, label: found.PropertyUse });
            } else if (!isFetchingById && propUseByIdData?.data) {
                setSelectedOption({
                    value: propUseByIdData.data.PropUseID,
                    label: propUseByIdData.data.PropertyUse,
                });
                // Merge old data into list
                setPropUses(prev => [
                    ...prev,
                    {
                        PropUseID: propUseByIdData.data.PropUseID,
                        PropertyUse: propUseByIdData.data.PropertyUse,
                    },
                ]);
            }
        }
    }, [value, PropUses, propUseByIdData, isFetchingById]);

    // Handle typing
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // Load more when scroll to bottom
    const loadMoreOptions = useCallback(() => {
        if (!isFetching && (data?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, data?.data]);

    // Convert API data to react-select options
    const PropUseOptions: PropUseOption[] = useMemo(
        () => PropUses.map(p => ({ value: p.PropUseID, label: p.PropertyUse })),
        [PropUses]
    );

    return (
        <Select<PropUseOption>
            id="PropUseID"
            name="PropUseID"
            options={PropUseOptions}
            value={selectedOption}
            onChange={opt => {
                setSelectedOption(opt ?? null);
                setFieldValue("PropUseID", opt?.value ?? '');
            }}
            onInputChange={handleInputChange}
            isLoading={isFetching || isFetchingById}
            onMenuScrollToBottom={loadMoreOptions}
            placeholder="Select"
            getOptionLabel={opt => opt.label}
            getOptionValue={opt => String(opt.value)}
            isClearable
            isDisabled={disabled ?? false}
        />
    );
};

export default PropUseSelect;
