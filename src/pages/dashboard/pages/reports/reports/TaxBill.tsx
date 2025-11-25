
import { Container, Button } from "react-bootstrap";
import "./TaxBill.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


import { useLazyGetTaxPayerClientByIdQuery, useLazyGetTaxPayerBillByIdQuery } from "redux/api/taxPayerApi";
import { useLazyGetTaxRateByIdQuery } from "redux/api/taxRatesApi";
import { useLazyGetBankAccountByIdQuery } from "redux/api/bankAccountApi";


interface BillCopyProps {
  copyType: string;
  taxpayer?: any;
  taxRate: any;
  bill?: any;
  bankAcc?: any;
}


const TaxBill = () => {
  const { id } = useParams();
  const [getTaxPayerById, { data, isLoading, error }] = useLazyGetTaxPayerClientByIdQuery();
  const [getBankAccountById, { data: bankAcc, isLoading: isLoadingBank }] = useLazyGetBankAccountByIdQuery();

  const [getTaxPayerBillById, { data: singleBill, isLoading: isLoadingBill }] = useLazyGetTaxPayerBillByIdQuery();

  const [getTaxRateById, { data: dataTaxRate, isLoading: TaxtRate }] = useLazyGetTaxRateByIdQuery();


  useEffect(() => {
    if (id) {
      getBankAccountById('1');
      getTaxPayerById(id);
      getTaxPayerBillById(id);
      getTaxRateById('0');
    }
  }, [id, getTaxPayerById, getTaxRateById, getTaxPayerBillById]);

  if (isLoading || TaxtRate || isLoadingBill || isLoadingBank) return <div>Loading...</div>;
  if (error) return <div>Error loading taxpayer data</div>;


  const taxRate = dataTaxRate?.data;
  const bill = singleBill?.data;
  const taxpayer = data?.data;

  const handlePrint = () => {
    window.print();
  };


  return (
    <Container fluid className="p-4 tax-bill">
      <div className="bill-container">
        <div className="bill-wrapper">
          <BillCopy copyType="পৌরসভার কপি" taxpayer={taxpayer} taxRate={taxRate} bill={bill} bankAcc={bankAcc} />
        </div>
        <div className="bill-wrapper">
          <BillCopy copyType="গ্রাহকের কপি" taxpayer={taxpayer} taxRate={taxRate} bill={bill} bankAcc={bankAcc} />
        </div>
      </div>


      {/* Print Button */}
      <div className="text-center mt-4 no-print">
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </Container>
  );
};

