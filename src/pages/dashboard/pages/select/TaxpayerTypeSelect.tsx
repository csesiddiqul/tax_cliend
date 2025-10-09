import { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import {
    useGetTaxPayerTypesQuery,
    useGetTaxPayerTypeByIdQuery
} from "../../../../redux/api/taxPayerTypeApi";

interface TaxpayerTypeOption {
    value: any;
    label: string;
}

interface TaxpayerType {
    taxPayer_info?: any;
    TaxpayerTypeID: number;
    ClientNo?: string;
    TaxpayerType: string;
}

interface TaxpayerTypeSelectProps {
    value?: any; // ✅ পুরনো মান (edit mode)
    setFieldValue: (field: string, value: any) => void;
    disabled?: boolean;
}

const TaxpayerTypeSelect: React.FC<TaxpayerTypeSelectProps> = ({ value, setFieldValue, disabled }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [taxPayerTypes, setTaxpayerTypes] = useState<TaxpayerType[]>([]);
    const [selectedOption, setSelectedOption] = useState<TaxpayerTypeOption | null>(null);

    // ✅ সাধারণ TaxpayerType লিস্ট ফেচ
    const { data, isFetching } = useGetTaxPayerTypesQuery({
        perPage: 8,
        page,
        search
    });

    // ✅ পুরনো মান থাকলে এককভাবে ফেচ
    const { data: taxPayerTypeByIdData, isFetching: isFetchingById } = useGetTaxPayerTypeByIdQuery(value ?? '', {
        skip: !value
    });

    // ✅ TaxpayerType লিস্ট আপডেট
    useEffect(() => {
        if (!isFetching && data?.data) {
            const fetched = data.data as unknown as TaxpayerType[];
            setTaxpayerTypes(prev =>
                page === 1 || search ? fetched : [...prev, ...fetched]
            );
        }
    }, [data?.data, isFetching, page, search]);

    // ✅ পুরনো মান সেট করা
    useEffect(() => {
        if (value) {
            const found = taxPayerTypes.find(tp => tp.TaxpayerTypeID === value);
            if (found) {
                setSelectedOption({ value: found.TaxpayerTypeID, label: found.TaxpayerType });
            } else if (!isFetchingById && taxPayerTypeByIdData?.data) {
                setSelectedOption({
                    value: taxPayerTypeByIdData.data.TaxpayerTypeID,
                    label: taxPayerTypeByIdData.data.TaxpayerType,
                });
                // Merge পুরনো ডেটা লিস্টে
                setTaxpayerTypes(prev => [
                    ...prev,
                    {
                        TaxpayerTypeID: taxPayerTypeByIdData.data.TaxpayerTypeID,
                        TaxpayerType: taxPayerTypeByIdData.data.TaxpayerType,
                    },
                ]);
            }
        }
    }, [value, taxPayerTypes, taxPayerTypeByIdData, isFetchingById]);

    // ✅ টাইপ করলে সার্চ
    const handleInputChange = useCallback((inputValue: string) => {
        setSearch(inputValue);
        setPage(1);
    }, []);

    // ✅ স্ক্রল করলে লোড আরও ডেটা
    const loadMoreOptions = useCallback(() => {
        if (!isFetching && (data?.data?.length ?? 0) > 0) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, data?.data]);

    // ✅ অপশন লিস্ট প্রস্তুত
    const taxPayerOptions: TaxpayerTypeOption[] = useMemo(
        () =>
            taxPayerTypes.map(tp => ({
                value: tp.TaxpayerTypeID,
                label: tp.TaxpayerType,
            })),
        [taxPayerTypes]
    );

    return (
        <Select<TaxpayerTypeOption>
            id="TaxpayerTypeID"
            name="TaxpayerTypeID"
            options={taxPayerOptions}
            value={selectedOption}
            onChange={opt => {
                setSelectedOption(opt ?? null);
                setFieldValue("TaxpayerTypeID", opt?.value ?? '');
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

export default TaxpayerTypeSelect;
