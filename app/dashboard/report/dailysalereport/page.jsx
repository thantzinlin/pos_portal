"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { handleError, httpDelete, httpGet } from "@/utils/rest-client";
import { appContext } from "@/providers/AppProvider";
import money from "mm-money";

export default function DailySaleReport() {
    const { setLoading } = useContext(appContext);
    const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
    const [reportDatas, setReportDatas] = useState([]);
    const [totalQty, setTotalQty] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0.0);
    const [totalDiscount, setTotalDiscount] = useState(0.0);
    const [totalNetSale, setTotalNetSale] = useState(0.0);
    const router = useRouter();

    const fetchItems = useCallback(() => {
        console.log(fromDate, toDate);
        setLoading(true);
        httpGet("/api/daily-sale-report", {
            params: {
                from_date: !fromDate ? moment().format('YYYY-MM-DD') : fromDate,
                to_date: !toDate ? moment().format('YYYY-MM-DD') : toDate,
                shop_id: 2
            },
        }).then((res) => {
            setLoading(false);
            setReportDatas(res.data.data.data_list);
            setTotalQty(res.data.data.total_quantity);
            setTotalAmount(res.data.data.total_amount);
            setTotalDiscount(res.data.data.total_discount);
            setTotalNetSale(res.data.data.total_netsale);
            console.log(res)
        }).catch((err) => {
            setLoading(false);
            handleError(err, router);
        });
    }, [fromDate, toDate, router]);

    useEffect(() => {
        fetchItems();
    }, [router]);

    const handlePdfBtnClick = async () => {
        try {
            setLoading(true);

            const response = await httpGet("/api/daily-sale-report-pdf", { responseType: 'blob' });

            setLoading(false);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const filename = response.headers['content-disposition']?.split('=')[1] || 'downloaded_file.pdf';

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            console.log('File downloaded successfully');
        } catch (error) {
            setLoading(false);
            console.error('Error downloading file:', error.message);
            handleError(error, router);
        }
    };

    const handleExcelBtnClick = async () => {
        try {
            setLoading(true);

            const response = await httpGet("/api/daily-sale-report-excel", { responseType: 'blob' });

            setLoading(false);

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const filename = response.headers['content-disposition']?.split('=')[1] || 'downloaded_file.xlsx';

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            console.log('File downloaded successfully');
        } catch (error) {
            setLoading(false);
            console.error('Error downloading file:', error.message);
            handleError(error, router);
        }
    };

    return (
        <div className="px-2 pr-6 pb-6">
            {/* Search Box */}
            <div className="mb-4 justify-between flex">
                <div className="w-auto pr-2">
                    <input
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        type="date"
                        className="p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                    />
                </div>
                <div className="w-auto pl-2">
                    <input
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        type="date"
                        className="p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                    />
                </div>
                <div className="w-auto pl-2">
                    <button onClick={fetchItems} className="view-history text-white font-bold py-2 px-4 rounded">
                        Search
                    </button>
                </div>
                <div className="flex-1 flex items-end justify-end">
                    {reportDatas && reportDatas.length > 0 && <span title="Pdf Download" className="pr-3" onClick={handlePdfBtnClick}><PDFIcon /></span>}
                    {reportDatas && reportDatas.length > 0 && <span title="Excel Download" onClick={handleExcelBtnClick}><ExcelIcon /></span>}
                </div>
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr className=" text-left">
                            <th className="py-2 px-4 border-b">Id</th>
                            <th className="py-2 px-4 border-b">Item Name</th>
                            <th className="py-2 px-4 border-b text-center">Quantity</th>
                            <th className="py-2 px-4 border-b text-center">Amount</th>
                            <th className="py-2 px-4 border-b text-center">Discount</th>
                            <th className="py-2 px-4 border-b text-center">Net Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportDatas.map((reportData) => (
                            <tr key={reportData.item_id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{reportData.item_id}</td>
                                <td className="py-2 px-4 border-b">{reportData.item_name}</td>
                                <td className="py-2 px-4 border-b text-right">{reportData.quantity}</td>
                                <td className="py-2 px-4 border-b text-right">
                                    {money.format(reportData.amount)}
                                </td>
                                <td className="py-1 px-2 border-b text-right">{money.format(reportData.discount)}</td>
                                <td className="py-1 px-2 border-b text-right">{money.format(reportData.netsale)}</td>
                            </tr>
                        ))}
                        {reportDatas && reportDatas.length > 0 && <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b font-bold text-center" colSpan={2}>Total</td>
                            <td className="py-2 px-4 border-b text-right font-bold">{totalQty}</td>
                            <td className="py-2 px-4 border-b text-right font-bold">
                                {money.format(totalAmount)}
                            </td>
                            <td className="py-1 px-2 border-b text-right font-bold">{money.format(totalDiscount)}</td>
                            <td className="py-1 px-2 border-b text-right font-bold">{money.format(totalNetSale)}</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function PDFIcon() {
    return (
        <div className="flex over:bg-gray-200 hover:cursor-pointer">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 384 512"><path fill="#f40f02" d="M181.9 256.1c-5-16-4.9-46.9-2-46.9c8.4 0 7.6 36.9 2 46.9m-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7c18.3-7 39-17.2 62.9-21.9c-12.7-9.6-24.9-23.4-34.5-40.8M86.1 428.1c0 .8 13.2-5.4 34.9-40.2c-6.7 6.3-29.1 24.5-34.9 40.2M248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24m-8 171.8c-20-12.2-33.3-29-42.7-53.8c4.5-18.5 11.6-46.6 6.2-64.2c-4.7-29.4-42.4-26.5-47.8-6.8c-5 18.3-.4 44.1 8.1 77c-11.6 27.6-28.7 64.6-40.8 85.8c-.1 0-.1.1-.2.1c-27.1 13.9-73.6 44.5-54.5 68c5.6 6.9 16 10 21.5 10c17.9 0 35.7-18 61.1-61.8c25.8-8.5 54.1-19.1 79-23.2c21.7 11.8 47.1 19.5 64 19.5c29.2 0 31.2-32 19.7-43.4c-13.9-13.6-54.3-9.7-73.6-7.2M377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9m-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9c37.1 15.8 42.8 9 42.8 9" /></svg>
            </div>
        </div>
    );
}
function ExcelIcon() {
    return (
        <div className="flex over:bg-gray-200 hover:cursor-pointer">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="#1d6f42" d="M15.534 1.36L14.309 0H4.662c-.696 0-.965.516-.965.919v3.63H5.05V1.653c0-.154.13-.284.28-.284h6.903c.152 0 .228.027.228.152v4.82h4.913c.193 0 .268.1.268.246v11.77c0 .246-.1.283-.25.283H5.33a.287.287 0 0 1-.28-.284V17.28H3.706v1.695c-.018.6.302 1.025.956 1.025H18.06c.7 0 .939-.507.939-.969V5.187l-.35-.38zm-1.698.16l.387.434l2.596 2.853l.143.173h-2.653c-.2 0-.327-.033-.38-.1c-.053-.065-.084-.17-.093-.313zm-1.09 9.147h4.577v1.334h-4.578zm0-2.666h4.577v1.333h-4.578zm0 5.333h4.577v1.334h-4.578zM1 5.626v10.667h10.465V5.626zm5.233 6.204l-.64.978h.64V14H3.016l2.334-3.51l-2.068-3.156H5.01L6.234 9.17l1.223-1.836h1.727L7.112 10.49L9.449 14H7.656z" /></svg>
            </div>
        </div>
    );
}