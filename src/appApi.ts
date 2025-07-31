// A more standard and correct way to define common API routes in a TypeScript project is to use `export` instead of `module.exports`.
// Also, fix the typo "singup" to "signup".

export const API_ROUTES = {
    login: "http://localhost:5000/api/auth/login",
    signup: "http://localhost:5000/api/auth/signup",
    getdashboardData: "http://localhost:5000/api/user/dashboard",
    withdraw: "http://localhost:5000/api/user/withdraw",
    withdrawList: "http://localhost:5000/api/user/withdrawals-list",
    updateWithdrawalStatus: "http://localhost:5000/api/user/withdraw-update-status",
};