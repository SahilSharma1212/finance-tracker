Dashboard - Spending Summary
Overview
This is a spending summary dashboard built using React, Next.js, and Recharts for visualizing transaction data. The app allows users to filter transactions based on a selected timeframe (week or month) and see a bar chart representation of spending across different categories. Users can also compare their actual spending with their budgeted amounts to see how they are tracking.

The app allows users to set budgets for different categories (e.g., Travel, Food, Shopping) and visualize their spending against the set budget in the same interface.

Features
1. Transaction Data Filtering:
Filter transactions by "This Week" or "This Month."

View spending data based on selected timeframe.

2. Bar Chart Visualization:
Display of a bar chart showing spending across different categories such as Travel, Food, Utilities, Shopping, etc.

3. Total Spending:
A dynamic display of the total amount spent during the selected timeframe.

4. Timeframe Selection:
Dropdown to switch between "This Week" and "This Month" view.

5. Budget Comparison:
Users can set budgets for each category.

See how much has been spent against the budget for each category in a visual summary.

6. Spending vs Budget:
Compare actual spending against budgeted amounts.

Display remaining budget for each category.

7. Responsive Design:
Layout adapts to different screen sizes, ensuring a smooth experience on both mobile and desktop devices.

Tech Stack
Frontend: React, Next.js, TailwindCSS, shadcn UI, Framer Motion

Charting: Recharts

State Management: React useState and useEffect hooks

API: Axios for fetching transaction data and budget data

UI Components: Custom components from the UI library (e.g., Select component for filtering timeframe)

Setup
Prerequisites
Node.js and npm/yarn installed on your machine.

A basic understanding of React and Next.js is recommended.

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/spending-dashboard.git
cd spending-dashboard
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Create an .env file in the root of the project and set the following variables:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://your-api-url
Replace your-api-url with the URL of your backend API that serves transaction data and budgeting data.

Run the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
Open the app in your browser at http://localhost:3000.

How it Works
1. Fetching Transaction Data:
The app fetches transaction data from the API at /api/get-transactions. The response is expected to return an array of transactions, each containing:

_id: Unique identifier of the transaction

amount: The amount spent in the transaction

category: The category of the transaction (e.g., Travel, Food, etc.)

date: The date of the transaction in ISO format (e.g., 2025-04-01)

2. Fetching Budget Data:
The app also fetches budget data from /api/get-budgets. Each budget contains:

category: The name of the category (e.g., Travel, Food, etc.)

amount: The allocated budget amount for the category

startDate: The start date of the budget period (e.g., "2025-04-01")

timeframe: The timeframe for the budget, either "week" or "month"

Users can set and track budgets for different categories like Travel, Food, Utilities, etc.

3. Filtering Transactions:
Transactions are filtered based on the selected timeframe (This Week or This Month). The app compares the date field of each transaction with the current date to include only transactions from the specified period.

4. Displaying the Chart:
Once the transactions are filtered, they are grouped by category, and the spending amount for each category is calculated. This data is then displayed as a bar chart using the Recharts library.

5. Displaying Budget vs Actual:
After fetching the budget data, the app compares the actual spending against the allocated budget for each category. It displays a visual representation of the spending (in a bar chart) and the remaining budget for each category.

A total summary is dynamically calculated to show the total amount spent, total budgeted, and remaining amount for each category.

6. Timeframe Selection:
Users can select either "This Week" or "This Month" from a dropdown to filter transactions based on their timeframe.

7. Budgeting Integration:
Users can set budgets for each category through the app. Once set, the app calculates how much has been spent in each category compared to the budget and shows the remaining budget.

This feature helps users track their spending behavior and stay within their desired budget.

Folder Structure
bash
Copy
Edit
/app
    (main-app)
        /dashboard              # Dashboard page displaying the spending summary
        /transactions
        /budgeting 
    (auth)
        /signin              # signin page 
        /signup              # signup page
    /budget-comparison           
    /components             # Custom UI components (e.g., Select, Chart)
    /api                    # API routes for handling backend data (e.g., /api get-transactions)