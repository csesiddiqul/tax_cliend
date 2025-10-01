import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetTaxPayerListSelectQuery } from "../../../../redux/api/taxPayerApi";

interface TaxPayerOption {
    value: string;
    label: string;
}

interface TaxPayer {
    taxPayer_info: any;
    ClientNo: string;
    OwnersName: string;
}

interface TaxPayerSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const TaxPayerSelect: React.FC<TaxPayerSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);

    const { data, isFetching } = useGetTaxPayerListSelectQuery({
        perPage: 8,
        page,
        search
    });

    // Update taxPayers when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as TaxPayer[];
            setTaxPayers(prev =>
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
    const taxPayerOptions: TaxPayerOption[] = useMemo(
        () =>
            taxPayers.map(tp => ({
                value: tp.ClientNo,
                label: `${tp.OwnersName ?? ""} - ${tp.ClientNo ?? ""}`,
            })),
        [taxPayers]
    );

    return (
        <Select<TaxPayerOption>
            id="ClientNo"
            name="ClientNo"
            options={taxPayerOptions}
            onChange={opt => setFieldValue("ClientNo", opt?.value ?? '')}
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

export default TaxPayerSelect;
