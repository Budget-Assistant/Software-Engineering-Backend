const ExcelJS = require('exceljs');
const path = require('path');
const transaction = require('./models/TransactionModel');

async function exportMongoToExcel(user) {
    try {
        // 獲取下載資料夾路徑  
        console.log(`user : ${user}`)
        const downloadsDir = path.join(__dirname, 'download');
        const outputFilePath = path.join(downloadsDir, `transaction.xlsx`);

        console.log(`Output file path: ${outputFilePath}`); // 打印路徑

        // 從資料庫查詢指定 user 的交易紀錄
        const transactions = await transaction.find({ user: user })
            .sort({ date: 1 }) // 1表示升序，-1表示降序
            .lean();

        if (transactions.length === 0) {
            throw new Error(`No records found for user: ${user}`);
        }

        // 創建 Excel 工作簿和工作表
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaction');

        // 添加表頭
        worksheet.columns = [
            { header: 'Date',        key: 'date', width: 15 },
            { header: 'Amount',      key: 'amount', width: 10 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Type',        key: 'type', width: 10 },
        ];

        // 添加資料
        transactions.forEach(item => {
            const date = new Date(item.date);
            const localDate = date.toLocaleDateString('en-US'); // 設定當地時間格式，根據需要調整 'en-US'
        
            worksheet.addRow({
                date: localDate, // 當地時間格式的日期
                amount: item.amount,
                description: item.description,
                type: item.type,
            });
        });

        // 自動調整列寬
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                if (cell.value) {
                    maxLength = Math.max(maxLength, cell.value.toString().length);
                }
            });
            column.width = maxLength + 2; // 增加額外空間
        });

        // 寫入檔案
        await workbook.xlsx.writeFile(outputFilePath);
        console.log(`Excel file has been exported to ${outputFilePath}`);
        return outputFilePath;
    } catch (error) {
        console.error('Error exporting Excel:', error);
        throw error;
    }
}

module.exports = exportMongoToExcel;
