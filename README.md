# Weather App

This is a simple weather application designed to display weather information for a specific location, in this case, Islamabad. The app provides current weather data like temperature, humidity, wind speed, and sky conditions. It also offers various visual representations such as bar charts, doughnut charts, and line charts to present historical weather data. Additionally, the app includes **Gemini Chatbot Integration** for providing real-time responses and assistance within the app.

## Features

- **Current Weather**: Displays the current temperature, humidity, wind speed, and weather condition (e.g., clear sky).
- **Search Functionality**: Allows users to search for weather data for different locations.
- **User Interface**: A visually appealing design with charts, tables, and other components.
  - **Vertical Bar Chart**: Displays temperature data for several days.
  - **Doughnut Chart**: Represents the current weather condition visually.
  - **Line Chart**: Shows a line graph of the temperature trends over several days.
  - **Data Table**: Shows weather data in a table format with temperature, humidity, wind speed, and conditions for multiple timestamps. Sorting functionality is provided to organize data by specific columns.
- **Pagination**: Allows users to navigate between pages in the table view.
- **Gemini Chatbot Integration**: The application is integrated with the **Gemini** chatbot to provide:
  - **Real-time Assistance**: Users can interact with the chatbot to get weather information or ask questions about the app.
  - **Guided Navigation**: The chatbot helps users navigate through the app and its features.
  - **Natural Language Processing**: Enables the chatbot to respond to queries in conversational language, improving user experience.
  - **Weather Insights**: The chatbot can provide insights and additional details about the weather data, such as forecast predictions or suggestions based on weather conditions.
- **Responsive Design**: The app adjusts its layout based on screen size.

## Components

### 1. **Current Weather Section**
   - Displays current temperature , humidity, wind speed , and weather conditions.
   - Icons are used to enhance the visual appeal of weather data (e.g., temperature, wind speed, clear sky).

### 2. **Charts**
   - **Vertical Bar Chart**: Visualizes temperature data for five consecutive days.
   - **Doughnut Chart**: Represents the current weather condition.
   - **Line Chart**: Shows temperature changes over five days.

### 3. **Table View**
   - Displays weather data in a detailed tabular format for specific timestamps.
   - Columns include:
     - **Date**: Timestamp of the weather data.
     - **Temperature (°C)**: Temperature at the given time.
     - **Humidity (%)**: Humidity percentage.
     - **Wind Speed (m/s)**: Wind speed at the given time.
     - **Weather**: Description of the weather condition (e.g., clear sky).
   - Sorting functionality to organize data based on selected criteria.
   - Pagination to navigate between different pages of data.

### 4. **Sidebar**
   - Contains buttons for navigating between the **Dashboard** and **Tables** view.

### 5. **Gemini Chatbot**
   - Displays a chatbot window where users can type in messages or questions.
   - **Chat Support**: Responds to user queries related to weather data, app navigation, and general assistance.
   - Uses **Natural Language Processing** to interact with users in a conversational style.

### 6. **User Profile**
   - Displays the username (`Hassan Ilyas`) with a profile picture at the top right corner.

## Technologies Used

- **HTML/CSS**: For layout and design of the application.
- **JavaScript**: For dynamic behavior such as updating weather data and rendering charts and tables.
- **Weather API**: For fetching real-time weather data for specific locations.
- **Chart.js**: Used for creating the bar, doughnut, and line charts.
- **DataTables**: Used for table sorting and pagination functionalities.
- **Gemini Integration**: For chatbot functionality, providing real-time user assistance and interactions.

## How to Run the App

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/weather-app.git
    ```

2. Open the `index.html` file in your browser to launch the application.

3. To fetch real-time weather data, integrate your own API key by modifying the `apiKey` in the script section of `app.js`.

4. Ensure **Gemini** chatbot is properly configured to handle user interactions.

## Future Enhancements

- Improve the responsiveness of charts and tables for mobile devices.
- Add more weather details like precipitation, UV index, etc.
- Implement data caching for faster loading times.
- Expand chatbot capabilities with **Gemini** to provide deeper weather insights and general app usage tips.

## Author

- **Hassan Ilyas** - Developer of this weather app.
