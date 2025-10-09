import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import {
    useGetBankAccountsQuery,
    useGetBankAccountByIdQuery,
} from "../../../../redux/api/bankAccountApi";

interface BankAccNoOption {
    value: any;
    label: string;
}

interface BankAccount {
    taxPayer_info?: any;
    BankNo: number;
    ClientNo?: string;
    BankName: string;
}

interface BankAccSelectProps {
    value: any;
    setFieldValue: (field: string, value: any) => void;
    disabled: boolean;
}

const BankAccSelect: React.FC<BankAccSelectProps> = ({ value, setFieldValue, disabled }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedOption, setSelectedOption] = useState<BankAccNoOption | null>(null);

    // Paginated bank accounts
    const { data, isFetching } = useGetBankAccountsQuery({
        perPage: 4,
        page,
        search,
    });

    // Fetch old value by ID
    const { data: bankByIdData, isFetching: isFetchingById } = useGetBankAccountByIdQuery(value ?? 0, {
        skip: !value,
    });

    // Update bank accounts list
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as BankAccount[];
            setBankAccounts(prev => (page === 1 || search ? fetched : [...prev, ...fetched]));
        }
    }, [data?.data, isFetching, page, search]);

    // Set selected option for old value
    useEffect(() => {
        if (value) {
            const found = bankAccounts.find(b => b.BankNo === value);
            if (found) {
                setSelectedOption({ value: found.BankNo, label: found.BankName });
            } else if (!isFetchingById && bankByIdData?.data) {
                const bank = bankByIdData.data as BankAccount;
                setSelectedOption({ value: bank.BankNo, label: bank.BankName });
                // Merge into list if not exists
                setBankAccounts(prev => [...prev, bank]);
            }
        }
    }, [value, bankAccounts, bankByIdData, isFetchingById]);

    // Handle search input
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // Infinite scroll
    const handleScrollToBottom = useCallback(() => {
        if (!isFetching && (data?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, data?.data]);

    // Map to select options
    const bankAccountOptions: BankAccNoOption[] = useMemo(
        () => bankAccounts.map(account => ({ value: account.BankNo, label: account.BankName })),
        [bankAccounts]
    );

    return (
        <Select<BankAccNoOption>
            id="BankNo"
            name="BankNo"
            value={selectedOption}
            options={bankAccountOptions}
            onChange={opt => {
                setSelectedOption(opt ?? null);
                setFieldValue("BankNo", opt?.value ?? '');
            }}
            onInputChange={handleInputChange}
            isLoading={isFetching || isFetchingById}
            onMenuScrollToBottom={handleScrollToBottom}
            placeholder="Select Bank Account"
            getOptionLabel={opt => opt.label}
            getOptionValue={opt => String(opt.value)}
            isClearable
            isDisabled={disabled ?? false}
        />
    );
};

export default BankAccSelect;
