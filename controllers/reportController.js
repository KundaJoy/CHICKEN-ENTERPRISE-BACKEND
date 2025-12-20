import Chicken from '../models/Chicken.js';
import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';

// ✅ Overall Summary
export const getSummary = async (req, res) => {
  try {
    const totalChickens = await Chicken.countDocuments();

    // ✅ FIXED: sales = quantity * price
    const totalSalesData = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);
    const totalSales = totalSalesData[0]?.total || 0;

    const totalExpensesData = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = totalExpensesData[0]?.total || 0;

    const profit = totalSales - totalExpenses;

    res.status(200).json({
      totalChickens,
      totalSales,
      totalExpenses,
      profit,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Error generating summary', error });
  }
};

// ✅ Daily Report
export const getDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sales = await Sale.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);

    const expenses = await Expense.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSales = sales[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;

    res.status(200).json({
      date: today.toISOString().split('T')[0],
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
    });
  } catch (error) {
    console.error('Error generating daily report:', error);
    res.status(500).json({ message: 'Error generating daily report', error });
  }
};

// ✅ Weekly Report
export const getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const sales = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);

    const expenses = await Expense.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSales = sales[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;

    res.status(200).json({
      weekStart: startOfWeek.toISOString().split('T')[0],
      weekEnd: endOfWeek.toISOString().split('T')[0],
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
    });
  } catch (error) {
    console.error('Error generating weekly report:', error);
    res.status(500).json({ message: 'Error generating weekly report', error });
  }
};

// ✅ Monthly Report
export const getMonthlyReport = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const sales = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);

    const expenses = await Expense.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSales = sales[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;

    res.status(200).json({
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
    });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ message: 'Error generating monthly report', error });
  }
};

// ✅ Last 6 Months Report
export const getLast6MonthsReport = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const salesData = await Sale.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: {
            $sum: { $multiply: ['$quantity', '$price'] }
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const expenseData = await Expense.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalExpenses: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const sale = salesData.find(
        (s) => s._id.year === year && s._id.month === date.getMonth() + 1
      );
      const expense = expenseData.find(
        (e) => e._id.year === year && e._id.month === date.getMonth() + 1
      );

      const totalSales = sale?.totalSales || 0;
      const totalExpenses = expense?.totalExpenses || 0;

      months.push({
        month: `${month} ${year}`,
        totalSales,
        totalExpenses,
        profit: totalSales - totalExpenses,
      });
    }

    res.status(200).json(months);
  } catch (error) {
    console.error('Error generating last 6 months report:', error);
    res.status(500).json({
      message: 'Error generating last 6 months report',
      error,
    });
  }
};
