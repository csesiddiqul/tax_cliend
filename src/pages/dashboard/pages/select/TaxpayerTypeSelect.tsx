import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetTaxPayerTypesQuery } from "../../../../redux/api/taxPayerTypeApi";

interface TaxpayerTypeOption {
    value: number;
    label: string;
}

interface TaxpayerType {
    taxPayer_info: any;
    TaxpayerTypeID: number;
    ClientNo: string;
    TaxpayerType: string;
}

interface TaxpayerTypeSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const TaxpayerTypeSelect: React.FC<TaxpayerTypeSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [taxPayers, setTaxpayerTypes] = useState<TaxpayerType[]>([]);

    const { data, isFetching } = useGetTaxPayerTypesQuery({
        perPage: 4,
        page,
        search
    });

    // Update taxPayers when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as TaxpayerType[];
            setTaxpayerTypes(prev =>
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
    const taxPayerOptions: TaxpayerTypeOption[] = useMemo(
        () =>
            taxPayers.map(tp => ({
                value: tp.TaxpayerTypeID,
                label: `${tp.TaxpayerType}`,
            })),
        [taxPayers]
    );

    return (
        <Select<TaxpayerTypeOption>
            id="TaxpayerTypeID"
            name="TaxpayerTypeID"
            options={taxPayerOptions}
            onChange={opt => setFieldValue("TaxpayerTypeID", opt?.value ?? '')}
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

export default TaxpayerTypeSelect;
