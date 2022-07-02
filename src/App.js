import {
    AppProvider,
    Frame,
    Navigation
} from "@shopify/polaris";

  
import { useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
    const navigationMarkup = (
        <Sidebar/>
    );
    
    const skipToContentRef = useRef(null);

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