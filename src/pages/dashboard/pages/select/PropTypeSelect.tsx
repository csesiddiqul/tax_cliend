import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import {
    useGetTblPropTypesQuery,
    useGetTblPropTypeByIdQuery
} from "../../../../redux/api/tblPropTypeApi";

interface PropTypeOption {
    value: any;
    label: string;
}

interface PropType {
    PropType_info?: any;
    PropTypeID: number;
    ClientNo?: string;
    PropertyType: string;
}

interface PropTypeSelectProps {
    value?: any; // ✅ edit form বা পুরনো মান
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}


const PropTypeSelect: React.FC<PropTypeSelectProps> = ({ value, setFieldValue, disabled }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [propTypes, setPropTypes] = useState<PropType[]>([]);
    const [selectedOption, setSelectedOption] = useState<PropTypeOption | null>(null);



    // ✅ Paginated prop types list
    const { data, isFetching } = useGetTblPropTypesQuery({
        perPage: 8,
        page,
        search
    });

    // ✅ Old value fetch (for edit)
    const { data: propTypeByIdData, isFetching: isFetchingById } = useGetTblPropTypeByIdQuery(value ?? 0, {
        skip: !value
    });

    // ✅ Update propTypes list
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as PropType[];
            setPropTypes(prev =>
                page === 1 || search ? fetched : [...prev, ...fetched]
            );
        }
    }, [data?.data, isFetching, page, search]);

    // ✅ Set old value if exists
    useEffect(() => {
        if (value) {
            const found = propTypes.find(p => p.PropTypeID === value);
            if (found) {
                setSelectedOption({ value: found.PropTypeID, label: found.PropertyType });
            } else if (!isFetchingById && propTypeByIdData?.data) {
                setSelectedOption({
                    value: propTypeByIdData.data.PropTypeID,
                    label: propTypeByIdData.data.PropertyType,
                });
                // Merge into list
                setPropTypes(prev => [
                    ...prev,
                    {
                        PropTypeID: propTypeByIdData.data.PropTypeID,
                        PropertyType: propTypeByIdData.data.PropertyType,
                    },
                ]);
            }
        }
    }, [value, propTypes, propTypeByIdData, isFetchingById]);

    // ✅ Handle search input
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // ✅ Infinite scroll
    const loadMoreOptions = useCallback(() => {
        if (!isFetching && (data?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, data?.data]);

    // ✅ Prepare select options
    const propTypeOptions: PropTypeOption[] = useMemo(
        () => propTypes.map(tp => ({
            value: tp.PropTypeID,
            label: tp.PropertyType,
        })),
        [propTypes]
    );

    return (
        <Select<PropTypeOption>
            id="PropTypeID"
            name="PropTypeID"
            options={propTypeOptions}
            value={selectedOption}
            onChange={opt => {
                setSelectedOption(opt ?? null);
                setFieldValue("PropTypeID", opt?.value ?? '');
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

export default PropTypeSelect;
