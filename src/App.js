import { AppProvider, Frame } from "@shopify/polaris";
import { BrowserRouter as Router } from 'react-router-dom';
import Header from "@components/Header";
import Sidebar from "@components/sidebar/Sidebar";


function App() {
  const navigationMarkup = (
      <Router>
        <Sidebar />
      </Router>
    );
    
    return (
        <div>
          <AppProvider>
            <Frame
                topBar={<Header />}
                navigation={navigationMarkup}
            >
            </Frame>
          </AppProvider>
        </div>
      );
}
export default App;