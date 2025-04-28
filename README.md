Dashboard - Spending Summary
Overview
This is a spending summary dashboard built using React, Next.js, and Recharts for visualizing transaction data. The app allows users to filter transactions based on a selected timeframe (week or month) and see a bar chart representation of spending across different categories. The data is fetched from an API and grouped by categories such as Travel, Food, Utilities, Shopping, etc.

Features
Transaction Data Filtering: The ability to filter transactions by "This Week" or "This Month."

Bar Chart Visualization: Display of a bar chart showing spending in different categories (e.g., Travel, Food, Shopping, etc.).

Total Spending: A dynamic display of the total amount spent during the selected timeframe.

Timeframe Selection: A dropdown to switch between "This Week" and "This Month" view.

Responsive Design: The layout adapts to different screen sizes, ensuring a smooth experience on mobile and desktop devices.

Tech Stack
Frontend: React, Next.js, TailwindCSS, shadcn ui, framer-motions

Charting: Recharts

State Management: React useState and useEffect hooks

API: Axios for fetching transaction data

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
Replace your-api-url with the URL of your backend API that serves transaction data.

Run the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
Open the app in your browser at http://localhost:3000.

How it Works
Fetching Transaction Data: The app fetches transaction data from the API at /api/get-transactions. The response is expected to return an array of transactions, each containing:

_id: Unique identifier of the transaction

amount: The amount spent in the transaction

category: The category of the transaction (e.g., Travel, Food, etc.)

date: The date of the transaction in ISO format (e.g., 2025-04-01)

Filtering Transactions: The transactions are filtered based on the selected timeframe (This Week or This Month). The app compares the date field with the current date to include only transactions from the specified period.

Displaying the Chart: Once the transactions are filtered, they are grouped by category, and the spending amount for each category is calculated. This data is then displayed as a bar chart using the Recharts library.

Total Spent: The app dynamically calculates and displays the total amount spent during the selected timeframe by summing the amounts from the grouped transaction data.

Folder Structure
bash
Copy
Edit
/app
    (main-app)
        /dashboard              # Dashboard page displaying the spending summary
        /transactions 
    (auth)
        /signin              # signin page 
        /signup           # signup page
    /components             # Custom UI components (e.g., Select, Chart)
    /api                    # API routes for handling backend data (e.g., /api get-transactions)