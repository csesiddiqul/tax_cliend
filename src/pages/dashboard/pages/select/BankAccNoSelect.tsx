import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useGetBankAccountsQuery } from "../../../../redux/api/bankAccountApi";

interface BankAccNoOption {
    value: number;
    label: string;
}

interface BankAccNo {
    taxPayer_info: any;
    BankNo: number;
    ClientNo: string;
    BankName: string;
}

interface BankAccNoSelectProps {
    setFieldValue: (field: string, value: any) => void;
}

const BankAccNoSelect: React.FC<BankAccNoSelectProps> = ({ setFieldValue }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [taxPayers, setBankAccNos] = useState<BankAccNo[]>([]);

    const { data, isFetching } = useGetBankAccountsQuery({
        perPage: 4,
        page,
        search
    });

    // Update taxPayers when API response changes
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as BankAccNo[];
            setBankAccNos(prev =>
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
    const taxPayerOptions: BankAccNoOption[] = useMemo(
        () =>
            taxPayers.map(tp => ({
                value: tp.BankNo,
                label: `${tp.BankName}`,
            })),
        [taxPayers]
    );

    return (
        <Select<BankAccNoOption>
            id="BankNo"
            name="BankNo"
            options={taxPayerOptions}
            onChange={opt => setFieldValue("BankNo", opt?.value ?? '')}
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

export default BankAccNoSelect;
