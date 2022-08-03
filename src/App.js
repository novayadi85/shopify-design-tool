import { useState, useEffect, Suspense  } from "react";
import { AppProvider, Frame, SkeletonPage, Layout, Card, TextContainer, SkeletonDisplayText, SkeletonBodyText } from "@shopify/polaris";
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Header from "@components/Header";
import Sidebar from "@components/sidebar/Sidebar";
import SimpleContent from "./pages/Content";

import './i18n';

import Login from "./pages/Login";
import Iframe from "./components/Iframe";

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const loadingPageMarkup = (
		<SkeletonPage>
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<TextContainer>
							<SkeletonDisplayText size="small" />
							<SkeletonBodyText lines={9} />
						</TextContainer>
					</Card>
				</Layout.Section>
			</Layout>
		</SkeletonPage>
	);

	const loadingNavigationMarkup = (
		<div style={{minWidth: '18.5rem'}}>
			<SkeletonPage>
				<Layout>
					<Layout.Section>
						<Card sectioned>
							<TextContainer>
								<SkeletonDisplayText size="small" />
								<SkeletonBodyText lines={9} />
							</TextContainer>
						</Card>
						<Card sectioned>
							<TextContainer>
								<SkeletonDisplayText size="small" />
								<SkeletonBodyText lines={9} />
							</TextContainer>
						</Card>
					</Layout.Section>
				</Layout>
			</SkeletonPage>
		</div>
	);

	const actualPageMarkup = (
		<SimpleContent handle={ useParams() } />
	);

	const PageMarkup = (
		<Iframe/>
	);

	const actualNavigationMarkup = (
		<Sidebar />
	);
    
  	const pageMarkup = isLoading ? loadingPageMarkup : PageMarkup;
	const navigationMarkup = isLoading ? loadingNavigationMarkup : actualNavigationMarkup;
	
	const MainApp = () => {
		return (
			<Frame
				topBar={<Header />}
				navigation={navigationMarkup}
			>
			{pageMarkup}
			</Frame>
		)
	}

	useEffect(() => {
		setIsLoading(true);
		setTimeout(() => {
			return setIsLoading(false);
		}, 500);
	}, []);
  
	
    return (
		<Router basename={'/builder'}>
			<Suspense fallback="loading">
				<AppProvider>
					<>
					<Routes>
						<Route path="/*" element={<MainApp/>}/>
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/content/:page" element={<SimpleContent />} />
					</Routes>
					</>
							
				</AppProvider>
			</Suspense>
		</Router>
      );
}
export default App;