const BillCopy: React.FC<BillCopyProps> = ({ copyType, taxpayer, taxRate, bill, bankAcc }) => {



  const toBanglaNumber = (num: number | string | null | undefined): string => {
    if (num === undefined || num === null || num === "") return "";

    const engToBanglaDigits: Record<string, string> = {
      '0': '০',
      '1': '১',
      '2': '২',
      '3': '৩',
      '4': '৪',
      '5': '৫',
      '6': '৬',
      '7': '৭',
      '8': '৮',
      '9': '৯'
    };

    return num.toString().replace(/[0-9]/g, (d) => engToBanglaDigits[d]);
  };


  const calculateTotal = (current: any, rebate: any, arrear: any, surcharge: any, multiplier: any) => {
    const total =
      (Number(current || 0) * multiplier) - Number(rebate || 0) +
      Number(arrear || 0) + Number(surcharge || 0);

    return toBanglaNumber(Math.round(total)); // পুরো টোটাল রাউন্ড করা হলো
  };

  const formatDateBangla = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // month is 0-indexed
    const year = date.getFullYear();
    return toBanglaNumber(`${day}/${month}/${year}`);
  };




  return (
    <div className="bill">
      {/* Header */}
      <div className="bill-header">
        <div className="logo">

        </div>
        <div className="title logooo">
          <img style={{ height: "70px", width: "70px", marginRight: "10px" }} src="https://upload.wikimedia.org/wikipedia/bn/thumb/6/64/%E0%A6%AE%E0%A6%BE%E0%A6%97%E0%A7%81%E0%A6%B0%E0%A6%BE_%E0%A6%AA%E0%A7%8C%E0%A6%B0%E0%A6%B8%E0%A6%AD%E0%A6%BE%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.jpeg/250px-%E0%A6%AE%E0%A6%BE%E0%A6%97%E0%A7%81%E0%A6%B0%E0%A6%BE_%E0%A6%AA%E0%A7%8C%E0%A6%B0%E0%A6%B8%E0%A6%AD%E0%A6%BE%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.jpeg" alt="Logo" />
          <div className="div">
            <h4 className="mb-0">মাগুরা পৌরসভা </h4>
            <p className="m-0 colorr">পৌরকরের বিল</p>
            <p className="copy-text colorr m-0">{copyType}</p>
          </div>

        </div>
        <div className="year">
          <p className="m-0">
            অর্থ বছর :{" "}
            <span>
              {toBanglaNumber(bill?.Year)} - {toBanglaNumber(bill?.Year1)}
            </span>
          </p>
          <p className="m-0">
            কিস্তি : {toBanglaNumber(bill?.Period_of_Bill)}
          </p>
        </div>
      </div>



      {/* Body */}
      <div className="bill-body">
        <div className="info-grid">
          <p><span className="label">হোল্ডিং নং</span><span className="colon">:</span><span className="value">{toBanglaNumber(taxpayer?.HoldingNo)}</span></p>
          <p><span className="label">করদাতার আইডি</span><span className="colon">:</span><span className="value">{toBanglaNumber(taxpayer?.ClientNo)}</span></p>

          <p><span className="label">করদাতার নাম</span><span className="colon">:</span><span className="value">{taxpayer?.OwnersName}</span></p>

          {/* Pair 1 */}
          <div className="pair">
            <p><span className="label">পিতা/স্বামী/প্রতিষ্ঠানের নাম</span><span className="colon">:</span><span className="value">{taxpayer?.FHusName}</span></p>
            <p className="rightt"><span className="label">পিতা / স্বামী</span><span className="colon">:</span><span className="value">{taxpayer?.FHusName}</span></p>
          </div>

          <p><span className="label">রাস্তা/মৌজা/এলাকা/মহল্লা</span><span className="colon">:</span><span className="value">{taxpayer?.street?.StreetName}</span></p>
          <p><span className="label">বিলের ঠিকানা</span><span className="colon">:</span><span className="value"> {toBanglaNumber(taxpayer?.BillingAddress)} </span></p>

          {/* Pair 2 */}
          <div className="pair">
            <p>
              <span className="label">বিল ইস্যুর তারিখ</span>
              <span className="colon">:</span>
              <span className="value"> {formatDateBangla(bill?.DateOfIssue)}</span>
            </p>

            <p className="rightt"><span className="label">গ্রাহকের ধরন</span><span className="colon">:</span><span className="value"> {taxpayer?.taxpayer_type?.TaxpayerType}</span></p>
          </div>

          {/* Pair 3 */}
          <div className="pair">
            <p><span className="label">জমাদানের শেষ তারিখ</span><span className="colon">:</span><span className="value">{formatDateBangla(bill?.LastPaymentDate)}</span></p>
            <p className="rightt"><span className="label">বাৎসরিক মূল্যমান</span><span className="colon">:</span><span className="value"> {toBanglaNumber(Number(taxpayer?.CurrentValue).toFixed(2))} </span></p>
          </div>
        </div>

        {/* Table Section */}
        <div className="tax-table-wrapper">

          {/* প্রথম টেবিল */}
          <table className="tax-table main-table">
            <thead>
              <tr>
                <th rowSpan={2}>করের বিবরণ</th>
                <th colSpan={1}>বকেয়া</th>
                <th colSpan={4}>চলতি</th>
                <th rowSpan={2}>মোট</th>
              </tr>
              <tr>
                <th> {toBanglaNumber(bill?.ArrStYear)} - {toBanglaNumber(bill?.ArrStYear1)}  অর্থ বছরের <br /> {toBanglaNumber(bill?.ArrStPeriod)} কিস্তি থেকে</th>
                <th>১ম কিস্তি</th>
                <th>২য় কিস্তি</th>
                <th>৩য় কিস্তি</th>
                <th>৪র্থ কিস্তি</th>
              </tr>
            </thead>

            <tbody>

              {/* 🏠 হোল্ডিং কর */}
              <tr>
                <td>হোল্ডিং কর</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <span className="me-5">
                      {toBanglaNumber(Number(taxRate?.HoldingT || 0))}%
                    </span>
                    <span>০.০</span>
                  </div>
                </td>

                {(() => {
                  const total = Number(bill?.HoldingTax || 0);
                  const installment = (total / 4).toFixed(1);
                  const totalFormatted = Number(total).toFixed(1);

                  return [
                    <td key="h1">{toBanglaNumber(installment)}</td>,
                    <td key="h2">{toBanglaNumber(installment)}</td>,
                    <td key="h3">{toBanglaNumber(installment)}</td>,
                    <td key="h4">{toBanglaNumber(installment)}</td>,
                    <td key="hTotal">{toBanglaNumber(totalFormatted)}</td>,
                  ];
                })()}


              </tr>














              {/* 🧹 পরিষ্কার রেইট */}
              <tr>
                <td>পরিষ্কার রেইট</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <span className="me-5">
                      {toBanglaNumber(Number(taxRate?.ConservancyT || 0))}%
                    </span>
                    <span>০.০</span>
                  </div>
                </td>
                {(() => {
                  const total = Number(bill?.ConserTax || 0);
                  const installment = (total / 4).toFixed(1);
                  const totalFormatted = Number(total).toFixed(1);

                  return [
                    <td key="h1">{toBanglaNumber(installment)}</td>,
                    <td key="h2">{toBanglaNumber(installment)}</td>,
                    <td key="h3">{toBanglaNumber(installment)}</td>,
                    <td key="h4">{toBanglaNumber(installment)}</td>,
                    <td key="hTotal">{toBanglaNumber(totalFormatted)}</td>,
                  ];
                })()}
              </tr>

              {/* 💡 বিদ্যুৎ রেইট */}
              <tr>
                <td>বিদ্যুৎ রেইট</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <span className="me-5">
                      {toBanglaNumber(Number(taxRate?.LightT || 0))}%
                    </span>
                    <span>০.০</span>
                  </div>
                </td>
                {(() => {
                  const total = Number(bill?.LightTax || 0);
                  const installment = (total / 4).toFixed(1);
                  const totalFormatted = Number(total).toFixed(1);

                  return [
                    <td key="h1">{toBanglaNumber(installment)}</td>,
                    <td key="h2">{toBanglaNumber(installment)}</td>,
                    <td key="h3">{toBanglaNumber(installment)}</td>,
                    <td key="h4">{toBanglaNumber(installment)}</td>,
                    <td key="hTotal">{toBanglaNumber(totalFormatted)}</td>,
                  ];
                })()}
              </tr>

              {/* 💧 পানি রেইট */}
              <tr>
                <td>পানি রেইট</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <span className="me-5">
                      {toBanglaNumber(Number(taxRate?.WaterT || 0))}%
                    </span>
                    <span>০.০</span>
                  </div>
                </td>
                {(() => {
                  const total = Number(bill?.WaterTax || 0);
                  const installment = (total / 4).toFixed(1);
                  const totalFormatted = Number(total).toFixed(1);

                  return [
                    <td key="h1">{toBanglaNumber(installment)}</td>,
                    <td key="h2">{toBanglaNumber(installment)}</td>,
                    <td key="h3">{toBanglaNumber(installment)}</td>,
                    <td key="h4">{toBanglaNumber(installment)}</td>,
                    <td key="hTotal">{toBanglaNumber(totalFormatted)}</td>,
                  ];
                })()}
              </tr>

              {/* 🧾 মোট বিল */}
              <tr className="total-row">
                <td>মোট বিল</td>
                <td>  {toBanglaNumber(Number(bill?.YArear || 0))}</td>

                {(() => {
                  // Q1-Q4 numeric value
                  const q1 = Number(bill?.Q1 || 0);
                  const q2 = Number(bill?.Q2 || 0);
                  const q3 = Number(bill?.Q3 || 0);
                  const q4 = Number(bill?.Q4 || 0);

                  // total calculate
                  const total = (q1 + q2 + q3 + q4).toFixed(1);

                  return [
                    <td key="t1">{toBanglaNumber(q1.toFixed(1))}</td>,
                    <td key="t2">{toBanglaNumber(q2.toFixed(1))}</td>,
                    <td key="t3">{toBanglaNumber(q3.toFixed(1))}</td>,
                    <td key="t4">{toBanglaNumber(q4.toFixed(1))}</td>,
                    <td key="tTotal">{toBanglaNumber(total)}</td>,
                  ];
                })()}

              </tr>

            </tbody>


          </table>

          {/* দ্বিতীয় টেবিল */}
          <table className="tax-table sub-table">
            <thead>
              <tr>
                <th colSpan={6} className="table-title">
                  করদাতার বর্তমানে কত কিস্তি পরিশোধ করবেন
                </th>
              </tr>
              <tr>
                <th>বিলের বকেয়া</th>
                <th>কেবল বকেয়া</th>
                <th>বকেয়া ও ১ম কিস্তি একত্রে</th>
                <th>বকেয়া ও ১ম-২য় কিস্তি একত্রে</th>
                <th>বকেয়া ও ১ম-৩য় কিস্তি একত্রে</th>
                <th>বকেয়া ও ১ম-৪র্থ কিস্তি একত্রে</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>বর্তমান বিল</td>
                <td></td>
                <td>{toBanglaNumber(Number(bill?.Q1 || 0).toFixed(1))}</td>
                <td>{toBanglaNumber((Number(bill?.Q1 || 0) * 2).toFixed(1))}</td>
                <td>{toBanglaNumber((Number(bill?.Q1 || 0) * 3).toFixed(1))}</td>
                <td>{toBanglaNumber((Number(bill?.Q1 || 0) * 4).toFixed(1))}</td>

              </tr>
              <tr>
                <td>রিবেট</td>
                <td></td>
                <td>{toBanglaNumber(Number(bill?.["1QRebate"] || 0).toFixed(1))}</td>
                <td>{toBanglaNumber(Number(bill?.["2QRebate"] || 0).toFixed(1))}</td>
                <td>{toBanglaNumber(Number(bill?.["3QRebate"] || 0).toFixed(1))}</td>
                <td>{toBanglaNumber(Number(bill?.["4QRebate"] || 0).toFixed(1))}</td>

              </tr>
              <tr>
                <td>বকেয়া</td>
                <td>{toBanglaNumber(Number(bill?.YArear || 0))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.YArear || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.YArear || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.YArear || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.YArear || 0)).toFixed(1))}</td>

              </tr>
              <tr>
                <td>সারচার্জ</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0)))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0)).toFixed(1))}</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0)).toFixed(1))}</td>

              </tr>



              <tr className="total-row">
                <td>বকেয়সহ মোট বিল</td>
                <td>{toBanglaNumber(Math.round(Number(bill?.Surcharge || 0) + Number(bill?.YArear || 0)))}</td>
                <td>{calculateTotal(bill?.Q1, bill?.["1QRebate"], bill?.YArear, bill?.Surcharge, 1)}</td>
                <td>{calculateTotal(bill?.Q1, bill?.["2QRebate"], bill?.YArear, bill?.Surcharge, 2)}</td>
                <td>{calculateTotal(bill?.Q1, bill?.["3QRebate"], bill?.YArear, bill?.Surcharge, 3)}</td>
                <td>{calculateTotal(bill?.Q1, bill?.["4QRebate"], bill?.YArear, bill?.Surcharge, 4)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>








      {/* Bank Section (ছবির নিচের নীল অংশ) */}
      <div className="bank-section">
        <div className="signatures">
          <div className="sign-box">
            <p>সহঃ কর আদায়কারী / কর আদায়কারী</p>
            <div className="underline"></div>
          </div>
          <div className="sign-box right">
            <p>মেয়র / প্রশাসক</p>
            <div className="underline"></div>
          </div>
        </div>

        <div className="bank-info">
          <p>
            <span className="label">ব্যাংকের নাম :</span>
            <span className="value">
              {bankAcc?.data?.BankName}
            </span>
          </p>
          <p>
            <span className="label">একাউন্ট নং :</span>
            <span className="value">{bankAcc?.data?.AccountsNo}</span>
          </p>
          <p>
            <span className="label">গৃহীত টাকা :</span>
            <span className="value">...............................</span>
          </p>
          <p>
            <span className="label">গৃহীত টাকার (কথায়) :</span>
            <span className="value">...............................</span>
          </p>

          <div className="bank-bottom">
            <div>
              <p>ব্যাংক সিল</p>
              <div className="underline small"></div>
            </div>
            <div className="amount">
              <p>মাএ</p>
              <div className="underline small"></div>
            </div>
          </div>
        </div>

        <p className="notice">নিয়মিত পৌরকর পরিশোধ করুন।</p>
      </div>



    </div>
  );
};

export default TaxBill;
